"use server"

import { Prisma } from "@/generated/prisma/client"
import logger from "@/lib/logger"
import prisma from "@/lib/prisma"
import { randomBytes } from "crypto"
import { revalidatePath } from "next/cache"
import { getCurrentNarasumber } from "./narasumber-action"
import { getCurrentPeserta } from "./peserta-action"

const KODE_ABSENSI_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"
const KODE_ABSENSI_RANDOM_LENGTH = 6
const KODE_ABSENSI_TTL_MINUTES = 180

function generateKodeAbsensiValue() {
    const minutePart = Math.floor(Date.now() / 60000)
        .toString(36)
        .toUpperCase()
        .slice(-4)
        .padStart(4, "0")

    const randomBuffer = randomBytes(KODE_ABSENSI_RANDOM_LENGTH)
    const randomPart = Array.from(randomBuffer)
        .map((byte) => KODE_ABSENSI_ALPHABET[byte % KODE_ABSENSI_ALPHABET.length])
        .join("")

    return `${minutePart}${randomPart}`
}

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

export async function generateKodeUnikAbsensiMateriFormAction(
    _previousState: unknown,
    formData: FormData
) {
    const materiDiklatIdRaw = formData.get("materiDiklatId")
    const materiDiklatId = Number(materiDiklatIdRaw)

    if (!materiDiklatIdRaw || Number.isNaN(materiDiklatId)) {
        return {
            success: false,
            message: "ID materi diklat tidak valid",
        }
    }

    const currentNarasumber = await getCurrentNarasumber()

    if (!currentNarasumber) {
        return {
            success: false,
            message: "Anda tidak diizinkan melakukan aksi ini",
        }
    }

    const materiDiklat = await prisma.materiDiklat.findFirst({
        where: {
            id: materiDiklatId,
            narasumberId: currentNarasumber.id,
        },
        select: {
            id: true,
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
            message: "Materi diklat tidak ditemukan atau bukan milik Anda",
        }
    }

    if (materiDiklat.diklat?.statusPelaksanaanAcaraDiklatId === 3) {
        return {
            success: false,
            message: "Kode absensi tidak dapat diubah karena diklat sudah selesai",
        }
    }

    const now = new Date()
    const expiredAt = new Date(now.getTime() + KODE_ABSENSI_TTL_MINUTES * 60 * 1000)

    for (let attempt = 0; attempt < 8; attempt++) {
        const kodeUnikAbsensi = generateKodeAbsensiValue()

        try {
            const materiDiklatUpdated = await prisma.materiDiklat.update({
                where: {
                    id: materiDiklatId,
                },
                data: {
                    kodeUnikAbsensi,
                    kodeAbsensiDibuatAt: now,
                    kodeAbsensiExpiredAt: expiredAt,
                },
                select: {
                    kodeUnikAbsensi: true,
                    kodeAbsensiDibuatAt: true,
                    kodeAbsensiExpiredAt: true,
                }
            })

            revalidatePath(`/narasumber/diklat/aktif/${materiDiklatId}`)
            revalidatePath(`/narasumber/diklat/riwayat/${materiDiklatId}`)

            return {
                success: true,
                message: "Kode absensi berhasil dibuat",
                kodeUnikAbsensi: materiDiklatUpdated.kodeUnikAbsensi,
                kodeAbsensiDibuatAt: materiDiklatUpdated.kodeAbsensiDibuatAt?.toISOString() ?? null,
                kodeAbsensiExpiredAt: materiDiklatUpdated.kodeAbsensiExpiredAt?.toISOString() ?? null,
            }
        } catch (error) {
            if (
                error instanceof Prisma.PrismaClientKnownRequestError
                && error.code === "P2002"
            ) {
                continue
            }

            logger.error("Gagal generate kode unik absensi", "absensi-peserta-diklat-action", error)

            return {
                success: false,
                message: "Terjadi kesalahan saat membuat kode absensi",
            }
        }
    }

    return {
        success: false,
        message: "Gagal membuat kode absensi unik. Silakan coba lagi",
    }
}

export async function submitAbsensiPesertaByKodeUnikFormAction(
    _previousState: unknown,
    formData: FormData
) {
    const materiDiklatIdRaw = formData.get("materiDiklatId")
    const materiDiklatId = Number(materiDiklatIdRaw)
    const kodeInput = String(formData.get("kodeUnikAbsensi") ?? "")
        .trim()
        .toUpperCase()

    if (!materiDiklatIdRaw || Number.isNaN(materiDiklatId)) {
        return {
            success: false,
            message: "ID materi diklat tidak valid",
        }
    }

    if (!kodeInput) {
        return {
            success: false,
            message: "Kode unik absensi wajib diisi",
        }
    }

    if (kodeInput.length > 32) {
        return {
            success: false,
            message: "Kode unik absensi tidak valid",
        }
    }

    const currentPeserta = await getCurrentPeserta()

    if (!currentPeserta) {
        return {
            success: false,
            message: "Anda tidak diizinkan melakukan aksi ini",
        }
    }

    const materiDiklat = await prisma.materiDiklat.findUnique({
        where: {
            id: materiDiklatId,
        },
        select: {
            id: true,
            diklatId: true,
            kodeUnikAbsensi: true,
            kodeAbsensiExpiredAt: true,
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
            message: "Materi diklat tidak ditemukan",
        }
    }

    if (![1, 2].includes(materiDiklat.diklat?.statusPelaksanaanAcaraDiklatId ?? 0)) {
        return {
            success: false,
            message: "Absensi hanya dapat dilakukan pada diklat aktif",
        }
    }

    const pesertaDiklat = await prisma.pesertaDiklat.findFirst({
        where: {
            diklatId: materiDiklat.diklatId,
            pesertaId: currentPeserta.id,
            statusDaftarPesertaDiklatId: 2,
        },
        select: {
            id: true,
        }
    })

    if (!pesertaDiklat) {
        return {
            success: false,
            message: "Anda tidak terdaftar pada diklat untuk materi ini",
        }
    }

    if (!materiDiklat.kodeUnikAbsensi) {
        return {
            success: false,
            message: "Kode absensi untuk materi ini belum tersedia",
        }
    }

    if (materiDiklat.kodeAbsensiExpiredAt && new Date() > materiDiklat.kodeAbsensiExpiredAt) {
        return {
            success: false,
            message: "Kode absensi sudah kedaluwarsa",
        }
    }

    if (materiDiklat.kodeUnikAbsensi !== kodeInput) {
        return {
            success: false,
            message: "Kode absensi tidak cocok",
        }
    }

    const absensiExisting = await prisma.absensiPesertaDiklat.findUnique({
        where: {
            pesertaDiklatId_materiDiklatId: {
                pesertaDiklatId: pesertaDiklat.id,
                materiDiklatId,
            }
        },
        select: {
            id: true,
        }
    })

    if (absensiExisting) {
        return {
            success: false,
            message: "Anda sudah melakukan absensi untuk materi ini",
        }
    }

    const statusHadir = await prisma.statusAbsensiPesertaDiklat.findFirst({
        where: {
            nama: {
                equals: "Hadir",
                mode: "insensitive"
            }
        },
        select: {
            id: true,
        }
    })

    if (!statusHadir) {
        return {
            success: false,
            message: "Status absensi Hadir belum tersedia",
        }
    }

    try {
        await prisma.absensiPesertaDiklat.create({
            data: {
                pesertaDiklatId: pesertaDiklat.id,
                materiDiklatId,
                statusAbsensiId: statusHadir.id,
            }
        })

        revalidatePath(`/peserta/diklat/aktif/${materiDiklat.diklatId}/materi-diklat`)
        revalidatePath(`/peserta/diklat/riwayat/${materiDiklat.diklatId}/materi-diklat`)

        return {
            success: true,
            message: "Absensi berhasil dikirim",
        }
    } catch (error) {
        if (
            error instanceof Prisma.PrismaClientKnownRequestError
            && error.code === "P2002"
        ) {
            return {
                success: false,
                message: "Anda sudah melakukan absensi untuk materi ini",
            }
        }

        logger.error("Gagal submit absensi peserta dengan kode unik", "absensi-peserta-diklat-action", error)

        return {
            success: false,
            message: "Terjadi kesalahan saat mengirim absensi",
        }
    }
}