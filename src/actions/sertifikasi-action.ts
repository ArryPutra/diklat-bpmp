"use server"

import { getCurrentPeserta } from "@/actions/peserta-action"
import logger from "@/lib/logger"
import prisma from "@/lib/prisma"
import { formatDateId } from "@/utils/dateFormatted"
import { PDFDocument, PDFFont, StandardFonts, rgb } from "pdf-lib"

export type GetSertifikasiActionState = {
    success: boolean
    message?: string
    data?: any
}

type SertifikatPayload = {
    pesertaNama: string
    judulDiklat: string
    kodeDiklat: string
    lokasi: string
    metodeDiklat: string
    tanggalMulai: string
    tanggalSelesai: string
    tanggalTerbit: string
    kodeSertifikasi: string
    absensiMateri: {
        judulMateri: string
        tanggalPelaksanaan: string
        waktuPelaksanaan: string
        statusKehadiran: string
    }[]
}

const splitTextByWidth = (text: string, maxWidth: number, font: PDFFont, fontSize: number) => {
    const kata = text.trim().split(/\s+/).filter(Boolean)

    if (!kata.length) {
        return ["-"]
    }

    const lines: string[] = []
    let currentLine = ""

    for (const item of kata) {
        const kandidat = currentLine ? `${currentLine} ${item}` : item
        const kandidatWidth = font.widthOfTextAtSize(kandidat, fontSize)

        if (kandidatWidth <= maxWidth) {
            currentLine = kandidat
            continue
        }

        if (currentLine) {
            lines.push(currentLine)
            currentLine = item
        } else {
            lines.push(item)
        }
    }

    if (currentLine) {
        lines.push(currentLine)
    }

    return lines
}

const buatSertifikatPdf = async (payload: SertifikatPayload) => {
    const pdfDoc = await PDFDocument.create()
    const page = pdfDoc.addPage([842, 595])
    const pageWidth = page.getWidth()
    const pageHeight = page.getHeight()

    const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica)
    const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold)

    const warnaNavy = rgb(0.09, 0.2, 0.39)
    const warnaEmas = rgb(0.86, 0.69, 0.24)
    const warnaKertas = rgb(0.995, 0.994, 0.985)
    const warnaAksenLembut = rgb(0.93, 0.96, 1)
    const warnaTeksSekunder = rgb(0.3, 0.32, 0.35)

    page.drawRectangle({
        x: 0,
        y: 0,
        width: pageWidth,
        height: pageHeight,
        color: warnaKertas
    })

    page.drawRectangle({
        x: 0,
        y: 540,
        width: pageWidth,
        height: 55,
        color: warnaNavy
    })

    page.drawRectangle({
        x: 0,
        y: 0,
        width: pageWidth,
        height: 42,
        color: warnaNavy
    })

    page.drawRectangle({
        x: 16,
        y: 16,
        width: pageWidth - 32,
        height: pageHeight - 32,
        borderColor: warnaEmas,
        borderWidth: 2
    })

    page.drawRectangle({
        x: 28,
        y: 28,
        width: pageWidth - 56,
        height: pageHeight - 56,
        borderColor: warnaNavy,
        borderWidth: 0.9
    })

    page.drawCircle({ x: 58, y: 567, size: 6, color: warnaEmas })
    page.drawCircle({ x: 84, y: 567, size: 4.5, color: rgb(0.98, 0.82, 0.4) })
    page.drawCircle({ x: pageWidth - 58, y: 567, size: 6, color: warnaEmas })
    page.drawCircle({ x: pageWidth - 84, y: 567, size: 4.5, color: rgb(0.98, 0.82, 0.4) })

    page.drawCircle({ x: 58, y: 26, size: 6, color: warnaEmas })
    page.drawCircle({ x: 84, y: 26, size: 4.5, color: rgb(0.98, 0.82, 0.4) })
    page.drawCircle({ x: pageWidth - 58, y: 26, size: 6, color: warnaEmas })
    page.drawCircle({ x: pageWidth - 84, y: 26, size: 4.5, color: rgb(0.98, 0.82, 0.4) })

    const drawCenterText = (text: string, y: number, size: number, isBold = false, color = rgb(0.1, 0.1, 0.1)) => {
        const font = isBold ? fontBold : fontRegular
        const textWidth = font.widthOfTextAtSize(text, size)
        page.drawText(text, {
            x: (pageWidth - textWidth) / 2,
            y,
            size,
            font,
            color
        })
    }

    drawCenterText("BALAI PENJAMINAN MUTU PENDIDIKAN", 558, 11, true, rgb(0.99, 0.99, 0.99))
    drawCenterText("PROVINSI KALIMANTAN SELATAN", 544, 10, false, rgb(0.94, 0.95, 0.98))

    drawCenterText("SERTIFIKAT KELULUSAN DIKLAT", 498, 33, true, warnaNavy)
    drawCenterText("Diberikan sebagai apresiasi atas pencapaian kompetensi peserta", 472, 12, false, warnaTeksSekunder)

    page.drawRectangle({
        x: 130,
        y: 380,
        width: pageWidth - 260,
        height: 66,
        color: warnaAksenLembut,
        borderColor: rgb(0.74, 0.82, 0.96),
        borderWidth: 1
    })

    drawCenterText("Diberikan kepada", 424, 13, false, rgb(0.3, 0.35, 0.44))

    const namaPesertaLines = splitTextByWidth(payload.pesertaNama, 560, fontBold, 30)
    let namaCursorY = 400
    for (const line of namaPesertaLines) {
        drawCenterText(line, namaCursorY, 30, true, warnaNavy)
        namaCursorY -= 32
    }

    drawCenterText("atas keberhasilan menyelesaikan kegiatan diklat:", namaCursorY - 4, 13, false, warnaTeksSekunder)

    const judulLines = splitTextByWidth(payload.judulDiklat, 700, fontBold, 21)
    let judulCursorY = namaCursorY - 36
    for (const line of judulLines) {
        drawCenterText(line, judulCursorY, 21, true, rgb(0.12, 0.13, 0.16))
        judulCursorY -= 24
    }

    page.drawRectangle({
        x: 84,
        y: 122,
        width: pageWidth - 168,
        height: 148,
        color: rgb(1, 1, 1),
        borderColor: rgb(0.84, 0.88, 0.95),
        borderWidth: 1
    })

    const infoRows = [
        `Kode Diklat        : ${payload.kodeDiklat}`,
        `Metode Diklat      : ${payload.metodeDiklat}`,
        `Lokasi             : ${payload.lokasi}`,
        `Tanggal Pelaksanaan: ${payload.tanggalMulai} s/d ${payload.tanggalSelesai}`,
        `Kode Sertifikasi   : ${payload.kodeSertifikasi}`,
        `Tanggal Terbit     : ${payload.tanggalTerbit}`
    ]

    let infoY = 248
    for (const row of infoRows) {
        const wrapped = splitTextByWidth(row, 640, fontRegular, 11)

        for (const line of wrapped) {
            page.drawText(line, {
                x: 106,
                y: infoY,
                size: 11,
                font: fontRegular,
                color: rgb(0.22, 0.24, 0.28)
            })

            infoY -= 15
        }

        infoY -= 3
    }

    page.drawCircle({
        x: 705,
        y: 168,
        size: 38,
        color: rgb(0.95, 0.89, 0.65),
        borderColor: warnaEmas,
        borderWidth: 1
    })

    page.drawCircle({
        x: 705,
        y: 168,
        size: 28,
        color: rgb(0.99, 0.96, 0.82),
        borderColor: rgb(0.86, 0.69, 0.24),
        borderWidth: 0.8
    })

    drawCenterText("LULUS", 163, 10, true, warnaNavy)

    page.drawLine({
        start: { x: 540, y: 98 },
        end: { x: 780, y: 98 },
        thickness: 1,
        color: rgb(0.62, 0.68, 0.78)
    })

    page.drawText("BPMP Kalimantan Selatan", {
        x: 575,
        y: 80,
        size: 13,
        font: fontBold,
        color: warnaNavy
    })

    page.drawText("Penanggung Jawab", {
        x: 635,
        y: 62,
        size: 9,
        font: fontRegular,
        color: warnaTeksSekunder
    })

    page.drawText("Dokumen ini diterbitkan secara digital dan sah digunakan untuk keperluan verifikasi.", {
        x: 84,
        y: 18,
        size: 9,
        font: fontRegular,
        color: rgb(0.86, 0.89, 0.94)
    })

    const pageAbsensi = pdfDoc.addPage([842, 595])
    const pageAbsensiWidth = pageAbsensi.getWidth()

    pageAbsensi.drawRectangle({
        x: 0,
        y: 0,
        width: pageAbsensi.getWidth(),
        height: pageAbsensi.getHeight(),
        color: warnaKertas
    })

    pageAbsensi.drawRectangle({
        x: 0,
        y: 546,
        width: pageAbsensi.getWidth(),
        height: 49,
        color: warnaNavy
    })

    pageAbsensi.drawRectangle({
        x: 18,
        y: 18,
        width: pageAbsensi.getWidth() - 36,
        height: pageAbsensi.getHeight() - 36,
        borderColor: warnaEmas,
        borderWidth: 1.6
    })

    pageAbsensi.drawRectangle({
        x: 30,
        y: 30,
        width: pageAbsensi.getWidth() - 60,
        height: pageAbsensi.getHeight() - 60,
        borderColor: warnaNavy,
        borderWidth: 0.8
    })

    pageAbsensi.drawText("Lampiran Sertifikat: Daftar Kehadiran Materi Diklat", {
        x: 48,
        y: 555,
        size: 16,
        font: fontBold,
        color: rgb(0.98, 0.98, 0.98)
    })

    pageAbsensi.drawText(`Nama Peserta: ${payload.pesertaNama}`, {
        x: 48,
        y: 520,
        size: 11,
        font: fontRegular,
        color: rgb(0.18, 0.18, 0.18)
    })

    pageAbsensi.drawText(`Judul Diklat: ${payload.judulDiklat}`, {
        x: 48,
        y: 503,
        size: 11,
        font: fontRegular,
        color: rgb(0.18, 0.18, 0.18)
    })

    pageAbsensi.drawText(`Kode Diklat: ${payload.kodeDiklat}`, {
        x: 48,
        y: 486,
        size: 11,
        font: fontRegular,
        color: rgb(0.18, 0.18, 0.18)
    })

    const tableX = 48
    const tableTopY = 456
    const tableWidth = pageAbsensiWidth - (tableX * 2)
    const rowHeight = 22
    const colNo = 42
    const colTanggal = 118
    const colWaktu = 120
    const colStatus = 120
    const colMateri = tableWidth - (colNo + colTanggal + colWaktu + colStatus)

    pageAbsensi.drawRectangle({
        x: tableX,
        y: tableTopY,
        width: tableWidth,
        height: rowHeight,
        color: rgb(0.13, 0.27, 0.47),
        borderColor: rgb(0.13, 0.27, 0.47),
        borderWidth: 1
    })

    const batasKolom = [
        tableX,
        tableX + colNo,
        tableX + colNo + colMateri,
        tableX + colNo + colMateri + colTanggal,
        tableX + colNo + colMateri + colTanggal + colWaktu,
        tableX + tableWidth
    ]

    for (let i = 1; i < batasKolom.length - 1; i += 1) {
        pageAbsensi.drawLine({
            start: { x: batasKolom[i], y: tableTopY },
            end: { x: batasKolom[i], y: tableTopY + rowHeight },
            thickness: 1,
            color: rgb(0.24, 0.4, 0.63)
        })
    }

    pageAbsensi.drawText("No", { x: tableX + 12, y: tableTopY + 7, size: 10, font: fontBold, color: rgb(0.98, 0.99, 1) })
    pageAbsensi.drawText("Materi", { x: tableX + colNo + 8, y: tableTopY + 7, size: 10, font: fontBold, color: rgb(0.98, 0.99, 1) })
    pageAbsensi.drawText("Tanggal", { x: tableX + colNo + colMateri + 8, y: tableTopY + 7, size: 10, font: fontBold, color: rgb(0.98, 0.99, 1) })
    pageAbsensi.drawText("Waktu", { x: tableX + colNo + colMateri + colTanggal + 8, y: tableTopY + 7, size: 10, font: fontBold, color: rgb(0.98, 0.99, 1) })
    pageAbsensi.drawText("Status", { x: tableX + colNo + colMateri + colTanggal + colWaktu + 8, y: tableTopY + 7, size: 10, font: fontBold, color: rgb(0.98, 0.99, 1) })

    const maxRowsDiHalaman = 15
    const rows = payload.absensiMateri.slice(0, maxRowsDiHalaman)
    let currentY = tableTopY - rowHeight

    if (!rows.length) {
        pageAbsensi.drawRectangle({
            x: tableX,
            y: currentY,
            width: tableWidth,
            height: rowHeight,
            borderColor: rgb(0.84, 0.84, 0.84),
            borderWidth: 1
        })

        pageAbsensi.drawText("Data absensi materi belum tersedia.", {
            x: tableX + 10,
            y: currentY + 7,
            size: 10,
            font: fontRegular,
            color: rgb(0.4, 0.4, 0.4)
        })

        currentY -= rowHeight
    } else {
        rows.forEach((item, index) => {
            pageAbsensi.drawRectangle({
                x: tableX,
                y: currentY,
                width: tableWidth,
                height: rowHeight,
                color: index % 2 === 0 ? rgb(1, 1, 1) : rgb(0.98, 0.98, 0.99),
                borderColor: rgb(0.87, 0.87, 0.9),
                borderWidth: 1
            })

            for (let i = 1; i < batasKolom.length - 1; i += 1) {
                pageAbsensi.drawLine({
                    start: { x: batasKolom[i], y: currentY },
                    end: { x: batasKolom[i], y: currentY + rowHeight },
                    thickness: 1,
                    color: rgb(0.87, 0.87, 0.9)
                })
            }

            const materiLabel = splitTextByWidth(item.judulMateri, colMateri - 12, fontRegular, 9)[0]

            pageAbsensi.drawText(`${index + 1}`, {
                x: tableX + 14,
                y: currentY + 7,
                size: 9,
                font: fontRegular,
                color: rgb(0.18, 0.18, 0.18)
            })

            pageAbsensi.drawText(materiLabel, {
                x: tableX + colNo + 6,
                y: currentY + 7,
                size: 9,
                font: fontRegular,
                color: rgb(0.18, 0.18, 0.18)
            })

            pageAbsensi.drawText(item.tanggalPelaksanaan, {
                x: tableX + colNo + colMateri + 6,
                y: currentY + 7,
                size: 9,
                font: fontRegular,
                color: rgb(0.18, 0.18, 0.18)
            })

            pageAbsensi.drawText(item.waktuPelaksanaan, {
                x: tableX + colNo + colMateri + colTanggal + 6,
                y: currentY + 7,
                size: 9,
                font: fontRegular,
                color: rgb(0.18, 0.18, 0.18)
            })

            pageAbsensi.drawText(item.statusKehadiran, {
                x: tableX + colNo + colMateri + colTanggal + colWaktu + 6,
                y: currentY + 7,
                size: 9,
                font: fontRegular,
                color: rgb(0.18, 0.18, 0.18)
            })

            currentY -= rowHeight
        })
    }

    if (payload.absensiMateri.length > maxRowsDiHalaman) {
        pageAbsensi.drawText(`Catatan: ${payload.absensiMateri.length - maxRowsDiHalaman} materi lainnya tidak ditampilkan pada halaman ini.`, {
            x: tableX,
            y: 90,
            size: 9,
            font: fontRegular,
            color: rgb(0.45, 0.2, 0.2)
        })
    }

    const totalHadir = payload.absensiMateri.filter((item) => item.statusKehadiran === "Hadir").length
    const totalMateri = payload.absensiMateri.length
    const persentase = totalMateri > 0 ? Math.round((totalHadir / totalMateri) * 100) : 0

    pageAbsensi.drawText(`Ringkasan Kehadiran: ${totalHadir}/${totalMateri} (${persentase}%)`, {
        x: tableX,
        y: 66,
        size: 10,
        font: fontBold,
        color: rgb(0.1, 0.1, 0.1)
    })

    const pdfBytes = await pdfDoc.save()
    const base64Pdf = Buffer.from(pdfBytes).toString("base64")

    return {
        base64Pdf,
        fileName: `sertifikat-${payload.kodeSertifikasi}.pdf`
    }
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
                        diklat: {
                            include: {
                                metodeDiklat: true
                            }
                        },
                        absensiPesertaDiklat: {
                            include: {
                                materiDiklat: true,
                                statusAbsensiPesertaDiklat: true
                            },
                            orderBy: {
                                materiDiklat: {
                                    tanggalPelaksanaan: "asc"
                                }
                            }
                        }
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
        const kodeDiklat = data.pesertaDiklat.diklat.id
        const lokasi = data.pesertaDiklat.diklat.lokasi
        const metodeDiklat = data.pesertaDiklat.diklat.metodeDiklat?.nama ?? "-"
        const tanggalMulai = formatDateId(data.pesertaDiklat.diklat.tanggalMulaiAcara.toISOString())
        const tanggalSelesai = formatDateId(data.pesertaDiklat.diklat.tanggalSelesaiAcara.toISOString())
        const tanggalTerbit = formatDateId(data.createdAt.toISOString())
        const absensiMateri = data.pesertaDiklat.absensiPesertaDiklat.map((item) => ({
            judulMateri: item.materiDiklat.judul,
            tanggalPelaksanaan: formatDateId(item.materiDiklat.tanggalPelaksanaan.toISOString()),
            waktuPelaksanaan: `${item.materiDiklat.waktuMulai} - ${item.materiDiklat.waktuSelesai}`,
            statusKehadiran: item.statusAbsensiPesertaDiklat.nama
        }))

        const hasilSertifikat = await buatSertifikatPdf({
            pesertaNama,
            judulDiklat,
            kodeDiklat,
            lokasi,
            metodeDiklat,
            tanggalMulai,
            tanggalSelesai,
            tanggalTerbit,
            kodeSertifikasi: data.kodeSertifikasi ?? kode,
            absensiMateri
        })

        return {
            success: true,
            data: hasilSertifikat
        }
    } catch (error) {
        logger.error("Gagal mengunduh sertifikat", "sertifikasi-action", error)

        return {
            success: false,
            message: "Terjadi kesalahan saat menyiapkan sertifikat"
        }
    }
}

export async function downloadSertifikatPesertaAction(diklatId: string) {
    if (!diklatId?.trim()) {
        return {
            success: false,
            message: "Diklat tidak valid"
        }
    }

    try {
        const currentPeserta = await getCurrentPeserta()

        if (!currentPeserta?.id) {
            return {
                success: false,
                message: "Sesi peserta tidak ditemukan"
            }
        }

        const pesertaDiklat = await prisma.pesertaDiklat.findUnique({
            where: {
                diklatId_pesertaId: {
                    diklatId,
                    pesertaId: currentPeserta.id
                }
            },
            include: {
                peserta: {
                    include: {
                        user: true
                    }
                },
                statusKelulusanPesertaDiklat: true,
                kelulusanPesertaDiklat: {
                    select: {
                        kodeSertifikasi: true,
                        createdAt: true
                    },
                    take: 1,
                    orderBy: {
                        createdAt: "desc"
                    }
                },
                diklat: {
                    include: {
                        metodeDiklat: true
                    }
                },
                absensiPesertaDiklat: {
                    include: {
                        materiDiklat: true,
                        statusAbsensiPesertaDiklat: true
                    },
                    orderBy: {
                        materiDiklat: {
                            tanggalPelaksanaan: "asc"
                        }
                    }
                }
            }
        })

        if (!pesertaDiklat) {
            return {
                success: false,
                message: "Data peserta diklat tidak ditemukan"
            }
        }

        if (pesertaDiklat.statusKelulusanPesertaDiklat?.nama !== "Lulus") {
            return {
                success: false,
                message: "Sertifikat hanya tersedia untuk peserta yang lulus"
            }
        }

        const kelulusan = pesertaDiklat.kelulusanPesertaDiklat[0]

        if (!kelulusan?.kodeSertifikasi) {
            return {
                success: false,
                message: "Sertifikasi Anda belum tersedia"
            }
        }

        const hasilSertifikat = await buatSertifikatPdf({
            pesertaNama: pesertaDiklat.peserta.user.name,
            judulDiklat: pesertaDiklat.diklat.judul,
            kodeDiklat: pesertaDiklat.diklat.id,
            lokasi: pesertaDiklat.diklat.lokasi,
            metodeDiklat: pesertaDiklat.diklat.metodeDiklat?.nama ?? "-",
            tanggalMulai: formatDateId(pesertaDiklat.diklat.tanggalMulaiAcara.toISOString()),
            tanggalSelesai: formatDateId(pesertaDiklat.diklat.tanggalSelesaiAcara.toISOString()),
            tanggalTerbit: formatDateId(kelulusan.createdAt.toISOString()),
            kodeSertifikasi: kelulusan.kodeSertifikasi,
            absensiMateri: pesertaDiklat.absensiPesertaDiklat.map((item) => ({
                judulMateri: item.materiDiklat.judul,
                tanggalPelaksanaan: formatDateId(item.materiDiklat.tanggalPelaksanaan.toISOString()),
                waktuPelaksanaan: `${item.materiDiklat.waktuMulai} - ${item.materiDiklat.waktuSelesai} WITA`,
                statusKehadiran: item.statusAbsensiPesertaDiklat.nama
            }))
        })

        return {
            success: true,
            data: hasilSertifikat
        }
    } catch (error) {
        logger.error("Gagal mengunduh sertifikat peserta", "sertifikasi-action", error)

        return {
            success: false,
            message: "Terjadi kesalahan saat menyiapkan sertifikat"
        }
    }
}
