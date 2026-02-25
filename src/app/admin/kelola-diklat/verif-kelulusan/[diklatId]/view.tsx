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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { usePathname, useSearchParams } from "next/navigation"
import { useActionState, useMemo, useState } from "react"
import { BiCheck, BiX } from "react-icons/bi"

export default function AdminSelesaikanDiklatView({
    diklat,
    daftarPesertaEvaluasi
}: {
    diklat: {
        id: string
        judul: string
        minimalKehadiranPersen: number
        statusPelaksanaanAcara: string
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

    const daftarKelulusanPeserta = Object.entries(statusKelulusanByPesertaId).map(([pesertaDiklatId, statusKelulusanPesertaDiklatId]) => ({
        pesertaDiklatId: Number(pesertaDiklatId),
        statusKelulusanPesertaDiklatId
    }))

    const totalLulusFinal = daftarKelulusanPeserta.filter((peserta) => peserta.statusKelulusanPesertaDiklatId === 2).length
    const totalTidakLulusFinal = daftarKelulusanPeserta.filter((peserta) => peserta.statusKelulusanPesertaDiklatId === 3).length

    return (
        <ContentCanvas>
            <BackButton url="/admin/kelola-diklat/verif-kelulusan" />

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
                                { label: "Tidak Lulus", value: String(totalTidakLulusFinal) }
                            ]
                        }
                    ]}
                    triggerButton={<Button>Terbitkan Kelulusan Peserta</Button>}
                    actionButton={
                        <form action={formActionPublishKelulusanPesertaDiklatAction}>
                            <input type="hidden" name="diklatId" value={diklat.id} />
                            <input type="hidden" name="daftarKelulusanPeserta" value={JSON.stringify(daftarKelulusanPeserta)} />
                            <input type="hidden" name="currentPath" value={pathName + "?" + searchParams.toString()} />

                            <AlertDialogAction type="submit">Ya, Terbitkan</AlertDialogAction>
                        </form>
                    }
                />
            </div>
        </ContentCanvas>
    )
}
