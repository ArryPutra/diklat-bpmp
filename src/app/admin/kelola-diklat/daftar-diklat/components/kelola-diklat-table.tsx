"use client"

import { deleteDiklatAction } from "@/actions/diklat-action";
import ActionDialog from "@/components/shared/dialog/action-dialog";
import LoadingScreen from "@/components/shared/loading-screen";
import TextLink from "@/components/shared/text-link";
import { AlertDialogAction } from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatDateId } from "@/utils/dateFormatted";
import { getRowNumber } from "@/utils/getRowNumber";
import Link from "next/link";
import { useActionState } from "react";
import { BiAward, BiBookOpen, BiCertification, BiEdit, BiInfoCircle, BiShield, BiShieldAlt, BiSolidCertification, BiTrash } from "react-icons/bi";
import { FaCertificate } from "react-icons/fa";

export default function KelolaDiklatTable({
    daftarDiklat,
    currentPage
}: {
    daftarDiklat: any[]
    currentPage: number
}) {

    const [stateDeleteDiklat, formActionDeleteDiklat, pendingDeleteDiklat] =
        useActionState(deleteDiklatAction, null);

    return (
        <>
            <LoadingScreen isLoading={pendingDeleteDiklat} />

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>No.</TableHead>
                        <TableHead>Judul</TableHead>
                        <TableHead>Metode</TableHead>
                        <TableHead>Status Pendaftaran</TableHead>
                        <TableHead>Status Pelaksanaan</TableHead>
                        <TableHead>Jumlah Materi</TableHead>
                        <TableHead>Tanggal Buka Pendaftaran</TableHead>
                        <TableHead>Aksi</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {daftarDiklat.length > 0 ?
                        daftarDiklat.map((diklat: any, index: number) =>
                            <TableRow key={index}>
                                <TableCell>{getRowNumber(index, currentPage, 10)}</TableCell>
                                <TableCell className="font-semibold">
                                    <TextLink
                                        url={`/diklat/${diklat.id}`}
                                        targetBlank={true}>
                                        {diklat.judul}
                                    </TextLink>
                                </TableCell>
                                <TableCell>
                                    <Badge className={`${diklat.metodeDiklat.backgroundColor}`}>
                                        {diklat.metodeDiklat.nama}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <Badge className={`${diklat.statusPendaftaranDiklat.backgroundColor}`}>
                                        {diklat.statusPendaftaranDiklat.nama}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <Badge className={`${diklat.statusPelaksanaanAcaraDiklat.backgroundColor}`}>
                                        {diklat.statusPelaksanaanAcaraDiklat.nama}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <TextLink url={`/admin/kelola-diklat/daftar-diklat/${diklat.id}/materi`}>
                                        {
                                            diklat.materiDiklat.length > 0 ?
                                                `${diklat.materiDiklat.length} Materi`
                                                : <span className="text-red-500 font-semibold">Tidak ada materi</span>
                                        }
                                    </TextLink>
                                </TableCell>
                                <TableCell>
                                    {formatDateId(diklat.tanggalBukaPendaftaran)}
                                </TableCell>
                                <TableCell className="space-x-2">
                                    {/* Info aksi */}
                                    <Link href={`/admin/kelola-diklat/daftar-diklat/${diklat.id}`}>
                                        <Button size='icon-sm' variant='outline'><BiInfoCircle /></Button>
                                    </Link>
                                    {/* Materi Aksi */}
                                    <Link href={`/admin/kelola-diklat/daftar-diklat/${diklat.id}/materi`}>
                                        <Button size='icon-sm' className="bg-amber-500 hover:bg-amber-500/90"><BiBookOpen /></Button>
                                    </Link>
                                    {/* Edit Aksi */}
                                    <Link href={`/admin/kelola-diklat/daftar-diklat/${diklat.id}/edit`}>
                                        <Button size='icon-sm'><BiEdit /></Button>
                                    </Link>
                                    {/* Sertifikasi */}
                                    <Link href={`/admin/kelola-diklat/daftar-diklat/${diklat.id}/sertifikat`}>
                                        <Button size='icon-sm' className="bg-purple-500 hover:bg-purple-500/90"><BiAward /></Button>
                                    </Link>
                                    {/* Aksi hapus */}
                                    <ActionDialog
                                        triggerButton={
                                            <Button size='icon-sm' variant='destructive'><BiTrash /></Button>
                                        }
                                        title="Hapus Diklat"
                                        description="Apakah anda yakin ingin menghapus diklat ini?"
                                        actionButton={
                                            <form action={formActionDeleteDiklat}>
                                                <input type="hidden" name="diklatId" value={diklat.id} />
                                                <AlertDialogAction variant='destructive' type="submit">Hapus</AlertDialogAction>
                                            </form>
                                        }
                                        sections={[
                                            {
                                                title: "Informasi Diklat",
                                                fields: [
                                                    { label: "Judul", value: diklat.judul }
                                                ]
                                            }
                                        ]}
                                        sectionsGrid={1}
                                    />
                                </TableCell>
                            </TableRow>
                        )
                        :
                        <TableRow>
                            <TableCell colSpan={9} className="text-center py-4">
                                Tidak ada data
                            </TableCell>
                        </TableRow>
                    }
                </TableBody>
            </Table>
        </>
    )
}
