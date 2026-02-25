"use server"

import logger from "@/lib/logger";
import prisma from "@/lib/prisma";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { z } from "zod";

const GetSertifikasiSchema = z.object({
    kodeSertifikasi: z.string().min(1, "Kode sertifikasi wajib diisi")
})

const DownloadSertifikatSchema = z.object({
    kodeSertifikasi: z.string().min(1, "Kode sertifikasi wajib diisi")
})

export async function getSertifikasiAction(_prev: any, formData: FormData) {
    const result = GetSertifikasiSchema.safeParse(Object.fromEntries(formData));

    if (!result.success) {
        return {
            success: false,
            message: "Kode Sertifikasi wajib diisi",
        };
    }

    const kodeSertifikasi = result.data.kodeSertifikasi.trim().toUpperCase();

    try {
        const data = await prisma.kelulusanPesertaDiklat.findFirst({
            where: {
                kodeSertifikasi: kodeSertifikasi
            },
            include: {
                pesertaDiklat: {
                    include: {
                        peserta: {
                            include: {
                                user: {
                                    select: {
                                        name: true,
                                        email: true
                                    }
                                }
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
        });

        if (!data) {
            return {
                success: false,
                message: "Sertifikat tidak ditemukan dengan kode ini"
            };
        }

        return {
            success: true,
            data: data
        };
    } catch (error) {
        logger.error("Gagal fetch sertifikasi", "sertifikasi-action", error)
        return {
            success: false,
            message: "Terjadi kesalahan pada server"
        };
    }
}

export async function downloadSertifikatAction(kodeSertifikasiInput: string) {
    const result = DownloadSertifikatSchema.safeParse({
        kodeSertifikasi: kodeSertifikasiInput,
    })

    if (!result.success) {
        return {
            success: false,
            message: "Kode Sertifikasi wajib diisi",
        }
    }

    const kodeSertifikasi = result.data.kodeSertifikasi.trim().toUpperCase()

    try {
        const dataKelulusan = await prisma.kelulusanPesertaDiklat.findUnique({
            where: {
                kodeSertifikasi,
            },
            include: {
                pesertaDiklat: {
                    include: {
                        peserta: {
                            include: {
                                user: {
                                    select: {
                                        name: true,
                                    },
                                },
                            },
                        },
                        diklat: {
                            select: {
                                judul: true,
                            },
                        },
                    },
                },
            },
        })

        if (!dataKelulusan) {
            return {
                success: false,
                message: "Sertifikat tidak ditemukan",
            }
        }

        const namaPeserta = dataKelulusan.pesertaDiklat.peserta.user.name
        const judulDiklat = dataKelulusan.pesertaDiklat.diklat.judul

        const pdfDoc = await PDFDocument.create()
        const page = pdfDoc.addPage([842, 595])

        const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica)
        const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold)

        const { width, height } = page.getSize()

        page.drawRectangle({
            x: 24,
            y: 24,
            width: width - 48,
            height: height - 48,
            borderColor: rgb(0.12, 0.26, 0.56),
            borderWidth: 2,
        })

        page.drawText("SERTIFIKAT DIKLAT", {
            x: 270,
            y: height - 100,
            size: 28,
            font: fontBold,
            color: rgb(0.12, 0.26, 0.56),
        })

        page.drawText("Diberikan kepada:", {
            x: 350,
            y: height - 170,
            size: 14,
            font: fontRegular,
            color: rgb(0.2, 0.2, 0.2),
        })

        page.drawText(namaPeserta, {
            x: width / 2 - fontBold.widthOfTextAtSize(namaPeserta, 24) / 2,
            y: height - 205,
            size: 24,
            font: fontBold,
            color: rgb(0.05, 0.05, 0.05),
        })

        page.drawText("Atas partisipasi dan kelulusan pada diklat:", {
            x: 260,
            y: height - 250,
            size: 13,
            font: fontRegular,
            color: rgb(0.2, 0.2, 0.2),
        })

        page.drawText(judulDiklat, {
            x: 200,
            y: height - 285,
            size: 18,
            font: fontBold,
            color: rgb(0.05, 0.05, 0.05),
        })

        page.drawText(`Kode Sertifikasi: ${dataKelulusan.kodeSertifikasi}`, {
            x: 70,
            y: 95,
            size: 12,
            font: fontRegular,
            color: rgb(0.2, 0.2, 0.2),
        })

        page.drawText(`Tanggal Terbit: ${new Date().toLocaleDateString("id-ID")}`, {
            x: 70,
            y: 70,
            size: 12,
            font: fontRegular,
            color: rgb(0.2, 0.2, 0.2),
        })

        const pdfBytes = await pdfDoc.save()

        return {
            success: true,
            data: {
                fileName: `sertifikat-${kodeSertifikasi}.pdf`,
                base64Pdf: Buffer.from(pdfBytes).toString("base64"),
            },
        }
    } catch (error) {
        console.error("Error downloading sertifikat:", error)
        return {
            success: false,
            message: "Terjadi kesalahan pada server",
        }
    }
}
