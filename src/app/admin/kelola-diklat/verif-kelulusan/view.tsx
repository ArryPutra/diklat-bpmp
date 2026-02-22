"use client"

import { ContentCanvas } from "@/components/layouts/auth-layout"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { formatDateId } from "@/utils/dateFormatted"
import Link from "next/link"

export default function Admin_VerifKelulusan_View({
    daftarDiklatSelesai
}: {
    daftarDiklatSelesai: any[]
}) {

    return (
        <ContentCanvas>
            <div>
                <h1 className="font-bold">Verifikasi Kelulusan Peserta Diklat</h1>
                <p className="text-sm text-gray-500">Daftar diklat selesai yang seluruh materi dan seluruh peserta diterima sudah memiliki absensi lengkap.</p>
            </div>

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>No</TableHead>
                        <TableHead>Judul Diklat</TableHead>
                        <TableHead>Tanggal Selesai</TableHead>
                        <TableHead>Jumlah Peserta</TableHead>
                        <TableHead>Aksi</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {
                        daftarDiklatSelesai.length > 0 ?
                            daftarDiklatSelesai.map((diklat, index) => (
                                <TableRow key={diklat.id}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell className="font-semibold">{diklat.judul}</TableCell>
                                    <TableCell>{formatDateId(diklat.tanggalSelesaiAcara)}</TableCell>
                                    <TableCell>{diklat.totalPesertaDiterima}</TableCell>
                                    <TableCell>
                                        <Link href={`/admin/kelola-diklat/verif-kelulusan/${diklat.id}`}>
                                            <Button size='sm'>Detail</Button>
                                        </Link>
                                    </TableCell>
                                </TableRow>
                            ))
                            :
                            <TableRow>
                                <TableCell colSpan={6} className="text-center">Belum ada diklat yang memenuhi syarat</TableCell>
                            </TableRow>
                    }
                </TableBody>
                <TableCaption>
                    Menampilkan daftar diklat selesai dengan absensi lengkap di semua materi untuk seluruh peserta diterima.
                </TableCaption>
            </Table>
        </ContentCanvas>
    )
}
