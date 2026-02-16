"use server"

import { Prisma } from "@/generated/prisma/client"
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
        }
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

    try {
        await prisma.materiDiklat.create({
            data: {
                diklatId: diklatId,
                judul: resultData.data.judul,
                deskripsi: resultData.data.deskripsi,
                narasumberId: Number(resultData.data.narasumberId),
                waktuMulai: resultData.data.waktuMulai,
                waktuSelesai: resultData.data.waktuSelesai,
            }
        })
    } catch (error) {
        console.log(error)

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

    let diklat

    try {
        diklat = await prisma.materiDiklat.update({
            where: {
                id: materiDiklatId
            },
            data: {
                judul: resultData.data.judul,
                deskripsi: resultData.data.deskripsi,
                narasumberId: Number(resultData.data.narasumberId),
                waktuMulai: resultData.data.waktuMulai,
                waktuSelesai: resultData.data.waktuSelesai,
            }
        })
    } catch (error) {
        console.error(error)

        return {
            success: false,
            message: "Terjadi kesalahan memperbarui diklat"
        }
    }

    (await cookies()).set(
        "flash",
        `Materi diklat dengan judul "${diklat.judul}" berhasil diperbarui.`,
        {
            path: "/admin/kelola-narasumber",
            maxAge: 10
        }
    )

    revalidatePath(`/admin/kelola-diklat/daftar-diklat/${diklat.id}/materi`)

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
        console.log(error)
        return {
            success: false,
            message: "Terjadi kesalahan saat menghapus materi diklat."
        }
    }

    revalidatePath(`/admin/kelola-diklat/daftar-diklat/${diklatId}/materi`)
}