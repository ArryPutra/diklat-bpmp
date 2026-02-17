"use server"

import { Prisma } from "@/generated/prisma/client";
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
            statusKelulusanPesertaDiklat: true
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
        console.error(error)

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

        // instansi tidak boleh mengubah status menjadi angka 1 atau 3 (menunggu pesertujuan / ditolak)
        const allowedStatus = [2, 4]
        if (!allowedStatus.includes(statusDaftarPesertaDiklatId)) {
            return {
                success: false,
                message: "Status tidak valid"
            }
        }
    }

    try {
        await prisma.pesertaDiklat.update({
            where: {
                id: pesertaDiklatId,
                statusPelaksanaanPesertaDiklatId: null,
                statusKelulusanPesertaDiklatId: null
            },
            data: {
                statusDaftarPesertaDiklatId: statusDaftarPesertaDiklatId
            }
        })

        revalidatePath(currentPath);

        let message: string = ""

        switch (statusDaftarPesertaDiklatId) {
            case 2:
                message = "Peserta berhasil didaftarkan"
                break;
            case 3:
                message = "Peserta berhasil ditolak"
                break;
        }

        return {
            success: true,
            message: message
        }
    } catch (error) {
        console.error(error)

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
        console.error(error)

        return {
            success: false,
            message: "Terjadi kesalahan saat mendaftar peserta"
        };
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
        console.error(error)
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
        console.error(error)
        return {
            success: false,
            message: "Gagal update status kelulusan"
        }
    }
}