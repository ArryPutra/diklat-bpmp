"use server"

import { Prisma } from "@/generated/prisma/client"
import logger from "@/lib/logger"
import prisma from "@/lib/prisma"
import { DiklatSchema } from "@/schemas/diklat.schema"
import { revalidatePath } from "next/cache"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

export async function getAllDiklatAction({
    search = "",
    page = "1",
    metodeDiklatId,
    statusPendaftaranDiklatId = [1, 2, 3],
    statusPelaksanaanAcaraDiklatId = [1, 2, 3],
    take = 10,
    where: customWhere = {}
}: {
    search?: string
    page?: string
    metodeDiklatId?: number
    statusPendaftaranDiklatId?: number[]
    statusPelaksanaanAcaraDiklatId?: number[]
    take?: number
    where?: Prisma.DiklatWhereInput
}) {
    const _search = search.trim();

    const defaultWhere: Prisma.DiklatWhereInput = {
        ...(metodeDiklatId && { metodeDiklatId }),
        ...(statusPendaftaranDiklatId && {
            statusPendaftaranDiklatId: {
                in: statusPendaftaranDiklatId
            }
        }),
        ...(statusPelaksanaanAcaraDiklatId && {
            statusPelaksanaanAcaraDiklatId: {
                in: statusPelaksanaanAcaraDiklatId
            }
        }),
        ...(_search && {
            OR: [
                {
                    judul: {
                        contains: _search,
                        mode: "insensitive"
                    },
                },
            ]
        })
    };

    const where: Prisma.DiklatWhereInput = {
        AND: [
            defaultWhere,
            customWhere
        ]
    };

    const data = await prisma.diklat.findMany({
        skip: (parseInt(page) - 1) * take,
        take,
        where,
        include: {
            metodeDiklat: true,
            statusPendaftaranDiklat: true,
            statusPelaksanaanAcaraDiklat: true,
            pesertaDiklat: true,
            materiDiklat: true
        },
        orderBy: {
            createdAt: "desc",
        },
    });

    const total = await prisma.diklat.count({ where });

    return {
        data,
        total,
    };
}


export async function getDiklatAction(diklatId: string) {
    const diklat = await prisma.diklat.findUnique({
        where: { id: diklatId },
        include: {
            metodeDiklat: true,
            statusPendaftaranDiklat: true,
            statusPelaksanaanAcaraDiklat: true,
            pesertaDiklat: true,
            materiDiklat: {
                include: {
                    narasumber: {
                        select: {
                            user: {
                                select: {
                                    name: true
                                }
                            }
                        }
                    }
                }
            }
        }
    })

    return diklat
}

export async function isDiklatAcaraAktifByDiklatIdAction(diklatId: string) {
    const diklat = await prisma.diklat.findUnique({
        where: {
            id: diklatId
        },
        select: {
            tanggalMulaiAcara: true,
            tanggalSelesaiAcara: true
        }
    })

    if (!diklat) {
        return false
    }

    const apakahAktif = isTanggalPelaksanaanDiklatAktif(
        diklat.tanggalMulaiAcara,
        diklat.tanggalSelesaiAcara
    )

    return apakahAktif
}

export async function createDiklatAction(
    prevState: any,
    formData: FormData
) {
    const values = Object.fromEntries(formData)
    const resultData = DiklatSchema.safeParse(values)

    if (!resultData.success) {
        return {
            success: false,
            errors: resultData.error.flatten().fieldErrors,
            values: values
        }
    }

    let diklat

    try {
        const statusPendaftaranDiklatId = getStatusPendaftaranDiklatId(
            resultData.data.tanggalBukaPendaftaran,
            resultData.data.tanggalTutupPendaftaran
        )
        const statusPelaksanaanAcaraDiklatId = getStatusPelaksanaanAcaraDiklatId(
            resultData.data.tanggalMulaiAcara,
            resultData.data.tanggalSelesaiAcara
        )

        diklat = await prisma.diklat.create({
            data: {
                metodeDiklatId: resultData.data.metodeDiklatId,
                statusPendaftaranDiklatId: statusPendaftaranDiklatId,
                statusPelaksanaanAcaraDiklatId: statusPelaksanaanAcaraDiklatId,
                judul: resultData.data.judul,
                deskripsi: resultData.data.deskripsi,
                tujuan: resultData.data.tujuan,
                maksimalKuota: resultData.data.maksimalKuota,
                lokasi: resultData.data.lokasi,
                tanggalBukaPendaftaran: resultData.data.tanggalBukaPendaftaran,
                tanggalTutupPendaftaran: resultData.data.tanggalTutupPendaftaran,
                tanggalMulaiAcara: resultData.data.tanggalMulaiAcara,
                tanggalSelesaiAcara: resultData.data.tanggalSelesaiAcara,
                targetSasaran: resultData.data.targetSasaran,
                persyaratanPeserta: resultData.data.persyaratanPeserta,
                minimalKehadiranPersen: resultData.data.minimalKehadiranPersen
            }
        })
    } catch (error) {
        logger.error("Gagal buat diklat", "diklat-action", error)

        return {
            success: false
        }
    }

    (await cookies()).set("flash", `Diklat dengan judul "${resultData.data.judul}" berhasil ditambahkan. Silahkan tambahkan materi.`, {
        path: "/admin/kelola-diklat",
        maxAge: 10
    })

    redirect(`/admin/kelola-diklat/daftar-diklat/${diklat.id}/materi`)
}

export async function updateDiklatAction(
    id: string,
    prevState: any,
    formData: FormData
) {
    const values = Object.fromEntries(formData)

    const resultData = DiklatSchema.safeParse(Object.fromEntries(formData))

    if (!resultData.success) {
        return {
            success: false,
            errors: resultData.error.flatten().fieldErrors,
            values
        }
    }

    const materiDiLuarRentang = await prisma.materiDiklat.findFirst({
        where: {
            diklatId: id,
            OR: [
                {
                    tanggalPelaksanaan: {
                        lt: resultData.data.tanggalMulaiAcara
                    }
                },
                {
                    tanggalPelaksanaan: {
                        gt: resultData.data.tanggalSelesaiAcara
                    }
                }
            ]
        },
        select: {
            judul: true
        }
    })

    if (materiDiLuarRentang) {
        return {
            success: false,
            errors: {
                tanggalMulaiAcara: [
                    `Tidak dapat memperbarui tanggal acara diklat karena materi "${materiDiLuarRentang.judul}" berada di luar rentang tanggal acara.`
                ],
                tanggalSelesaiAcara: [
                    "Silakan untuk memperbarui tanggal materi diklat terlebih dahulu agar berada di dalam rentang tanggal mulai dan selesai diklat."
                ]
            },
            values
        }
    }

    try {
        const statusPendaftaranDiklatId = getStatusPendaftaranDiklatId(
            resultData.data.tanggalBukaPendaftaran,
            resultData.data.tanggalTutupPendaftaran
        )
        const statusPelaksanaanAcaraDiklatId = getStatusPelaksanaanAcaraDiklatId(
            resultData.data.tanggalMulaiAcara,
            resultData.data.tanggalSelesaiAcara
        )

        await prisma.diklat.update({
            where: {
                id: id
            },
            data: {
                metodeDiklatId: resultData.data.metodeDiklatId,
                statusPendaftaranDiklatId: statusPendaftaranDiklatId,
                statusPelaksanaanAcaraDiklatId: statusPelaksanaanAcaraDiklatId,
                judul: resultData.data.judul,
                deskripsi: resultData.data.deskripsi,
                tujuan: resultData.data.tujuan,
                maksimalKuota: resultData.data.maksimalKuota,
                tanggalBukaPendaftaran: resultData.data.tanggalBukaPendaftaran,
                tanggalTutupPendaftaran: resultData.data.tanggalTutupPendaftaran,
                tanggalMulaiAcara: resultData.data.tanggalMulaiAcara,
                tanggalSelesaiAcara: resultData.data.tanggalSelesaiAcara,
                targetSasaran: resultData.data.targetSasaran,
                persyaratanPeserta: resultData.data.persyaratanPeserta,
                minimalKehadiranPersen: resultData.data.minimalKehadiranPersen
            }
        })
    } catch (error) {
        logger.error("Gagal update diklat", "diklat-action", error)

        return {
            success: false
        }
    }

    (await cookies()).set("flash", `Diklat dengan judul "${resultData.data.judul}" berhasil diperbarui.`, {
        path: "/admin/kelola-diklat/daftar-diklat",
        maxAge: 10
    })

    redirect("/admin/kelola-diklat/daftar-diklat")
}

export async function deleteDiklatAction(
    prevState: any,
    formData: FormData
) {
    const diklatId = formData.get("diklatId") as string

    let diklatDihapus

    try {
        diklatDihapus = await prisma.diklat.delete({
            where: {
                id: diklatId
            }
        })
    } catch (error) {
        logger.error("Gagal hapus diklat", "diklat-action", error)

        return {
            success: false
        }
    }

    (await cookies()).set("flash", `Diklat dengan judul "${diklatDihapus.judul}" berhasil dihapus.`, {
        path: "/admin/kelola-diklat/daftar-diklat",
        maxAge: 10
    })

    revalidatePath("/admin/kelola-diklat")
}

function getStatusPendaftaranDiklatId(
    tanggalBukaPendaftaran: Date,
    tanggalTutupPendaftaran: Date
): number {
    const tanggalSekarang = new Date()
    const buka = new Date(tanggalBukaPendaftaran)
    const tutup = new Date(tanggalTutupPendaftaran)

    // set ke 23:59:59.999
    tutup.setHours(23, 59, 59, 999)

    if (tanggalSekarang < buka) {
        return 1 // Belum buka
    } else if (tanggalSekarang <= tutup) {
        return 2 // Sedang buka
    } else {
        return 3 // Sudah tutup
    }
}

function getStatusPelaksanaanAcaraDiklatId(
    tanggalMulaiAcara: Date,
    tanggalSelesaiAcara: Date
): number {
    const tanggalSekarang = new Date()
    const mulai = new Date(tanggalMulaiAcara)
    const selesai = new Date(tanggalSelesaiAcara)

    selesai.setHours(23, 59, 59, 999)

    if (tanggalSekarang < mulai) {
        return 1 // Belum dimulai
    } else if (tanggalSekarang <= selesai) {
        return 2 // Sedang berlangsung
    } else {
        return 3 // Selesai
    }
}

function isTanggalPelaksanaanDiklatAktif(
    tanggalMulaiAcara: Date,
    tanggalSelesaiAcara: Date,
    tanggalAcuan: Date = new Date()
): boolean {
    const tanggalSekarang = new Date(tanggalAcuan)
    const mulai = new Date(tanggalMulaiAcara)
    const selesai = new Date(tanggalSelesaiAcara)

    tanggalSekarang.setHours(0, 0, 0, 0)
    mulai.setHours(0, 0, 0, 0)
    selesai.setHours(23, 59, 59, 999)

    return tanggalSekarang >= mulai && tanggalSekarang <= selesai
}