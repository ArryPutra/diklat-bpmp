"use server"

import { Prisma } from "@/generated/prisma/client";
import logger from "@/lib/logger";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getCurrentInstansi } from "./instansi-action";

export async function getAllPesertaDiklatAction({
    search = "",
    page = "1",
    take = 10,
    diklatId,
    extraWhere = {}
}: {
    search?: string
    page?: string
    take?: number
    diklatId?: string
    extraWhere?: Prisma.PesertaDiklatWhereInput
}) {
    const _search = search.trim();

    const where: Prisma.PesertaDiklatWhereInput = {
        diklatId: diklatId,
        peserta: {
            user: {
                OR: [
                    {
                        name: {
                            contains: _search,
                            mode: "insensitive"
                        },
                    },
                ]
            }
        },
        ...extraWhere
    }

    const data = await prisma.pesertaDiklat.findMany({
        skip: parseInt(page) * 10 - 10,
        take: take,
        where,
        include: {
            peserta: {
                include: {
                    user: true,
                    instansi: {
                        include: {
                            user: true
                        }
                    }
                }
            },
            statusDaftarPesertaDiklat: true,
            statusPelaksanaanPesertaDiklat: true,
            statusKelulusanPesertaDiklat: true,
        },
        orderBy: {
            createdAt: "desc",
        },
    });


    const total = await prisma.pesertaDiklat.count({ where });

    return {
        data: data,
        total: total,
    };
}

export async function createPendaftarPesertaDiklatAction(
    daftarPesertaId: any[],
    diklatId: string,
    prevState: any,
) {
    // pastikan daftar peserta ada data
    if (daftarPesertaId.length === 0) {
        return {
            success: false,
            message: "Daftar peserta tidak boleh kosong"
        };
    }

    const currentInstansi = await getCurrentInstansi();

    if (currentInstansi === null) {
        return {
            success: false
        }
    }

    // cek diklat masih buka pendaftaran
    const diklat = await prisma.diklat.findUnique({
        where: {
            id: diklatId,
            statusPendaftaranDiklatId: 2
        }
    });

    if (!diklat) {
        return {
            success: false,
            message: "Pendaftaran diklat ditutup"
        };
    }

    // cek peserta berasal dari instansi yang sama
    for (const pesertaId of daftarPesertaId) {
        const pesertaData = await prisma.peserta.findFirst({
            where: {
                id: pesertaId,
                instansiId: currentInstansi.id
            }
        });

        if (!pesertaData) {
            return {
                success: false,
                message: "Pendaftaran diklat hanya dapat dilakukan melalui instansi masing-masing peserta"
            };
        }
    }

    // cek daftar peserta bahwa belum pernah daftar diklat ini
    for (const pesertaId of daftarPesertaId) {
        const pesertaDiklat = await prisma.pesertaDiklat.findFirst({
            where: {
                diklatId: diklatId, // cek diklat
                pesertaId: pesertaId // cek peserta
                // jadi jika ada diklat dan peserta yang sudah ter data maka tidak boleh
            },
            select: {
                peserta: {
                    select: {
                        nik: true,
                        user: {
                            select: {
                                name: true
                            }
                        }
                    }
                }
            }
        });

        if (pesertaDiklat) {
            return {
                success: false,
                message: `Peserta "${pesertaDiklat.peserta.user.name} | ${pesertaDiklat.peserta.nik}" sudah mendaftar diklat ini, silahkan hapus peserta ini dari daftar.`
            };
        }
    }

    try {
        await prisma.pesertaDiklat.createMany({
            data: daftarPesertaId.map((pesertaId) => ({
                diklatId: diklatId,
                pesertaId: pesertaId,
            }))
        });

        revalidatePath("/diklat/" + diklatId);

        return {
            success: true,
            message: "Peserta berhasil didaftarkan, silahkan cek pada menu dashboard untuk melihat daftar peserta diklat"
        };
    } catch (error) {
        logger.error("Gagal daftar peserta diklat", "peserta-diklat-action", error)

        return {
            success: false,
            message: "Terjadi kesalahan saat mendaftar peserta"
        };
    }
}

// export async function getPesertaDiklat(pesertaDiklatId: number) {
//     const pesertaDiklat = await prisma.pesertaDiklat.findUnique({
//         where: {
//             id: pesertaDiklatId
//         },
//         select: {
//             peserta: {
//               select: {
//                 instansi: {
//                     sele
//                 } 
//               }  
//             }
//         }
//     })
// }

export async function updateStatusDaftarPesertaDiklatAction(
    prevState: any,
    formData: FormData
) {
    const pesertaDiklatId = Number(formData.get("pesertaDiklatId"))
    const statusDaftarPesertaDiklatId = Number(formData.get("statusDaftarPesertaDiklatId"))
    const currentPath = formData.get("currentPath") as string

    // jika yang submit instansi
    const currentInstansi = await getCurrentInstansi()
    if (currentInstansi) {
        // pastikan pendaftar peserta diklat id berasal dari instansi yang sama
        const pesertaDiklat = await prisma.pesertaDiklat.findFirst({
            where: {
                id: pesertaDiklatId,
                peserta: {
                    instansiId: currentInstansi.id
                }
            }
        })

        if (!pesertaDiklat) {
            return {
                success: false,
                message: "Tidak diizinkan mengubah data ini"
            }
        }

        const allowedStatus = [2, 4]
        if (
            // instansi tidak boleh mengubah status menjadi angka 1 atau 3 (menunggu pesertujuan / ditolak)
            !allowedStatus.includes(statusDaftarPesertaDiklatId) ||
            // jika status peserta  masih menunggu persetujuan (1) maka tidak boleh diubah oleh instansi
            pesertaDiklat.statusDaftarPesertaDiklatId === 1
        ) {
            return {
                success: false,
                message: "Status tidak valid"
            }
        }
    }

    try {
        const pesertaDiklat = await prisma.pesertaDiklat.update({
            where: {
                id: pesertaDiklatId,
            },
            select: {
                peserta: {
                    select: {
                        user: {
                            select: {
                                name: true
                            }
                        }
                    }
                }
            },
            data: {
                statusDaftarPesertaDiklatId: statusDaftarPesertaDiklatId
            }
        })

        revalidatePath(currentPath);

        let message: string = ""

        switch (statusDaftarPesertaDiklatId) {
            case 2:
                message = `Peserta ${pesertaDiklat.peserta.user.name} berhasil didaftarkan`
                break;
            case 3:
                message = `Peserta ${pesertaDiklat.peserta.user.name} berhasil ditolak`
                break;
        }

        return {
            success: true,
            message: message
        }
    } catch (error) {
        logger.error("Gagal update status diterima", "peserta-diklat-action", error)

        return {
            success: false,
            message: "Terjadi kesalahan saat mendaftar peserta"
        };
    }
}

export async function updateManyStatusDaftarPesertaDiklatAction(
    daftarPendaftarPesertaDiklatId: number[],
    prevState: any,
    formData: FormData
) {
    const statusDaftarPesertaDiklatId = formData.get("statusDaftarPesertaDiklatId") as string
    const currentPath = formData.get("currentPath") as string

    try {
        await prisma.pesertaDiklat.updateMany({
            where: {
                id: {
                    in: daftarPendaftarPesertaDiklatId
                }
            },
            data: {
                statusDaftarPesertaDiklatId: parseInt(statusDaftarPesertaDiklatId)
            }
        })

        revalidatePath(currentPath);

        return {
            success: true,
            message: "Semua peserta berhasil didaftarkan, silahkan cek menu pada daftar peserta diklat"
        }
    } catch (error) {
        logger.error("Gagal daftarkan semua peserta", "peserta-diklat-action", error)

        return {
            success: false,
            message: "Terjadi kesalahan saat mendaftar peserta"
        };
    }
}

export async function publishKelulusanPesertaDiklatAction(
    prevState: any,
    formData: FormData
) {
    const diklatId = formData.get("diklatId") as string
    const currentPath = formData.get("currentPath") as string
    const daftarKelulusanPesertaRaw = formData.get("daftarKelulusanPeserta") as string

    if (!diklatId || !daftarKelulusanPesertaRaw) {
        return {
            success: false,
            message: "Data kelulusan peserta tidak valid"
        }
    }

    let daftarKelulusanPeserta: { pesertaDiklatId: number, statusKelulusanPesertaDiklatId: 2 | 3 }[] = []

    try {
        const parsedDaftarKelulusanPeserta = JSON.parse(daftarKelulusanPesertaRaw)

        if (!Array.isArray(parsedDaftarKelulusanPeserta) || parsedDaftarKelulusanPeserta.length === 0) {
            return {
                success: false,
                message: "Daftar kelulusan peserta tidak valid"
            }
        }

        const dataKelulusanUnik = new Map<number, 2 | 3>()

        for (const item of parsedDaftarKelulusanPeserta) {
            const pesertaDiklatId = Number(item?.pesertaDiklatId)
            const statusKelulusanPesertaDiklatId = Number(item?.statusKelulusanPesertaDiklatId)

            if (
                Number.isNaN(pesertaDiklatId) ||
                (statusKelulusanPesertaDiklatId !== 2 && statusKelulusanPesertaDiklatId !== 3)
            ) {
                return {
                    success: false,
                    message: "Format data kelulusan peserta tidak valid"
                }
            }

            dataKelulusanUnik.set(pesertaDiklatId, statusKelulusanPesertaDiklatId as 2 | 3)
        }

        daftarKelulusanPeserta = Array.from(dataKelulusanUnik.entries()).map(([pesertaDiklatId, statusKelulusanPesertaDiklatId]) => ({
            pesertaDiklatId,
            statusKelulusanPesertaDiklatId
        }))
    } catch (error) {
        logger.error("Gagal baca data kelulusan", "peserta-diklat-action", error)

        return {
            success: false,
            message: "Gagal membaca data kelulusan peserta"
        }
    }

    const daftarPesertaDiterima = await prisma.pesertaDiklat.findMany({
        where: {
            diklatId,
            statusDaftarPesertaDiklatId: 2
        },
        select: {
            id: true
        }
    })

    if (daftarPesertaDiterima.length === 0) {
        return {
            success: false,
            message: "Belum ada peserta diterima pada diklat ini"
        }
    }

    if (daftarKelulusanPeserta.length !== daftarPesertaDiterima.length) {
        return {
            success: false,
            message: "Silakan tentukan kelulusan untuk semua peserta"
        }
    }

    const daftarPesertaDiterimaId = new Set(daftarPesertaDiterima.map((pesertaDiklat) => pesertaDiklat.id))
    const isSemuaPesertaValid = daftarKelulusanPeserta.every((item) => daftarPesertaDiterimaId.has(item.pesertaDiklatId))

    if (!isSemuaPesertaValid) {
        return {
            success: false,
            message: "Data kelulusan peserta tidak sesuai dengan peserta diklat"
        }
    }

    try {
        await prisma.$transaction(async (tx) => {
            const statusPelaksanaanSelesai = await tx.statusPelaksanaanAcaraDiklat.findUnique({
                where: {
                    nama: "Selesai"
                },
                select: {
                    id: true
                }
            })

            if (!statusPelaksanaanSelesai) {
                throw new Error("Status pelaksanaan 'Selesai' tidak ditemukan")
            }

            await Promise.all(
                daftarKelulusanPeserta.map((item) =>
                    tx.pesertaDiklat.update({
                        where: {
                            id: item.pesertaDiklatId
                        },
                        data: {
                            statusKelulusanPesertaDiklatId: item.statusKelulusanPesertaDiklatId
                        }
                    })
                )
            )

            const daftarPesertaLulusId = daftarKelulusanPeserta
                .filter((item) => item.statusKelulusanPesertaDiklatId === 2)
                .map((item) => item.pesertaDiklatId)

            const daftarPesertaTidakLulusId = daftarKelulusanPeserta
                .filter((item) => item.statusKelulusanPesertaDiklatId !== 2)
                .map((item) => item.pesertaDiklatId)

            if (daftarPesertaTidakLulusId.length > 0) {
                await tx.kelulusanPesertaDiklat.deleteMany({
                    where: {
                        pesertaDiklatId: {
                            in: daftarPesertaTidakLulusId
                        }
                    }
                })
            }

            if (daftarPesertaLulusId.length > 0) {
                await tx.kelulusanPesertaDiklat.createMany({
                    data: daftarPesertaLulusId.map((pesertaDiklatId) => ({
                        pesertaDiklatId,
                        kodeSertifikasi: `SERT-${diklatId.slice(-6).toUpperCase()}-${pesertaDiklatId}`
                    })),
                    skipDuplicates: true
                })
            }

            await tx.diklat.update({
                where: {
                    id: diklatId
                },
                data: {
                    statusPelaksanaanAcaraDiklatId: statusPelaksanaanSelesai.id
                }
            })
        })

        revalidatePath(currentPath)
        revalidatePath("/admin/kelola-diklat/verif-kelulusan")

        return {
            success: true,
            message: `Kelulusan ${daftarKelulusanPeserta.length} peserta berhasil diterbitkan dan status pelaksanaan diklat menjadi Selesai`
        }
    } catch (error) {
        logger.error("Gagal terbitkan kelulusan", "peserta-diklat-action", error)

        return {
            success: false,
            message: "Terjadi kesalahan saat menerbitkan kelulusan peserta"
        }
    }
}

/**
 * Fungsi untuk narasumber: Get peserta diklat dengan relasi lengkap
 */
export async function getPesertaNarasumberAction(diklatId: string) {
    const data = await prisma.pesertaDiklat.findMany({
        include: {
            peserta: {
                select: {
                    id: true,
                    user: {
                        select: {
                            name: true,
                            email: true,
                        }
                    },
                    instansi: {
                        select: {
                            user: {
                                select: {
                                    name: true
                                }
                            }
                        }
                    },
                    jabatan: true,
                    nomorTelepon: true,
                }
            },
            statusDaftarPesertaDiklat: {
                select: {
                    id: true,
                    nama: true,
                }
            },
            statusPelaksanaanPesertaDiklat: {
                select: {
                    id: true,
                    nama: true,
                }
            },
            statusKelulusanPesertaDiklat: {
                select: {
                    id: true,
                    nama: true,
                }
            },
        },
        where: {
            diklatId: diklatId,
        },
        orderBy: {
            peserta: {
                user: {
                    name: 'asc'
                }
            }
        }
    })

    return data
}

/**
 * Fungsi untuk update status pelaksanaan peserta (narasumber)
 */
export async function updatePesertaPelaksanaanAction(
    pesertaDiklatId: number,
    statusPelaksanaanPesertaDiklatId: number,
    diklatId: string
) {
    try {
        await prisma.pesertaDiklat.update({
            where: {
                id: pesertaDiklatId
            },
            data: {
                statusPelaksanaanPesertaDiklatId: statusPelaksanaanPesertaDiklatId,
            }
        })

        revalidatePath(`/narasumber/diklat-saya`)

        return {
            success: true,
            message: "Status peserta berhasil diupdate"
        }
    } catch (error) {
        logger.error("Gagal update status peserta", "peserta-diklat-action", error)
        return {
            success: false,
            message: "Gagal update status peserta"
        }
    }
}

/**
 * Fungsi untuk update status kelulusan peserta (narasumber)
 */
export async function updatePesertaKelulusanAction(
    pesertaDiklatId: number,
    statusKelulusanPesertaDiklatId: number,
    diklatId: string
) {
    try {
        await prisma.pesertaDiklat.update({
            where: {
                id: pesertaDiklatId
            },
            data: {
                statusKelulusanPesertaDiklatId: statusKelulusanPesertaDiklatId,
            }
        })

        revalidatePath(`/narasumber/diklat-saya`)

        return {
            success: true,
            message: "Status kelulusan peserta berhasil diupdate"
        }
    } catch (error) {
        logger.error("Gagal update kelulusan peserta", "peserta-diklat-action", error)
        return {
            success: false,
            message: "Gagal update status kelulusan"
        }
    }
}