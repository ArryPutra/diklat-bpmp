"use server"

import logger from "@/lib/logger"
import prisma from "@/lib/prisma"
import { formatDateId } from "@/utils/dateFormatted"
import { PDFDocument, StandardFonts, rgb } from "pdf-lib"

export type GetSertifikasiActionState = {
    success: boolean
    message?: string
    data?: any
}

export async function getSertifikasiAction(
    _prevState: GetSertifikasiActionState | null,
    formData: FormData
): Promise<GetSertifikasiActionState> {
    const kodeSertifikasi = (formData.get("kodeSertifikasi") as string | null)?.trim().toUpperCase() || ""

    if (!kodeSertifikasi) {
        return {
            success: false,
            message: "Kode sertifikasi wajib diisi"
        }
    }

    try {
        const data = await prisma.kelulusanPesertaDiklat.findFirst({
            where: {
                kodeSertifikasi: {
                    equals: kodeSertifikasi,
                    mode: "insensitive"
                }
            },
            include: {
                pesertaDiklat: {
                    include: {
                        peserta: {
                            include: {
                                user: true
                            }
                        },
                        diklat: {
                            include: {
                                metodeDiklat: true
                            }
                        },
                        statusKelulusanPesertaDiklat: true
                    }
                }
            }
        })

        if (!data) {
            return {
                success: false,
                message: "Kode sertifikasi tidak ditemukan"
            }
        }

        return {
            success: true,
            data
        }
    } catch (error) {
        logger.error("Gagal cek sertifikasi", "sertifikasi-action", error)

        return {
            success: false,
            message: "Terjadi kesalahan saat memeriksa sertifikasi"
        }
    }
}

export async function downloadSertifikatAction(kodeSertifikasi: string) {
    const kode = kodeSertifikasi.trim().toUpperCase()

    if (!kode) {
        return {
            success: false,
            message: "Kode sertifikasi tidak valid"
        }
    }

    try {
        const data = await prisma.kelulusanPesertaDiklat.findFirst({
            where: {
                kodeSertifikasi: {
                    equals: kode,
                    mode: "insensitive"
                }
            },
            include: {
                pesertaDiklat: {
                    include: {
                        peserta: {
                            include: {
                                user: true
                            }
                        },
                        diklat: true,
                    }
                }
            }
        })

        if (!data) {
            return {
                success: false,
                message: "Sertifikat tidak ditemukan"
            }
        }

        const pesertaNama = data.pesertaDiklat.peserta.user.name
        const judulDiklat = data.pesertaDiklat.diklat.judul
        const lokasi = data.pesertaDiklat.diklat.lokasi
        const tanggalMulai = formatDateId(data.pesertaDiklat.diklat.tanggalMulaiAcara.toISOString())
        const tanggalSelesai = formatDateId(data.pesertaDiklat.diklat.tanggalSelesaiAcara.toISOString())
        const tanggalTerbit = formatDateId(data.createdAt.toISOString())

        const pdfDoc = await PDFDocument.create()
        const page = pdfDoc.addPage([842, 595])
        const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica)
        const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold)

        page.drawRectangle({
            x: 20,
            y: 20,
            width: 802,
            height: 555,
            borderColor: rgb(0.85, 0.85, 0.85),
            borderWidth: 2,
        })

        page.drawText("SERTIFIKAT DIKLAT", {
            x: 260,
            y: 520,
            size: 30,
            font: fontBold,
            color: rgb(0.1, 0.1, 0.1)
        })

        page.drawText("Diberikan kepada", {
            x: 350,
            y: 470,
            size: 16,
            font: fontRegular,
            color: rgb(0.3, 0.3, 0.3)
        })

        page.drawText(pesertaNama, {
            x: 120,
            y: 430,
            size: 32,
            font: fontBold,
            color: rgb(0.08, 0.24, 0.54)
        })

        page.drawText("atas partisipasi dan kelulusan pada kegiatan:", {
            x: 250,
            y: 390,
            size: 14,
            font: fontRegular,
            color: rgb(0.25, 0.25, 0.25)
        })

        page.drawText(judulDiklat, {
            x: 90,
            y: 355,
            size: 20,
            font: fontBold,
            color: rgb(0.1, 0.1, 0.1)
        })

        page.drawText(`Lokasi: ${lokasi}`, {
            x: 90,
            y: 315,
            size: 13,
            font: fontRegular,
            color: rgb(0.25, 0.25, 0.25)
        })

        page.drawText(`Tanggal pelaksanaan: ${tanggalMulai} s/d ${tanggalSelesai}`, {
            x: 90,
            y: 292,
            size: 13,
            font: fontRegular,
            color: rgb(0.25, 0.25, 0.25)
        })

        page.drawText(`Kode sertifikasi: ${data.kodeSertifikasi}`, {
            x: 90,
            y: 250,
            size: 12,
            font: fontBold,
            color: rgb(0.1, 0.1, 0.1)
        })

        page.drawText(`Diterbitkan: ${tanggalTerbit}`, {
            x: 90,
            y: 230,
            size: 12,
            font: fontRegular,
            color: rgb(0.25, 0.25, 0.25)
        })

        page.drawText("BPMP Kalimantan Selatan", {
            x: 575,
            y: 120,
            size: 14,
            font: fontBold,
            color: rgb(0.1, 0.1, 0.1)
        })

        const pdfBytes = await pdfDoc.save()
        const base64Pdf = Buffer.from(pdfBytes).toString("base64")

        return {
            success: true,
            data: {
                base64Pdf,
                fileName: `sertifikat-${data.kodeSertifikasi}.pdf`
            }
        }
    } catch (error) {
        logger.error("Gagal mengunduh sertifikat", "sertifikasi-action", error)

        return {
            success: false,
            message: "Terjadi kesalahan saat menyiapkan sertifikat"
        }
    }
}
