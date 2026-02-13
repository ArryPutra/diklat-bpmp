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
    take = 10,
    where: customWhere = {}
}: {
    search?: string
    page?: string
    metodeDiklatId?: number
    statusPendaftaranDiklatId?: number[]
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
            pesertaDiklat: true
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
            pesertaDiklat: true
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
        const statusPendaftaranDiklatId = getStatusPendaftaranDiklatId(
            resultData.data.tanggalBukaPendaftaran,
            resultData.data.tanggalTutupPendaftaran
        )

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
        const statusPendaftaranDiklatId = getStatusPendaftaranDiklatId(
            resultData.data.tanggalBukaPendaftaran,
            resultData.data.tanggalTutupPendaftaran
        )

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

    (await cookies()).set("flash", `Diklat dengan judul "${resultData.data.judul}" berhasil diperbarui.`, {
        path: "/admin/kelola-diklat",
        maxAge: 10
    })

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