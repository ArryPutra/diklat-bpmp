"use server"

import logger from "@/lib/logger"
import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { getCurrentNarasumber } from "./narasumber-action"

export async function upsertManyAbsensiPesertaDiklatAction({
    materiDiklatId,
    absensi,
}: {
    materiDiklatId: number
    absensi: {
        pesertaDiklatId: number
        statusAbsensiId: number
    }[]
}) {
    if (!materiDiklatId || absensi.length === 0) {
        return {
            success: false,
            message: "Data absensi tidak lengkap"
        }
    }

    const currentNarasumber = await getCurrentNarasumber()

    if (!currentNarasumber) {
        return {
            success: false,
            message: "Anda tidak diizinkan melakukan aksi ini"
        }
    }

    const materiDiklat = await prisma.materiDiklat.findFirst({
        where: {
            id: materiDiklatId,
            narasumberId: currentNarasumber.id,
        },
        select: {
            diklatId: true,
            diklat: {
                select: {
                    statusPelaksanaanAcaraDiklatId: true,
                }
            }
        }
    })

    if (!materiDiklat) {
        return {
            success: false,
            message: "Materi diklat tidak ditemukan atau bukan milik Anda"
        }
    }

    if (materiDiklat.diklat?.statusPelaksanaanAcaraDiklatId === 3) {
        return {
            success: false,
            message: "Absensi tidak dapat diubah karena diklat sudah selesai"
        }
    }

    const pesertaDiklatIds = absensi.map((item) => item.pesertaDiklatId)

    const pesertaDiklatValid = await prisma.pesertaDiklat.count({
        where: {
            id: {
                in: pesertaDiklatIds,
            },
            diklatId: materiDiklat.diklatId,
            statusDaftarPesertaDiklatId: 2,
        }
    })

    if (pesertaDiklatValid !== pesertaDiklatIds.length) {
        return {
            success: false,
            message: "Sebagian data peserta tidak valid"
        }
    }

    try {
        await prisma.$transaction(async (tx) => {
            await Promise.all(
                absensi.map((item) =>
                    tx.absensiPesertaDiklat.upsert({
                        where: {
                            pesertaDiklatId_materiDiklatId: {
                                pesertaDiklatId: item.pesertaDiklatId,
                                materiDiklatId,
                            }
                        },
                        update: {
                            statusAbsensiId: item.statusAbsensiId,
                        },
                        create: {
                            pesertaDiklatId: item.pesertaDiklatId,
                            materiDiklatId,
                            statusAbsensiId: item.statusAbsensiId,
                        }
                    })
                )
            )

            const totalPesertaValid = await tx.pesertaDiklat.count({
                where: {
                    diklatId: materiDiklat.diklatId,
                    statusDaftarPesertaDiklatId: 2,
                }
            })

            const totalPesertaTerabsensi = await tx.absensiPesertaDiklat.count({
                where: {
                    materiDiklatId,
                    pesertaDiklat: {
                        diklatId: materiDiklat.diklatId,
                        statusDaftarPesertaDiklatId: 2,
                    }
                }
            })

            await tx.materiDiklat.update({
                where: {
                    id: materiDiklatId,
                },
                data: {
                    isSelesai:
                        totalPesertaValid > 0 && totalPesertaTerabsensi === totalPesertaValid,
                }
            })
        })

        revalidatePath(`/narasumber/diklat/aktif/${materiDiklatId}`)

        return {
            success: true,
            message: "Absensi peserta berhasil disimpan"
        }
    } catch (error) {
        logger.error("Gagal simpan absensi peserta", "absensi-peserta-diklat-action", error)

        return {
            success: false,
            message: "Terjadi kesalahan saat menyimpan absensi peserta"
        }
    }
}

export async function upsertManyAbsensiPesertaDiklatFormAction(
    _previousState: unknown,
    formData: FormData
) {
    const materiDiklatIdRaw = formData.get('materiDiklatId')
    const materiDiklatId = Number(materiDiklatIdRaw)

    if (!materiDiklatIdRaw || Number.isNaN(materiDiklatId)) {
        return {
            success: false,
            message: 'ID materi diklat tidak valid'
        }
    }

    const absensiEntries = Array.from(formData.entries())
        .filter(([key, value]) => key.startsWith('statusAbsensi-') && typeof value === 'string' && value.length > 0)
        .map(([key, value]) => {
            const pesertaDiklatId = Number(key.replace('statusAbsensi-', ''))
            const statusAbsensiId = Number(value)

            return {
                pesertaDiklatId,
                statusAbsensiId,
            }
        })
        .filter((item) => !Number.isNaN(item.pesertaDiklatId) && !Number.isNaN(item.statusAbsensiId))

    if (absensiEntries.length === 0) {
        return {
            success: false,
            message: 'Pilih status absensi minimal untuk satu peserta'
        }
    }

    const statusAbsensiIds = Array.from(new Set(absensiEntries.map((item) => item.statusAbsensiId)))

    const statusAbsensiValid = await prisma.statusAbsensiPesertaDiklat.count({
        where: {
            id: {
                in: statusAbsensiIds
            }
        }
    })

    if (statusAbsensiValid !== statusAbsensiIds.length) {
        return {
            success: false,
            message: 'Status absensi tidak valid'
        }
    }

    return upsertManyAbsensiPesertaDiklatAction({
        materiDiklatId,
        absensi: absensiEntries,
    })
}