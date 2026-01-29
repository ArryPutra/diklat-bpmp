"use server"

import prisma from "@/lib/prisma";
import { StatusPendaftaranDiklat, TipeAktivitas } from "@/generated/prisma/enums";
import { revalidatePath } from "next/cache";

// =====================
// GET INSTANSI BY USER EMAIL
// =====================

export async function getInstansiByUserEmail(email: string) {
    try {
        const instansi = await prisma.registrasiInstansi.findFirst({
            where: {
                registrasiPicInstansi: {
                    email: email
                }
            },
            include: {
                statusRegistrasiInstansi: true,
                registrasiPicInstansi: true
            }
        });

        if (!instansi) {
            return { success: false, message: "Instansi tidak ditemukan" };
        }

        return { success: true, data: instansi };
    } catch (error) {
        console.error("Error fetching instansi:", error);
        return { success: false, message: "Gagal mengambil data instansi" };
    }
}

// =====================
// INSTANSI DASHBOARD STATS
// =====================

export async function getInstansiDashboardStats(instansiId: string) {
    try {
        const [
            totalPeserta,
            pesertaDiterima,
            pesertaMenunggu,
            pesertaHadir,
            diklatDiikuti
        ] = await Promise.all([
            prisma.pendaftaranDiklat.count({
                where: { registrasiInstansiId: instansiId }
            }),
            prisma.pendaftaranDiklat.count({
                where: { 
                    registrasiInstansiId: instansiId,
                    status: StatusPendaftaranDiklat.DITERIMA
                }
            }),
            prisma.pendaftaranDiklat.count({
                where: { 
                    registrasiInstansiId: instansiId,
                    status: StatusPendaftaranDiklat.MENUNGGU
                }
            }),
            prisma.pendaftaranDiklat.count({
                where: { 
                    registrasiInstansiId: instansiId,
                    status: StatusPendaftaranDiklat.HADIR
                }
            }),
            prisma.pendaftaranDiklat.groupBy({
                by: ['diklatId'],
                where: { registrasiInstansiId: instansiId }
            })
        ]);

        return {
            success: true,
            data: {
                totalPeserta,
                pesertaDiterima,
                pesertaMenunggu,
                pesertaHadir,
                diklatDiikuti: diklatDiikuti.length
            }
        };
    } catch (error) {
        console.error("Error fetching instansi stats:", error);
        return { success: false, message: "Gagal mengambil statistik" };
    }
}

// =====================
// GET DIKLAT LIST FOR INSTANSI
// =====================

export async function getDiklatForInstansi(page: number = 1, limit: number = 10, search?: string) {
    try {
        const skip = (page - 1) * limit;
        const where = {
            isActive: true,
            batasPendaftaran: { gte: new Date() },
            ...(search ? {
                OR: [
                    { nama: { contains: search, mode: 'insensitive' as const } },
                    { deskripsi: { contains: search, mode: 'insensitive' as const } }
                ]
            } : {})
        };

        const [data, total] = await Promise.all([
            prisma.diklat.findMany({
                where,
                include: {
                    _count: {
                        select: { pendaftaranDiklat: true }
                    }
                },
                orderBy: { tanggalMulai: 'asc' },
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

// =====================
// GET PESERTA BY INSTANSI
// =====================

export async function getPesertaByInstansi(
    instansiId: string,
    page: number = 1,
    limit: number = 10,
    diklatId?: string,
    status?: string
) {
    try {
        const skip = (page - 1) * limit;
        const where = {
            registrasiInstansiId: instansiId,
            ...(diklatId ? { diklatId } : {}),
            ...(status ? { status: status as StatusPendaftaranDiklat } : {})
        };

        const [data, total] = await Promise.all([
            prisma.pendaftaranDiklat.findMany({
                where,
                include: {
                    diklat: {
                        select: {
                            id: true,
                            nama: true,
                            metode: true,
                            tanggalMulai: true,
                            tanggalSelesai: true
                        }
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
        console.error("Error fetching peserta:", error);
        return { success: false, message: "Gagal mengambil data peserta" };
    }
}

// =====================
// DAFTARKAN PESERTA KE DIKLAT
// =====================

export async function daftarkanPeserta(data: {
    diklatId: string;
    registrasiInstansiId: string;
    namaPeserta: string;
    email: string;
    nomorTelepon: string;
    jabatan?: string;
}) {
    try {
        // Check if diklat exists and has quota
        const diklat = await prisma.diklat.findUnique({
            where: { id: data.diklatId },
            include: {
                _count: {
                    select: { pendaftaranDiklat: true }
                }
            }
        });

        if (!diklat) {
            return { success: false, message: "Diklat tidak ditemukan" };
        }

        if (!diklat.isActive) {
            return { success: false, message: "Diklat tidak aktif" };
        }

        if (new Date() > diklat.batasPendaftaran) {
            return { success: false, message: "Batas pendaftaran sudah lewat" };
        }

        if (diklat._count.pendaftaranDiklat >= diklat.kuota) {
            return { success: false, message: "Kuota diklat sudah penuh" };
        }

        // Check if peserta already registered
        const existing = await prisma.pendaftaranDiklat.findFirst({
            where: {
                diklatId: data.diklatId,
                email: data.email
            }
        });

        if (existing) {
            return { success: false, message: "Peserta dengan email ini sudah terdaftar di diklat ini" };
        }

        const pendaftaran = await prisma.pendaftaranDiklat.create({
            data: {
                diklatId: data.diklatId,
                registrasiInstansiId: data.registrasiInstansiId,
                namaPeserta: data.namaPeserta,
                email: data.email,
                nomorTelepon: data.nomorTelepon,
                jabatan: data.jabatan,
                status: StatusPendaftaranDiklat.MENUNGGU
            }
        });

        // Log aktivitas
        await prisma.aktivitas.create({
            data: {
                aksi: "Peserta didaftarkan",
                detail: `${data.namaPeserta} - ${diklat.nama}`,
                tipe: TipeAktivitas.REGISTER
            }
        });

        revalidatePath('/dashboard/instansi');
        return { success: true, data: pendaftaran };
    } catch (error) {
        console.error("Error registering peserta:", error);
        return { success: false, message: "Gagal mendaftarkan peserta" };
    }
}

// =====================
// BATALKAN PENDAFTARAN PESERTA
// =====================

export async function batalkanPendaftaran(id: string, instansiId: string) {
    try {
        const pendaftaran = await prisma.pendaftaranDiklat.findFirst({
            where: { 
                id,
                registrasiInstansiId: instansiId
            },
            include: {
                diklat: true
            }
        });

        if (!pendaftaran) {
            return { success: false, message: "Pendaftaran tidak ditemukan" };
        }

        if (pendaftaran.status !== StatusPendaftaranDiklat.MENUNGGU) {
            return { success: false, message: "Hanya pendaftaran dengan status menunggu yang bisa dibatalkan" };
        }

        await prisma.pendaftaranDiklat.delete({
            where: { id }
        });

        // Log aktivitas
        await prisma.aktivitas.create({
            data: {
                aksi: "Pendaftaran dibatalkan",
                detail: `${pendaftaran.namaPeserta} - ${pendaftaran.diklat.nama}`,
                tipe: TipeAktivitas.DELETE
            }
        });

        revalidatePath('/dashboard/instansi');
        return { success: true };
    } catch (error) {
        console.error("Error canceling registration:", error);
        return { success: false, message: "Gagal membatalkan pendaftaran" };
    }
}

// =====================
// GET RIWAYAT DIKLAT INSTANSI
// =====================

export async function getRiwayatDiklat(instansiId: string) {
    try {
        const riwayat = await prisma.pendaftaranDiklat.findMany({
            where: { 
                registrasiInstansiId: instansiId,
                OR: [
                    { status: StatusPendaftaranDiklat.HADIR },
                    { 
                        diklat: {
                            tanggalSelesai: { lt: new Date() }
                        }
                    }
                ]
            },
            include: {
                diklat: {
                    select: {
                        id: true,
                        nama: true,
                        metode: true,
                        tanggalMulai: true,
                        tanggalSelesai: true
                    }
                }
            },
            orderBy: { 
                diklat: {
                    tanggalSelesai: 'desc'
                }
            }
        });

        return { success: true, data: riwayat };
    } catch (error) {
        console.error("Error fetching riwayat:", error);
        return { success: false, message: "Gagal mengambil riwayat diklat" };
    }
}

// =====================
// UPDATE PROFIL INSTANSI
// =====================

export async function updateProfilInstansi(
    instansiId: string,
    data: {
        nama?: string;
        alamat?: string;
        nomorTelepon?: string;
    }
) {
    try {
        const instansi = await prisma.registrasiInstansi.update({
            where: { id: instansiId },
            data: {
                ...(data.nama && { nama: data.nama }),
                ...(data.alamat && { alamat: data.alamat }),
                ...(data.nomorTelepon && { nomorTelepon: data.nomorTelepon })
            }
        });

        revalidatePath('/dashboard/instansi');
        return { success: true, data: instansi };
    } catch (error) {
        console.error("Error updating instansi:", error);
        return { success: false, message: "Gagal mengupdate profil instansi" };
    }
}
