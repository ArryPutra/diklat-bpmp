"use server"

import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { MetodeDiklat, StatusPendaftaranDiklat, TipeAktivitas } from "@/generated/prisma/enums";
import { z } from "zod";
import { revalidatePath } from "next/cache";

// =====================
// DASHBOARD STATS
// =====================

export async function getDashboardStats() {
    try {
        const [
            totalDiklat,
            diklatAktif,
            totalInstansi,
            instansiMenunggu,
            totalPeserta,
            pesertaBulanIni
        ] = await Promise.all([
            prisma.diklat.count(),
            prisma.diklat.count({
                where: {
                    isActive: true,
                    tanggalSelesai: { gte: new Date() }
                }
            }),
            prisma.registrasiInstansi.count(),
            prisma.registrasiInstansi.count({
                where: { statusRegistrasiInstansiId: 1 } // Menunggu
            }),
            prisma.pendaftaranDiklat.count(),
            prisma.pendaftaranDiklat.count({
                where: {
                    createdAt: {
                        gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
                    }
                }
            })
        ]);

        return {
            success: true,
            data: {
                totalDiklat,
                diklatAktif,
                totalInstansi,
                instansiMenunggu,
                totalPeserta,
                pesertaBulanIni
            }
        };
    } catch (error) {
        console.error("Error fetching dashboard stats:", error);
        return { success: false, message: "Gagal mengambil statistik" };
    }
}

// =====================
// REGISTRASI INSTANSI
// =====================

export async function getRegistrasiInstansiList(params?: {
    page?: number;
    limit?: number;
    status?: number;
    search?: string;
}) {
    const page = params?.page || 1;
    const limit = params?.limit || 10;
    const skip = (page - 1) * limit;

    try {
        const where: any = {};

        if (params?.status) {
            where.statusRegistrasiInstansiId = params.status;
        }

        if (params?.search) {
            where.OR = [
                { nama: { contains: params.search, mode: 'insensitive' } },
                { email: { contains: params.search, mode: 'insensitive' } }
            ];
        }

        const [data, total] = await Promise.all([
            prisma.registrasiInstansi.findMany({
                where,
                include: {
                    statusRegistrasiInstansi: true,
                    registrasiPicInstansi: true
                },
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit
            }),
            prisma.registrasiInstansi.count({ where })
        ]);

        return {
            success: true,
            data,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            }
        };
    } catch (error) {
        console.error("Error fetching registrasi instansi:", error);
        return { success: false, message: "Gagal mengambil data instansi" };
    }
}

export async function updateStatusRegistrasiInstansi(
    id: string,
    statusId: number,
    userId?: string
) {
    try {
        // Get instansi data dengan PIC
        const instansiData = await prisma.registrasiInstansi.findUnique({
            where: { id },
            include: { 
                statusRegistrasiInstansi: true,
                registrasiPicInstansi: true
            }
        });

        if (!instansiData) {
            return { success: false, message: "Instansi tidak ditemukan" };
        }

        // Update status
        const instansi = await prisma.registrasiInstansi.update({
            where: { id },
            data: { statusRegistrasiInstansiId: statusId },
            include: { statusRegistrasiInstansi: true }
        });

        // Jika disetujui (statusId === 3), buat akun user untuk PIC
        let accountCreated = false;
        if (statusId === 3 && instansiData.registrasiPicInstansi) {
            const pic = instansiData.registrasiPicInstansi;
            
            // Cek apakah user sudah ada
            const existingUser = await prisma.user.findUnique({
                where: { email: pic.email }
            });

            if (!existingUser) {
                // Buat akun user menggunakan better-auth
                try {
                    await auth.api.signUpEmail({
                        body: {
                            email: pic.email,
                            password: instansiData.password, // Password dari registrasi instansi
                            name: pic.nama
                        }
                    });
                    accountCreated = true;
                } catch (signUpError: any) {
                    console.error("Error creating user account:", signUpError);
                    // Tetap lanjutkan approve meski user gagal dibuat
                }
            } else {
                // User sudah ada sebelumnya
                accountCreated = true;
            }
        }

        // Log aktivitas
        const statusNama = instansi.statusRegistrasiInstansi.nama;
        await prisma.aktivitas.create({
            data: {
                aksi: statusId === 3 ? "Pendaftaran disetujui" : statusId === 4 ? "Pendaftaran ditolak" : "Status diperbarui",
                detail: `${instansi.nama} - Status: ${statusNama}${accountCreated ? ' (Akun user dibuat)' : ''}`,
                tipe: statusId === 3 ? TipeAktivitas.APPROVE : statusId === 4 ? TipeAktivitas.REJECT : TipeAktivitas.UPDATE,
                userId
            }
        });

        revalidatePath('/dashboard/admin');
        revalidatePath('/dashboard/admin/instansi');
        
        return { 
            success: true, 
            data: instansi,
            accountCreated,
            message: statusId === 3 
                ? `Instansi berhasil disetujui${accountCreated ? '. Akun login untuk PIC telah dibuat.' : ''}`
                : statusId === 4
                ? 'Instansi berhasil ditolak'
                : 'Status berhasil diperbarui'
        };
    } catch (error) {
        console.error("Error updating status:", error);
        return { success: false, message: "Gagal mengubah status" };
    }
}

// =====================
// DIKLAT CRUD
// =====================

const DiklatSchema = z.object({
    nama: z.string().min(1, "Nama diklat wajib diisi"),
    deskripsi: z.string().optional(),
    metode: z.nativeEnum(MetodeDiklat),
    target: z.string().optional(),
    tanggalMulai: z.coerce.date(),
    tanggalSelesai: z.coerce.date(),
    waktuMulai: z.string().optional(),
    waktuSelesai: z.string().optional(),
    batasPendaftaran: z.coerce.date(),
    kuota: z.coerce.number().min(1, "Kuota minimal 1"),
    lokasi: z.string().optional(),
    linkMeeting: z.string().optional(),
    materi: z.array(z.string()).optional(),
    persyaratan: z.array(z.string()).optional(),
    fasilitas: z.array(z.string()).optional(),
    gambar: z.string().optional(),
    isActive: z.boolean().optional()
});

export async function getDiklatList(params?: {
    page?: number;
    limit?: number;
    isActive?: boolean;
    search?: string;
}) {
    const page = params?.page || 1;
    const limit = params?.limit || 10;
    const skip = (page - 1) * limit;

    try {
        const where: any = {};

        if (params?.isActive !== undefined) {
            where.isActive = params.isActive;
        }

        if (params?.search) {
            where.OR = [
                { nama: { contains: params.search, mode: 'insensitive' } },
                { deskripsi: { contains: params.search, mode: 'insensitive' } }
            ];
        }

        const [data, total] = await Promise.all([
            prisma.diklat.findMany({
                where,
                include: {
                    _count: {
                        select: { pendaftaranDiklat: true }
                    }
                },
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit
            }),
            prisma.diklat.count({ where })
        ]);

        return {
            success: true,
            data,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            }
        };
    } catch (error) {
        console.error("Error fetching diklat:", error);
        return { success: false, message: "Gagal mengambil data diklat" };
    }
}

export async function getDiklatById(id: string) {
    try {
        const diklat = await prisma.diklat.findUnique({
            where: { id },
            include: {
                pendaftaranDiklat: {
                    orderBy: { createdAt: 'desc' }
                },
                _count: {
                    select: { pendaftaranDiklat: true }
                }
            }
        });

        if (!diklat) {
            return { success: false, message: "Diklat tidak ditemukan" };
        }

        return { success: true, data: diklat };
    } catch (error) {
        console.error("Error fetching diklat:", error);
        return { success: false, message: "Gagal mengambil data diklat" };
    }
}

export async function createDiklat(data: z.infer<typeof DiklatSchema>, userId?: string) {
    const result = DiklatSchema.safeParse(data);

    if (!result.success) {
        return {
            success: false,
            message: result.error.flatten().fieldErrors
        };
    }

    try {
        const diklat = await prisma.diklat.create({
            data: {
                nama: result.data.nama,
                deskripsi: result.data.deskripsi,
                metode: result.data.metode,
                target: result.data.target,
                tanggalMulai: result.data.tanggalMulai,
                tanggalSelesai: result.data.tanggalSelesai,
                waktuMulai: result.data.waktuMulai,
                waktuSelesai: result.data.waktuSelesai,
                batasPendaftaran: result.data.batasPendaftaran,
                kuota: result.data.kuota,
                lokasi: result.data.lokasi,
                linkMeeting: result.data.linkMeeting,
                materi: result.data.materi ?? [],
                persyaratan: result.data.persyaratan ?? [],
                fasilitas: result.data.fasilitas ?? [],
                gambar: result.data.gambar,
                isActive: result.data.isActive ?? true
            }
        });

        // Log aktivitas
        await prisma.aktivitas.create({
            data: {
                aksi: "Diklat baru ditambahkan",
                detail: diklat.nama,
                tipe: TipeAktivitas.CREATE,
                userId
            }
        });

        revalidatePath('/dashboard/admin');
        return { success: true, data: diklat };
    } catch (error) {
        console.error("Error creating diklat:", error);
        return { success: false, message: "Gagal membuat diklat" };
    }
}

export async function updateDiklat(id: string, updateData: Partial<z.infer<typeof DiklatSchema>>, userId?: string) {
    try {
        const diklat = await prisma.diklat.update({
            where: { id },
            data: {
                ...(updateData.nama && { nama: updateData.nama }),
                ...(updateData.deskripsi !== undefined && { deskripsi: updateData.deskripsi }),
                ...(updateData.metode && { metode: updateData.metode }),
                ...(updateData.target !== undefined && { target: updateData.target }),
                ...(updateData.tanggalMulai && { tanggalMulai: updateData.tanggalMulai }),
                ...(updateData.tanggalSelesai && { tanggalSelesai: updateData.tanggalSelesai }),
                ...(updateData.waktuMulai !== undefined && { waktuMulai: updateData.waktuMulai }),
                ...(updateData.waktuSelesai !== undefined && { waktuSelesai: updateData.waktuSelesai }),
                ...(updateData.batasPendaftaran && { batasPendaftaran: updateData.batasPendaftaran }),
                ...(updateData.kuota && { kuota: updateData.kuota }),
                ...(updateData.lokasi !== undefined && { lokasi: updateData.lokasi }),
                ...(updateData.linkMeeting !== undefined && { linkMeeting: updateData.linkMeeting }),
                ...(updateData.materi && { materi: updateData.materi }),
                ...(updateData.persyaratan && { persyaratan: updateData.persyaratan }),
                ...(updateData.fasilitas && { fasilitas: updateData.fasilitas }),
                ...(updateData.gambar !== undefined && { gambar: updateData.gambar }),
                ...(updateData.isActive !== undefined && { isActive: updateData.isActive }),
            }
        });

        // Log aktivitas
        await prisma.aktivitas.create({
            data: {
                aksi: "Diklat diperbarui",
                detail: diklat.nama,
                tipe: TipeAktivitas.UPDATE,
                userId
            }
        });

        revalidatePath('/dashboard/admin');
        return { success: true, data: diklat };
    } catch (error) {
        console.error("Error updating diklat:", error);
        return { success: false, message: "Gagal memperbarui diklat" };
    }
}

export async function deleteDiklat(id: string, userId?: string) {
    try {
        const diklat = await prisma.diklat.delete({
            where: { id }
        });

        // Log aktivitas
        await prisma.aktivitas.create({
            data: {
                aksi: "Diklat dihapus",
                detail: diklat.nama,
                tipe: TipeAktivitas.DELETE,
                userId
            }
        });

        revalidatePath('/dashboard/admin');
        return { success: true };
    } catch (error) {
        console.error("Error deleting diklat:", error);
        return { success: false, message: "Gagal menghapus diklat" };
    }
}

// =====================
// PENDAFTARAN DIKLAT
// =====================

export async function getPendaftaranDiklatList(params?: {
    diklatId?: string;
    status?: StatusPendaftaranDiklat;
    page?: number;
    limit?: number;
}) {
    const page = params?.page || 1;
    const limit = params?.limit || 10;
    const skip = (page - 1) * limit;

    try {
        const where: any = {};

        if (params?.diklatId) {
            where.diklatId = params.diklatId;
        }

        if (params?.status) {
            where.status = params.status;
        }

        const [data, total] = await Promise.all([
            prisma.pendaftaranDiklat.findMany({
                where,
                include: {
                    diklat: {
                        select: { nama: true, metode: true }
                    }
                },
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit
            }),
            prisma.pendaftaranDiklat.count({ where })
        ]);

        return {
            success: true,
            data,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            }
        };
    } catch (error) {
        console.error("Error fetching pendaftaran:", error);
        return { success: false, message: "Gagal mengambil data pendaftaran" };
    }
}

export async function updateStatusPendaftaranDiklat(
    id: string,
    status: StatusPendaftaranDiklat,
    userId?: string
) {
    try {
        const pendaftaran = await prisma.pendaftaranDiklat.update({
            where: { id },
            data: { status },
            include: { diklat: { select: { nama: true } } }
        });

        // Log aktivitas
        await prisma.aktivitas.create({
            data: {
                aksi: status === StatusPendaftaranDiklat.DITERIMA
                    ? "Peserta diterima"
                    : status === StatusPendaftaranDiklat.DITOLAK
                        ? "Peserta ditolak"
                        : "Status peserta diperbarui",
                detail: `${pendaftaran.namaPeserta} - ${pendaftaran.diklat.nama}`,
                tipe: status === StatusPendaftaranDiklat.DITERIMA ? TipeAktivitas.APPROVE : TipeAktivitas.UPDATE,
                userId
            }
        });

        revalidatePath('/dashboard/admin');
        return { success: true, data: pendaftaran };
    } catch (error) {
        console.error("Error updating pendaftaran:", error);
        return { success: false, message: "Gagal mengubah status pendaftaran" };
    }
}

// =====================
// AKTIVITAS LOG
// =====================

export async function getAktivitasList(limit: number = 10) {
    try {
        const data = await prisma.aktivitas.findMany({
            orderBy: { createdAt: 'desc' },
            take: limit
        });

        return { success: true, data };
    } catch (error) {
        console.error("Error fetching aktivitas:", error);
        return { success: false, message: "Gagal mengambil aktivitas" };
    }
}

export async function createAktivitas(data: {
    aksi: string;
    detail?: string;
    tipe?: TipeAktivitas;
    userId?: string;
}) {
    try {
        const aktivitas = await prisma.aktivitas.create({
            data: {
                aksi: data.aksi,
                detail: data.detail,
                tipe: data.tipe || TipeAktivitas.INFO,
                userId: data.userId
            }
        });

        return { success: true, data: aktivitas };
    } catch (error) {
        console.error("Error creating aktivitas:", error);
        return { success: false, message: "Gagal membuat aktivitas" };
    }
}

// =====================
// WEEKLY STATS (untuk chart)
// =====================

export async function getWeeklyStats() {
    try {
        const today = new Date();
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay());
        startOfWeek.setHours(0, 0, 0, 0);

        const days = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
        const weeklyData = [];

        for (let i = 0; i < 7; i++) {
            const dayStart = new Date(startOfWeek);
            dayStart.setDate(startOfWeek.getDate() + i);

            const dayEnd = new Date(dayStart);
            dayEnd.setDate(dayStart.getDate() + 1);

            const pesertaCount = await prisma.pendaftaranDiklat.count({
                where: {
                    createdAt: {
                        gte: dayStart,
                        lt: dayEnd
                    }
                }
            });

            const diklatCount = await prisma.diklat.count({
                where: {
                    createdAt: {
                        gte: dayStart,
                        lt: dayEnd
                    }
                }
            });

            weeklyData.push({
                day: days[i],
                peserta: pesertaCount,
                diklat: diklatCount
            });
        }

        return { success: true, data: weeklyData };
    } catch (error) {
        console.error("Error fetching weekly stats:", error);
        return { success: false, message: "Gagal mengambil statistik mingguan" };
    }
}
