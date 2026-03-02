"use client"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { useTransition } from "react";
import { BiBookOpen, BiCheckDouble, BiSolidGraduation } from "react-icons/bi";

const sanitizePesanHtml = (input: string) => {
    if (typeof window === "undefined") {
        return ""
    }

    const parser = new DOMParser()
    const doc = parser.parseFromString(input, "text/html")
    const allowedTags = new Set(["A", "P", "BR", "STRONG", "B", "EM", "I", "U", "UL", "OL", "LI", "DIV"])

    const elements = Array.from(doc.body.querySelectorAll("*"))

    for (const element of elements) {
        if (!allowedTags.has(element.tagName)) {
            const parent = element.parentNode

            while (element.firstChild) {
                parent?.insertBefore(element.firstChild, element)
            }

            parent?.removeChild(element)
            continue
        }

        for (const attr of Array.from(element.attributes)) {
            if (element.tagName !== "A") {
                element.removeAttribute(attr.name)
                continue
            }

            if (!["href", "target", "rel"].includes(attr.name)) {
                element.removeAttribute(attr.name)
            }
        }

        if (element.tagName === "A") {
            const href = element.getAttribute("href")?.trim() ?? ""
            const isSafeHref = /^https?:\/\//i.test(href) || /^mailto:/i.test(href)

            if (!isSafeHref) {
                element.removeAttribute("href")
            } else {
                element.setAttribute("target", "_blank")
                element.setAttribute("rel", "noopener noreferrer")
            }
        }
    }

    return doc.body.innerHTML
}

export default function PesertaDiklatHasilAkhir({
    diklatId,
    routeSegment = "aktif",
    dataRekap,
    dataHasilAkhir
}: {
    diklatId: string
    routeSegment?: "aktif" | "riwayat"
    dataRekap: {
        totalKehadiran: string
        totalMateriSelesai: string
        statusKelulusan: string
    },
    dataHasilAkhir: {
        apakahDiklatSudahSelesai: boolean
        apakahLulus: boolean
        kodeSertifikasi: string | null
        pesanKelulusanPeserta: string | null
        statusKelulusan: string
    }
}) {
    const [isPending, startTransition] = useTransition()
    const pesanKelulusanHtml = dataHasilAkhir.pesanKelulusanPeserta
        ? sanitizePesanHtml(dataHasilAkhir.pesanKelulusanPeserta)
        : ""

    return (
        <>
            <div className='flex gap-3 flex-wrap'>
                <Link href={`/peserta/diklat/${routeSegment}/${diklatId}/materi-diklat`}>
                    <Button size='sm' variant='outline'>Materi Diklat</Button>
                </Link>
                <Button size='sm'>Hasil Akhir</Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Rekap Hasil Akhir Diklat</CardTitle>
                    <CardDescription>Ringkasan hasil akhir keikutsertaan Anda dalam diklat ini.</CardDescription>
                </CardHeader>
                <CardContent>

                    <div className="grid grid-cols-3 gap-4 max-lg:grid-cols-2 max-sm:grid-cols-1">
                        <Card>
                            <CardHeader>
                                <CardAction>
                                    <BiCheckDouble />
                                </CardAction>
                                <CardDescription>Kehadiran</CardDescription>
                                <CardTitle>{dataRekap.totalKehadiran}</CardTitle>
                            </CardHeader>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardAction>
                                    <BiBookOpen />
                                </CardAction>
                                <CardDescription>Materi Selesai</CardDescription>
                                <CardTitle>{dataRekap.totalMateriSelesai}</CardTitle>
                            </CardHeader>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardAction>
                                    <BiSolidGraduation />
                                </CardAction>
                                <CardDescription>Status Kelulusan</CardDescription>
                                <CardTitle>{dataRekap.statusKelulusan}</CardTitle>
                            </CardHeader>
                        </Card>
                    </div>
                </CardContent>

                <CardFooter>
                    {
                        dataHasilAkhir.apakahDiklatSudahSelesai && pesanKelulusanHtml &&
                        <Alert>
                            <AlertTitle>Pesan Admin</AlertTitle>
                            <AlertDescription className="[&_a]:text-primary [&_a]:underline">
                                <div dangerouslySetInnerHTML={{ __html: pesanKelulusanHtml }} />
                            </AlertDescription>
                        </Alert>
                    }
                    {
                        // jika diklat belum selesai
                        !dataHasilAkhir.apakahDiklatSudahSelesai &&
                        <Alert>
                            <AlertTitle>Hasil Akhir Belum Tersedia</AlertTitle>
                            <AlertDescription>Hasil akhir akan tersedia setelah Anda menyelesaikan seluruh materi diklat.</AlertDescription>
                        </Alert>
                    }
                    {
                        // jika diklat sudah selesai tetapi peserta belum dapat status
                        (dataHasilAkhir.apakahDiklatSudahSelesai && dataHasilAkhir.statusKelulusan === "Belum Dinilai") &&
                        <Alert>
                            <AlertTitle>Status Kelulusan Belum Tersedia</AlertTitle>
                            <AlertDescription>Hasil akhir Anda sedang diproses. Silakan cek kembali secara berkala.</AlertDescription>
                        </Alert>
                    }
                    {
                        // jika diklat sudah selesai dan peserta lullus
                        // (dataHasilAkhir.apakahDiklatSudahSelesai && dataHasilAkhir.apakahLulus && dataHasilAkhir.kodeSertifikasi) &&
                        
                    }
                    {
                        // jika diklat sudah selesai, lulus, tetapi sertifikasi belum tersedia
                        (dataHasilAkhir.apakahDiklatSudahSelesai && dataHasilAkhir.apakahLulus && !dataHasilAkhir.kodeSertifikasi) &&
                        <Alert>
                            <AlertTitle>Sertifikasi Belum Tersedia</AlertTitle>
                            <AlertDescription>Sertifikasi Anda sedang diproses. Silakan cek kembali secara berkala.</AlertDescription>
                        </Alert>
                    }
                    {
                        // jika diklat sudah selesai dan peserta tidak lullus
                        (dataHasilAkhir.apakahDiklatSudahSelesai && dataHasilAkhir.statusKelulusan === "Tidak Lulus") &&
                        <Alert variant='danger'>
                            <AlertTitle>Hasil Akhir:</AlertTitle>
                            <AlertDescription>Mohon maaf, Anda tidak lulus pada diklat ini. Jika ada pengaduan, silakan hubungi admin.</AlertDescription>
                        </Alert>
                    }
                </CardFooter>
            </Card>
        </>
    )
}
