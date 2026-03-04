"use client"

import { publishKelulusanPesertaDiklatAction } from "@/actions/peserta-diklat-action"
import { ContentCanvas } from "@/components/layouts/auth-layout"
import BackButton from "@/components/shared/back-button"
import ActionDialog from "@/components/shared/dialog/action-dialog"
import InfoDialog from "@/components/shared/dialog/info-dialog"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertDialogAction } from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { usePathname, useSearchParams } from "next/navigation"
import { useActionState, useEffect, useMemo, useRef, useState } from "react"
import { BiBold, BiCheck, BiDownload, BiItalic, BiLinkExternal, BiX } from "react-icons/bi"

const escapeHtml = (value: string) =>
    value
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;")

const normalizeInitialEditorValue = (value: string | null) => {
    if (!value) {
        return ""
    }

    const hasHtmlTag = /<\/?[a-z][\s\S]*>/i.test(value)

    if (hasHtmlTag) {
        return value
    }

    return escapeHtml(value).replace(/\n/g, "<br>")
}

const sanitizeEditorHtml = (input: string) => {
    if (typeof window === "undefined") {
        return input
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

const stripHtml = (value: string) =>
    value
        .replace(/<br\s*\/?>/gi, "\n")
        .replace(/<[^>]+>/g, "")
        .trim()

const sanitizeSheetName = (name: string, index: number) => {
    const sanitizedName = name
        .replace(/[\\/?*\[\]:]/g, "-")
        .trim()

    if (!sanitizedName) {
        return `Materi-${index + 1}`
    }

    if (sanitizedName.length <= 31) {
        return sanitizedName
    }

    return sanitizedName.slice(0, 31)
}

export default function AdminSelesaikanDiklatView({
    diklat,
    daftarPesertaEvaluasi
}: {
    diklat: {
        id: string
        judul: string
        minimalKehadiranPersen: number
        statusPelaksanaanAcara: string
        pesanKelulusanPeserta: string | null
    },
    daftarPesertaEvaluasi: {
        id: number
        namaPeserta: string
        namaInstansi: string
        totalKehadiran: number
        totalSesiMateri: number
        persenKehadiran: number
        statusRekomendasiKelulusan: "Lulus" | "Tidak Lulus"
        statusAkhirKelulusan: "Lulus" | "Tidak Lulus" | null
        totalStatusAbsensi: {
            hadir: number
            tidakHadir: number
            izin: number
            sakit: number
        }
        detailAbsensiPerMateri: {
            judulMateri: string
            statusAbsensi: string
        }[]
    }[]
}) {
    const pathName = usePathname()
    const searchParams = new URLSearchParams(useSearchParams().toString())

    const [statePublishKelulusanPesertaDiklatAction, formActionPublishKelulusanPesertaDiklatAction] =
        useActionState(publishKelulusanPesertaDiklatAction, null)

    const getBadgeVariantByStatusAbsensi = (statusAbsensi: string): "default" | "secondary" | "destructive" | "outline" => {
        if (statusAbsensi === "Hadir") {
            return "default"
        }

        if (statusAbsensi === "Tidak Hadir") {
            return "destructive"
        }

        if (statusAbsensi === "Izin") {
            return "secondary"
        }

        return "outline"
    }

    const totalPesertaLulus = daftarPesertaEvaluasi.filter((peserta) => peserta.statusRekomendasiKelulusan === "Lulus").length
    const totalPesertaTidakLulus = daftarPesertaEvaluasi.length - totalPesertaLulus
    const isKelulusanSudahDiterbitkan =
        daftarPesertaEvaluasi.length > 0 && daftarPesertaEvaluasi.every((peserta) => peserta.statusAkhirKelulusan !== null)

    const initialStatusKelulusanByPesertaId = useMemo(
        () => Object.fromEntries(
            daftarPesertaEvaluasi.map((peserta) => {
                const statusKelulusanAwal = peserta.statusAkhirKelulusan
                    ? peserta.statusAkhirKelulusan === "Lulus" ? 2 : 3
                    : peserta.statusRekomendasiKelulusan === "Lulus" ? 2 : 3

                return [peserta.id, statusKelulusanAwal]
            })
        ) as Record<number, 2 | 3>,
        [daftarPesertaEvaluasi]
    )

    const [statusKelulusanByPesertaId, setStatusKelulusanByPesertaId] =
        useState<Record<number, 2 | 3>>(initialStatusKelulusanByPesertaId)
    const [pesanKelulusanPeserta, setPesanKelulusanPeserta] = useState(normalizeInitialEditorValue(diklat.pesanKelulusanPeserta))
    const [isDownloadingAbsensiReport, setIsDownloadingAbsensiReport] = useState(false)
    const editorRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (!editorRef.current) {
            return
        }

        editorRef.current.innerHTML = pesanKelulusanPeserta
    }, [])

    const daftarKelulusanPeserta = Object.entries(statusKelulusanByPesertaId).map(([pesertaDiklatId, statusKelulusanPesertaDiklatId]) => ({
        pesertaDiklatId: Number(pesertaDiklatId),
        statusKelulusanPesertaDiklatId
    }))

    const totalLulusFinal = daftarKelulusanPeserta.filter((peserta) => peserta.statusKelulusanPesertaDiklatId === 2).length
    const totalTidakLulusFinal = daftarKelulusanPeserta.filter((peserta) => peserta.statusKelulusanPesertaDiklatId === 3).length
    const pesanKelulusanPreview = stripHtml(pesanKelulusanPeserta)
    const isPesanKelulusanKosong = stripHtml(pesanKelulusanPeserta).length === 0

    const applyEditorCommand = (command: "bold" | "italic") => {
        editorRef.current?.focus()
        document.execCommand(command)

        const html = sanitizeEditorHtml(editorRef.current?.innerHTML ?? "")
        setPesanKelulusanPeserta(html)
    }

    const insertLink = () => {
        const rawUrl = window.prompt("Masukkan URL link")?.trim()

        if (!rawUrl) {
            return
        }

        const url = /^https?:\/\//i.test(rawUrl) || /^mailto:/i.test(rawUrl)
            ? rawUrl
            : `https://${rawUrl}`

        editorRef.current?.focus()

        const selection = window.getSelection()
        const hasSelection = Boolean(selection && !selection.isCollapsed)

        if (hasSelection) {
            document.execCommand("createLink", false, url)
        } else {
            document.execCommand("insertHTML", false, `<a href="${url}">${url}</a>`)
        }

        const html = sanitizeEditorHtml(editorRef.current?.innerHTML ?? "")
        if (editorRef.current) {
            editorRef.current.innerHTML = html
        }
        setPesanKelulusanPeserta(html)
    }

    const unduhHasilAbsensiPeserta = async () => {
        if (isDownloadingAbsensiReport || daftarPesertaEvaluasi.length === 0) {
            return
        }

        setIsDownloadingAbsensiReport(true)

        try {
            const XLSX = await import("xlsx")
            const workbook = XLSX.utils.book_new()
            const daftarJudulMateri = daftarPesertaEvaluasi[0]?.detailAbsensiPerMateri.map((materi) => materi.judulMateri) ?? []

            const usedSheetNames = new Set<string>()

            daftarJudulMateri.forEach((judulMateri, indexMateri) => {
                const rows = daftarPesertaEvaluasi.map((peserta, indexPeserta) => {
                    const detailMateri = peserta.detailAbsensiPerMateri[indexMateri]

                    return {
                        No: indexPeserta + 1,
                        "Nama Peserta": peserta.namaPeserta,
                        "Asal Instansi": peserta.namaInstansi,
                        "Status Absensi": detailMateri?.statusAbsensi ?? "Belum Diisi",
                        "Kehadiran (Hadir/Sesi)": `${peserta.totalKehadiran}/${peserta.totalSesiMateri}`,
                        "Persentase Kehadiran": `${peserta.persenKehadiran}%`,
                        "Status Rekomendasi": peserta.statusRekomendasiKelulusan,
                        "Status Akhir": peserta.statusAkhirKelulusan ?? "Belum Dinilai"
                    }
                })

                const worksheet = XLSX.utils.json_to_sheet(rows)

                let sheetName = sanitizeSheetName(judulMateri, indexMateri)
                let suffix = 1

                while (usedSheetNames.has(sheetName)) {
                    const baseName = sanitizeSheetName(judulMateri, indexMateri).slice(0, 28)
                    sheetName = `${baseName}-${suffix}`
                    suffix += 1
                }

                usedSheetNames.add(sheetName)
                XLSX.utils.book_append_sheet(workbook, worksheet, sheetName)
            })

            const tanggalUnduh = new Date().toISOString().slice(0, 10)
            const namaFile = `hasil-absensi-peserta-${diklat.judul.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")}-${tanggalUnduh}.xlsx`

            XLSX.writeFileXLSX(workbook, namaFile)
        } finally {
            setIsDownloadingAbsensiReport(false)
        }
    }

    return (
        <ContentCanvas>
            <BackButton url="/admin/kelola-diklat/kelulusan-diklat" />

            <div>
                <h1 className="font-bold">Selesaikan Diklat & Verifikasi Kelulusan Peserta</h1>
                <p className="text-sm text-gray-500">Cek kehadiran peserta dan lakukan keputusan kelulusan per peserta sesuai ambang minimal kehadiran.</p>
            </div>

            {
                statePublishKelulusanPesertaDiklatAction?.message &&
                <Alert>
                    <AlertTitle>Pesan:</AlertTitle>
                    <AlertDescription>{statePublishKelulusanPesertaDiklatAction.message}</AlertDescription>
                </Alert>
            }

            <Card>
                <CardHeader>
                    <Badge className="w-fit">{diklat.statusPelaksanaanAcara}</Badge>
                    <CardTitle>{diklat.judul}</CardTitle>
                    <CardDescription>Minimal kehadiran untuk lulus: {diklat.minimalKehadiranPersen}%</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-3 gap-3 max-md:grid-cols-1">
                    <div className="text-sm">
                        <h2>Total Peserta Diterima</h2>
                        <p className="font-semibold">{daftarPesertaEvaluasi.length} peserta</p>
                    </div>
                    <div className="text-sm">
                        <h2>Total Sesi Materi</h2>
                        <p className="font-semibold">{daftarPesertaEvaluasi[0]?.totalSesiMateri ?? 0} sesi</p>
                    </div>
                    <div className="text-sm">
                        <h2>Mode Penilaian</h2>
                        <p className="font-semibold">Berdasarkan persentase kehadiran</p>
                    </div>
                </CardContent>
            </Card>

            <div className="flex justify-end">
                <Button
                    type="button"
                    variant="outline"
                    onClick={unduhHasilAbsensiPeserta}
                    disabled={isDownloadingAbsensiReport || daftarPesertaEvaluasi.length === 0 || (daftarPesertaEvaluasi[0]?.detailAbsensiPerMateri.length ?? 0) === 0}
                >
                    <BiDownload /> {isDownloadingAbsensiReport ? "Menyiapkan File..." : "Unduh Hasil Absensi Peserta"}
                </Button>
            </div>

            {
                isKelulusanSudahDiterbitkan &&
                <Alert>
                    <AlertTitle>Status Kelulusan</AlertTitle>
                    <AlertDescription>
                        Kelulusan peserta untuk diklat ini sudah diterbitkan. Semua peserta telah memiliki status akhir kelulusan.
                    </AlertDescription>
                </Alert>
            }

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>No</TableHead>
                        <TableHead>Nama Peserta</TableHead>
                        <TableHead>Asal Instansi</TableHead>
                        <TableHead>Kehadiran</TableHead>
                        <TableHead>Persentase Kehadiran</TableHead>
                        <TableHead>Status Rekomendasi</TableHead>
                        <TableHead>Status Akhir</TableHead>
                        <TableHead>Aksi</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {
                        daftarPesertaEvaluasi.length > 0 ?
                            daftarPesertaEvaluasi.map((peserta, index) => (
                                <TableRow key={peserta.id}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell className="font-semibold">{peserta.namaPeserta}</TableCell>
                                    <TableCell>{peserta.namaInstansi}</TableCell>
                                    <TableCell>{peserta.totalKehadiran} / {peserta.totalSesiMateri}</TableCell>
                                    <TableCell>{peserta.persenKehadiran}%</TableCell>
                                    <TableCell>
                                        {
                                            peserta.statusRekomendasiKelulusan === "Lulus" ?
                                                <Badge>Lulus</Badge>
                                                :
                                                <Badge variant="destructive">Tidak Lulus</Badge>
                                        }
                                    </TableCell>
                                    <TableCell>
                                        {
                                            peserta.statusAkhirKelulusan === "Lulus" ?
                                                <Badge>Lulus</Badge>
                                                : peserta.statusAkhirKelulusan === "Tidak Lulus" ?
                                                    <Badge variant="destructive">Tidak Lulus</Badge>
                                                    :
                                                    <Badge variant="outline">Belum Dinilai</Badge>
                                        }
                                    </TableCell>
                                    <TableCell className="space-x-2">
                                        <InfoDialog
                                            title={`Detail Absensi - ${peserta.namaPeserta}`}
                                            description="Rekap status absensi peserta pada setiap materi diklat."
                                            sections={[
                                                {
                                                    title: "Rekap Keseluruhan",
                                                    fields: [
                                                        { label: "Hadir", value: String(peserta.totalStatusAbsensi.hadir) },
                                                        { label: "Tidak Hadir", value: String(peserta.totalStatusAbsensi.tidakHadir) },
                                                        { label: "Izin", value: String(peserta.totalStatusAbsensi.izin) },
                                                        { label: "Sakit", value: String(peserta.totalStatusAbsensi.sakit) }
                                                    ]
                                                },
                                                ...peserta.detailAbsensiPerMateri.map((detailMateri) => ({
                                                    title: detailMateri.judulMateri,
                                                    fields: [
                                                        {
                                                            label: "Status Absensi",
                                                            value: detailMateri.statusAbsensi,
                                                            isBadge: true,
                                                            badgeVariant: getBadgeVariantByStatusAbsensi(detailMateri.statusAbsensi)
                                                        }
                                                    ]
                                                }))
                                            ]}
                                        />
                                        <Button
                                            size="sm"
                                            variant={statusKelulusanByPesertaId[peserta.id] === 2 ? "default" : "outline"}
                                            onClick={() => {
                                                setStatusKelulusanByPesertaId((prevState) => ({
                                                    ...prevState,
                                                    [peserta.id]: 2
                                                }))
                                            }}>
                                            <BiCheck /> Lulus
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant={statusKelulusanByPesertaId[peserta.id] === 3 ? "destructive" : "outline"}
                                            onClick={() => {
                                                setStatusKelulusanByPesertaId((prevState) => ({
                                                    ...prevState,
                                                    [peserta.id]: 3
                                                }))
                                            }}>
                                            <BiX /> Tidak Lulus
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                            :
                            <TableRow>
                                <TableCell colSpan={8} className="text-center">Belum ada peserta diterima untuk dinilai</TableCell>
                            </TableRow>
                    }
                </TableBody>
            </Table>

            <Card>
                <CardHeader>
                    <CardTitle>Pesan Kelulusan untuk Peserta</CardTitle>
                    <CardDescription>
                        Pesan ini akan ditampilkan ke semua peserta pada halaman hasil akhir, baik yang lulus maupun tidak lulus.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                    <Label htmlFor="pesanKelulusanPeserta">Pesan</Label>
                    <div className="flex gap-2">
                        <Button type="button" size="sm" variant="outline" onClick={() => applyEditorCommand("bold")}>
                            <BiBold /> Tebal
                        </Button>
                        <Button type="button" size="sm" variant="outline" onClick={() => applyEditorCommand("italic")}>
                            <BiItalic /> Miring
                        </Button>
                        <Button type="button" size="sm" variant="outline" onClick={insertLink}>
                            <BiLinkExternal /> Tambah Link
                        </Button>
                    </div>
                    <div className="relative">
                        {
                            isPesanKelulusanKosong &&
                            <p className="pointer-events-none absolute left-3 top-2 text-sm text-muted-foreground">
                                Silakan tambahkan informasi hasil kelulusan, sertifikasi peserta, serta dokumen pendukung lain yang diperlukan peserta.
                            </p>
                        }
                        <div
                            id="pesanKelulusanPeserta"
                            ref={editorRef}
                            contentEditable
                            suppressContentEditableWarning
                            className="min-h-28 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
                            onInput={(event) => {
                                setPesanKelulusanPeserta(sanitizeEditorHtml(event.currentTarget.innerHTML))
                            }}
                        />
                    </div>
                    <p className="text-xs text-muted-foreground">Gunakan tombol Tambah Link untuk menyisipkan tautan yang dapat diklik peserta.</p>
                </CardContent>
            </Card>

            <div className="flex justify-end">
                <ActionDialog
                    title="Terbitkan Kelulusan Peserta"
                    description="Apakah Anda yakin ingin menerbitkan hasil kelulusan peserta diklat ini? Pastikan keputusan per peserta sudah sesuai."
                    sections={[
                        {
                            title: "Informasi",
                            fields: [
                                { label: "Diklat", value: diklat.judul },
                                { label: "Minimal Kehadiran", value: `${diklat.minimalKehadiranPersen}%` },
                                { label: "Total Peserta Dinilai", value: String(daftarPesertaEvaluasi.length) },
                                { label: "Lulus", value: String(totalLulusFinal) },
                                { label: "Tidak Lulus", value: String(totalTidakLulusFinal) },
                                { label: "Pesan Kelulusan", value: pesanKelulusanPreview || "-" }
                            ]
                        }
                    ]}
                    triggerButton={<Button>Terbitkan Kelulusan Peserta</Button>}
                    actionButton={
                        <form action={formActionPublishKelulusanPesertaDiklatAction}>
                            <input type="hidden" name="diklatId" value={diklat.id} />
                            <input type="hidden" name="daftarKelulusanPeserta" value={JSON.stringify(daftarKelulusanPeserta)} />
                            <input type="hidden" name="pesanKelulusanPeserta" value={pesanKelulusanPeserta} />
                            <input type="hidden" name="currentPath" value={pathName + "?" + searchParams.toString()} />

                            <AlertDialogAction type="submit">Ya, Terbitkan</AlertDialogAction>
                        </form>
                    }
                />
            </div>
        </ContentCanvas>
    )
}
