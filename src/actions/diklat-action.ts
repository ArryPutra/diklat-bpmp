"use server"

import { Prisma } from "@/generated/prisma/client"
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
    take = 10
}: {
    search?: string
    page?: string
    metodeDiklatId?: number
    statusPendaftaranDiklatId?: number[]
    take?: number
}) {
    const _search = search.trim();

    const where: Prisma.DiklatWhereInput = {
        metodeDiklatId: metodeDiklatId,
        statusPendaftaranDiklatId: {
            in: statusPendaftaranDiklatId
        },
        OR: [
            {
                judul: {
                    contains: _search,
                    mode: "insensitive"
                },
            },
        ]
    }

    const data = await prisma.diklat.findMany({
        skip: parseInt(page) * 10 - 10,
        take: take,
        where,
        include: {
            metodeDiklat: true,
            statusPendaftaranDiklat: true
        },
        orderBy: {
            createdAt: "desc",
        },
    });


    const total = await prisma.diklat.count({ where });

    return {
        data: data,
        total: total,
    };
}

export async function getDiklatByIdAction(id: string) {
    const diklat = await prisma.diklat.findUnique({
        where: { id: id },
        include: {
            metodeDiklat: true,
            statusPendaftaranDiklat: true
        }
    })

    return diklat
}

export async function createDiklatAction(
    prevState: any,
    formData: FormData
) {
    const resultData = DiklatSchema.safeParse(Object.fromEntries(formData))

    if (!resultData.success) {
        return {
            success: false,
            errors: resultData.error.flatten().fieldErrors,
            values: {
                judul: formData.get("judul")?.toString(),
                deskripsi: formData.get("deskripsi")?.toString(),
                tujuan: formData.get("tujuan")?.toString(),
                targetSasaran: formData.get("targetSasaran")?.toString(),
                metodeDiklatId: formData.get("metodeDiklatId")?.toString(),
                maksimalKuota: formData.get("maksimalKuota")?.toString(),
                lokasi: formData.get("lokasi")?.toString(),
                tanggalMulaiAcara: formData.get("tanggalMulaiAcara")?.toString(),
                tanggalSelesaiAcara: formData.get("tanggalSelesaiAcara")?.toString(),
                tanggalBukaPendaftaran: formData.get("tanggalBukaPendaftaran")?.toString(),
                tanggalTutupPendaftaran: formData.get("tanggalTutupPendaftaran")?.toString(),
            }
        }
    }

    try {
        let statusPendaftaranDiklatId: number

        const tanggalSekarang = new Date()

        const buka = new Date(resultData.data.tanggalBukaPendaftaran)
        const tutup = new Date(resultData.data.tanggalTutupPendaftaran)

        // set ke 23:59:59.999
        tutup.setHours(23, 59, 59, 999)

        if (tanggalSekarang < buka) {
            statusPendaftaranDiklatId = 1
        } else if (tanggalSekarang <= tutup) {
            statusPendaftaranDiklatId = 2
        } else {
            statusPendaftaranDiklatId = 3
        }

        await prisma.diklat.create({
            data: {
                metodeDiklatId: resultData.data.metodeDiklatId,
                statusPendaftaranDiklatId: statusPendaftaranDiklatId,
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
                materiPelatihan: resultData.data.materiPelatihan,
                persyaratanPeserta: resultData.data.persyaratanPeserta,
            }
        })
    } catch (error) {
        console.log(error)

        return {
            success: false
        }
    }

    (await cookies()).set("flash", `Diklat dengan judul "${resultData.data.judul}" berhasil ditambahkan.`, {
        path: "/admin/kelola-diklat",
        maxAge: 10
    })

    redirect("/admin/kelola-diklat")
}

export async function updateDiklatAction(
    id: string,
    prevState: any,
    formData: FormData
) {
    const resultData = DiklatSchema.safeParse(Object.fromEntries(formData))

    if (!resultData.success) {
        return {
            success: false,
            errors: resultData.error.flatten().fieldErrors,
            values: {
                judul: formData.get("judul")?.toString(),
                deskripsi: formData.get("deskripsi")?.toString(),
                tujuan: formData.get("tujuan")?.toString(),
                targetSasaran: formData.get("targetSasaran")?.toString(),
                metodeDiklatId: formData.get("metodeDiklatId")?.toString(),
                maksimalKuota: formData.get("maksimalKuota")?.toString(),
                tanggalMulaiAcara: formData.get("tanggalMulaiAcara")?.toString(),
                tanggalSelesaiAcara: formData.get("tanggalSelesaiAcara")?.toString(),
                tanggalBukaPendaftaran: formData.get("tanggalBukaPendaftaran")?.toString(),
                tanggalTutupPendaftaran: formData.get("tanggalTutupPendaftaran")?.toString(),
            }
        }
    }

    try {
        let statusPendaftaranDiklatId: number

        const tanggalSekarang = new Date()

        const buka = new Date(resultData.data.tanggalBukaPendaftaran)
        const tutup = new Date(resultData.data.tanggalTutupPendaftaran)

        // set ke 23:59:59.999
        tutup.setHours(23, 59, 59, 999)

        if (tanggalSekarang < buka) {
            statusPendaftaranDiklatId = 1
        } else if (tanggalSekarang <= tutup) {
            statusPendaftaranDiklatId = 2
        } else {
            statusPendaftaranDiklatId = 3
        }

        await prisma.diklat.update({
            where: {
                id: id
            },
            data: {
                metodeDiklatId: resultData.data.metodeDiklatId,
                statusPendaftaranDiklatId: statusPendaftaranDiklatId,
                judul: resultData.data.judul,
                deskripsi: resultData.data.deskripsi,
                tujuan: resultData.data.tujuan,
                maksimalKuota: resultData.data.maksimalKuota,
                tanggalBukaPendaftaran: resultData.data.tanggalBukaPendaftaran,
                tanggalTutupPendaftaran: resultData.data.tanggalTutupPendaftaran,
                tanggalMulaiAcara: resultData.data.tanggalMulaiAcara,
                tanggalSelesaiAcara: resultData.data.tanggalSelesaiAcara,
                targetSasaran: resultData.data.targetSasaran
            }
        })
    } catch (error) {
        console.log(error)

        return {
            success: false
        }
    }

    redirect("/admin/kelola-diklat")
}

export async function deleteDiklatAction(
    prevState: any,
    formData: FormData
) {
    const diklatId = formData.get("diklatId") as string

    console.log(diklatId)

    try {
        await prisma.diklat.delete({
            where: {
                id: diklatId
            }
        })

        revalidatePath("/admin/kelola-diklat")

        return {
            success: true
        }
    } catch (error) {
        console.log(error)

        return {
            success: false
        }
    }


}