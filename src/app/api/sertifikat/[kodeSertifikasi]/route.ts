import prisma from "@/lib/prisma"
import { PDFDocument, StandardFonts, rgb } from "pdf-lib"

export async function GET(
    _request: Request,
    { params }: { params: Promise<{ kodeSertifikasi: string }> }
) {
    const { kodeSertifikasi } = await params

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
        return new Response("Sertifikat tidak ditemukan", { status: 404 })
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
        x: 280,
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

    return new Response(Buffer.from(pdfBytes), {
        status: 200,
        headers: {
            "Content-Type": "application/pdf",
            "Content-Disposition": `attachment; filename="sertifikat-${kodeSertifikasi}.pdf"`,
        },
    })
}
