"use client"

import ActionDialog from "@/components/shared/dialog/action-dialog";
import LoadingScreen from "@/components/shared/loading-screen";
import { AlertDialogAction } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getRowNumber } from "@/utils/getRowNumber";
import Link from "next/link";
import { BiBlock, BiCheck, BiEdit, BiInfoCircle } from "react-icons/bi";

export default function KelolaPesertaTable({
    daftarPeserta,
    formActionUpdateStatusUser
}: {
    daftarPeserta: any[]
    formActionUpdateStatusUser: (data: FormData) => void
}) {

    return (
        <>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>No.</TableHead>
                        <TableHead>Nama</TableHead>
                        <TableHead>Kontak</TableHead>
                        <TableHead>NIK</TableHead>
                        <TableHead>Jenis Kelamin</TableHead>
                        <TableHead>Aksi</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {daftarPeserta.length > 0 ?
                        daftarPeserta.map((peserta: any, index: number) =>
                            <TableRow key={index}>
                                <TableCell>{getRowNumber(index, 1, 10)}</TableCell>
                                <TableCell className="font-semibold">
                                    {peserta.user.name}
                                </TableCell>
                                <TableCell>
                                    <span className="font-semibold">{peserta.nomorTelepon}</span>
                                    <br />
                                    <span>{peserta.user.email}</span>
                                </TableCell>
                                <TableCell>
                                    {peserta.nik}
                                </TableCell>
                                <TableCell>
                                    {peserta.jenisKelamin}
                                </TableCell>
                                <TableCell className="space-x-2">
                                    {/* Info aksi */}
                                    <Link href={`/instansi/kelola-peserta/${peserta.id}`}>
                                        <Button size='icon-sm' variant='outline'><BiInfoCircle /></Button>
                                    </Link>
                                    {/* Edit Aksi */}
                                    <Link href={`/instansi/kelola-peserta/${peserta.id}/edit`}>
                                        <Button size='icon-sm'><BiEdit /></Button>
                                    </Link>
                                    {
                                        peserta.user.banned
                                            ? <ActionDialog
                                                triggerButton={
                                                    <Button size='icon-sm'>
                                                        <BiCheck />
                                                    </Button>
                                                }
                                                title='Aktifkan Peserta'
                                                description='Apakah Anda yakin ingin mengaktifkan peserta ini?'
                                                sections={[
                                                    {
                                                        title: "Informasi Peserta",
                                                        fields: [
                                                            { label: 'Nama Peserta', value: peserta.user.name },
                                                        ]
                                                    }
                                                ]}
                                                actionButton={
                                                    <form action={formActionUpdateStatusUser}>
                                                        <Input type='hidden' name='userId' value={peserta.user.id} />
                                                        <Input type='hidden' name='banned' value="false" />
                                                        <Input type='hidden' name='currentPath' value={"/instansi/kelola-peserta"} />

                                                        <AlertDialogAction type='submit'>
                                                            Aktifkan
                                                        </AlertDialogAction>
                                                    </form>
                                                } />
                                            : <ActionDialog
                                                triggerButton={
                                                    <Button variant='destructive' size='icon-sm'>
                                                        <BiBlock />
                                                    </Button>
                                                }
                                                title='Nonaktifkan Peserta'
                                                description='Apakah Anda yakin ingin menonaktifkan peserta ini?'
                                                sections={[
                                                    {
                                                        title: "Informasi Peserta",
                                                        fields: [
                                                            { label: 'Nama Peserta', value: peserta.user.name },
                                                        ]
                                                    }
                                                ]}
                                                actionButton={
                                                    <form action={formActionUpdateStatusUser}>
                                                        <Input type='hidden' name='userId' value={peserta.user.id} />
                                                        <Input type='hidden' name='banned' value="true" />
                                                        <Input type='hidden' name='currentPath' value={"/instansi/kelola-peserta"} />

                                                        <AlertDialogAction
                                                            variant='destructive'
                                                            type='submit'>
                                                            Nonaktifkan
                                                        </AlertDialogAction>
                                                    </form>
                                                } />
                                    }
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
                <TableCaption>
                    Daftar peserta ini hanya menampilkan peserta yang berasal dari instansi Anda.
                </TableCaption>
            </Table>
        </>
    )
}
