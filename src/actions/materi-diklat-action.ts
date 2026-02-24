"use server"

import { Prisma } from "@/generated/prisma/client"
import logger from "@/lib/logger"
import prisma from "@/lib/prisma"
import { CreateMateriDiklatSchema, UpdateMateriDiklatSchema } from "@/schemas/materi-diklat.schema"
import { revalidatePath } from "next/cache"
import { cookies } from "next/headers"

export async function getAllMateriDiklatAction({
    extraWhere = {},
    diklatId
}: {
    extraWhere?: Prisma.MateriDiklatWhereInput
    diklatId: string
}) {
    const data = await prisma.materiDiklat.findMany({
        include: {
            narasumber: {
                select: {
                    id: true,
                    user: {
                        select: {
                            name: true
                        }
                    }
                }
            }
        },
        where: {
            diklatId: diklatId,
            ...extraWhere
        },
        orderBy: [
            {
                tanggalPelaksanaan: "asc"
            },
            {
                waktuMulai: "asc"
            }
        ]
    })

    return data
}

export async function createMateriDiklatAction(
    diklatId: string,
    prevState: any,
    formData: FormData
) {
    const values = Object.fromEntries(formData)
    const resultData = CreateMateriDiklatSchema.safeParse(values)

    if (!resultData.success) {
        return {
            success: false,
            errors: resultData.error.flatten().fieldErrors,
            values: values
        }
    }

    // pastikan tanggal pelaksanaan tidak lebih kecil dari diklat
    const diklat = await prisma.diklat.findUnique({
        where: {
            id: diklatId
        },
        select: {
            tanggalMulaiAcara: true,
            tanggalSelesaiAcara: true,
            lokasi: true
        }
    })

    const tanggalPelaksanaanMateriDiklat = new Date(resultData.data.tanggalPelaksanaan).toISOString().split("T")[0]
    const tanggalMulaiAcaraDiklat = new Date(diklat?.tanggalMulaiAcara!).toISOString().split("T")[0]
    const tanggalSelesaiAcaraDiklat = new Date(diklat?.tanggalSelesaiAcara!).toISOString().split("T")[0]

    if (
        tanggalPelaksanaanMateriDiklat < tanggalMulaiAcaraDiklat
        ||
        tanggalPelaksanaanMateriDiklat > tanggalSelesaiAcaraDiklat
    ) {
        return {
            success: false,
            errors: {
                tanggalPelaksanaan: ["Tanggal pelaksanaan tidak boleh lebih kecil dari tanggal mulai diklat"]
            },
            values: values
        }
    }

    try {
        await prisma.materiDiklat.create({
            data: {
                diklatId: diklatId,
                judul: resultData.data.judul,
                deskripsi: resultData.data.deskripsi,
                narasumberId: Number(resultData.data.narasumberId),
                tanggalPelaksanaan: resultData.data.tanggalPelaksanaan,
                waktuMulai: resultData.data.waktuMulai,
                waktuSelesai: resultData.data.waktuSelesai,
                lokasi: resultData.data.lokasi ?? diklat?.lokasi,
                linkMateri: resultData.data.linkMateri
            }
        })
    } catch (error) {
        logger.error("Gagal buat materi diklat", "materi-diklat-action", error)

        return {
            success: false,
            message: "Terjadi kesalahan saat menambahkan materi diklat"
        }
    }

    revalidatePath(`/admin/kelola-diklat/daftar-diklat/${diklatId}/materi`)

    return {
        success: true,
    }
}

export async function updateMateriDiklatAction(
    materiDiklatId: number,
    prevState: any,
    formData: FormData
) {
    const values = Object.fromEntries(formData)
    const resultData = UpdateMateriDiklatSchema.safeParse(values)

    if (!resultData.success) {
        return {
            success: false,
            errors: resultData.error.flatten().fieldErrors,
            values: values
        }
    }

    const materiDiklat = await prisma.materiDiklat.findUnique({
        where: {
            id: materiDiklatId
        },
        select: {
            diklatId: true,
            lokasi: true
        }
    })

    const diklat = await prisma.diklat.findUnique({
        where: {
            id: materiDiklat?.diklatId
        },
    })

    const tanggalPelaksanaanMateriDiklat = new Date(resultData.data.tanggalPelaksanaan).toISOString().split("T")[0]
    const tanggalMulaiAcaraDiklat = new Date(diklat?.tanggalMulaiAcara!).toISOString().split("T")[0]
    const tanggalSelesaiAcaraDiklat = new Date(diklat?.tanggalSelesaiAcara!).toISOString().split("T")[0]

    if (
        tanggalPelaksanaanMateriDiklat < tanggalMulaiAcaraDiklat
        ||
        tanggalPelaksanaanMateriDiklat > tanggalSelesaiAcaraDiklat
    ) {
        return {
            success: false,
            errors: {
                tanggalPelaksanaan: ["Tanggal pelaksanaan tidak boleh lebih kecil dari tanggal mulai acara diklat atau lebih besar dari tanggal selesai acara diklat"]
            },
            values: values
        }
    }

    let diklatBaru

    try {
        diklatBaru = await prisma.materiDiklat.update({
            where: {
                id: materiDiklatId
            },
            data: {
                judul: resultData.data.judul,
                deskripsi: resultData.data.deskripsi,
                narasumberId: Number(resultData.data.narasumberId),
                tanggalPelaksanaan: resultData.data.tanggalPelaksanaan,
                waktuMulai: resultData.data.waktuMulai,
                waktuSelesai: resultData.data.waktuSelesai,
                lokasi: resultData.data.lokasi ?? materiDiklat?.lokasi,
                linkMateri: resultData.data.linkMateri
            }
        })
    } catch (error) {
        logger.error("Gagal update materi diklat", "materi-diklat-action", error)

        return {
            success: false,
            message: "Terjadi kesalahan memperbarui diklat"
        }
    }

    (await cookies()).set(
        "flash",
        `Materi diklat dengan judul "${diklatBaru.judul}" berhasil diperbarui.`,
        {
            path: "/admin/kelola-narasumber",
            maxAge: 10
        }
    )

    revalidatePath(`/admin/kelola-diklat/daftar-diklat/${diklatBaru.id}/materi`)

    return {
        success: true,
    }
}

export async function deleteMateriDiklatAction(
    materiId: number,
    diklatId: string
) {
    try {
        await prisma.materiDiklat.delete({
            where: {
                id: materiId
            }
        })
    } catch (error) {
        logger.error("Gagal hapus materi diklat", "materi-diklat-action", error)
        return {
            success: false,
            message: "Terjadi kesalahan saat menghapus materi diklat."
        }
    }

    revalidatePath(`/admin/kelola-diklat/daftar-diklat/${diklatId}/materi`)
}