"use client"

import { updateStatusDaftarPesertaDiklatAction } from "@/actions/peserta-diklat-action"
import { ContentCanvas } from "@/components/layouts/auth-layout"
import BackButton from "@/components/shared/back-button"
import ActionDialog from "@/components/shared/dialog/action-dialog"
import TextLink from "@/components/shared/text-link"
import { AlertDialogAction } from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Spinner } from "@/components/ui/spinner"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { dateRangeFormatted } from "@/utils/dateFormatted"
import Link from "next/link"
import { usePathname, useSearchParams } from "next/navigation"
import { useActionState } from "react"
import { BiReply, BiRightArrowAlt, BiX } from "react-icons/bi"

export default function Instansi_DiklatPesertaDetail_View({
    diklat,
    daftarPeserta
}: {
    diklat: any
    daftarPeserta: {
        data: any[]
        total: number
    }
}) {
    return (
        <ContentCanvas>
            <div>
                <h1 className="font-semibold">Daftar Diklat Diikuti</h1>
                <p className="text-sm text-gray-500">Berikut daftar diklat yang pernah atau sedang diikuti</p>
            </div>

            <BackButton url="/instansi/diklat/peserta" />

            <Card>
                <CardHeader>
                    {
                        <Badge className={`${diklat.statusPelaksanaanAcaraDiklat.backgroundColor}`}>
                            {diklat.statusPelaksanaanAcaraDiklat.nama}
                        </Badge>
                    }
                    <CardTitle className='text-lg'>{diklat.judul}</CardTitle>
                    <CardDescription >{diklat.deskripsi}</CardDescription>
                </CardHeader>
                <CardContent className='grid grid-cols-4 gap-3 max-lg:grid-cols-2 max-sm:grid-cols-1'>
                    <div className='text-sm'>
                        <h1>Tanggal Pelaksanaan:</h1>
                        <h1 className='font-semibold'>{dateRangeFormatted(diklat.tanggalMulaiAcara, diklat.tanggalSelesaiAcara)}</h1>
                    </div>
                    <div className='text-sm'>
                        <h1>Metode:</h1>
                        <Badge className={`${diklat.metodeDiklat.backgroundColor}`}>{diklat.metodeDiklat.nama}</Badge>
                    </div>
                    <div className='text-sm'>
                        <h1>Lokasi:</h1>
                        <h1 className='font-semibold'>{diklat.lokasi}</h1>
                    </div>
                    <div className='text-sm'>
                        <h1>Maksimal Kuota:</h1>
                        <h1 className='font-semibold'>{diklat.maksimalKuota} Peserta</h1>
                    </div>
                </CardContent>
                <CardFooter>
                    <Link href={`/diklat/${diklat.id}`} target="_blank">
                        <Button size='sm' variant='outline'>Postingan <BiRightArrowAlt /></Button>
                    </Link>
                </CardFooter>
            </Card>

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>No.</TableHead>
                        <TableHead>Nama</TableHead>
                        <TableHead>Status Pendaftaran</TableHead>
                        <TableHead>Status Pelaksanaan</TableHead>
                        <TableHead>Status Kelulusan</TableHead>
                        <TableHead>Aksi</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {
                        daftarPeserta.data.length > 0 ?
                            daftarPeserta.data.map((dataPeserta, index) => (
                                <TableRow key={dataPeserta.id}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell className="font-semibold">
                                        <TextLink
                                            url={`/instansi/kelola-peserta/${dataPeserta.peserta.id}`}>
                                            {dataPeserta.peserta.user.name}
                                        </TextLink>
                                    </TableCell>
                                    <TableCell>
                                        {dataPeserta.statusDaftarPesertaDiklat.nama || "-"}
                                    </TableCell>
                                    <TableCell>
                                        {dataPeserta?.statusPelaksanaanPesertaDiklat?.nama || '-'}
                                    </TableCell>
                                    <TableCell>

                                        {dataPeserta?.statusKelulusanPesertaDiklat?.nama || '-'}
                                    </TableCell>
                                    <TableCell className="space-x-3">
                                        {/* <DialogMengundurkanDiri
                                            pesertaDiklatId={dataPeserta.id}
                                            peserta={dataPeserta.peserta} /> */}
                                        {
                                            dataPeserta.statusDaftarPesertaDiklat.id === 2 &&
                                            <DialogMengundurkanDiri
                                                pesertaDiklatId={dataPeserta.id}
                                                peserta={dataPeserta.peserta} />
                                        }
                                        {
                                            dataPeserta.statusDaftarPesertaDiklat.id === 4 &&
                                            <DialogBatalMengundurkanDiri
                                                pesertaDiklatId={dataPeserta.id}
                                                peserta={dataPeserta.peserta} />
                                        }
                                    </TableCell>
                                </TableRow>
                            ))
                            :
                            <TableRow>
                                <TableCell colSpan={3} className="text-center">Tidak ada peserta</TableCell>
                            </TableRow>
                    }
                </TableBody>
            </Table>
        </ContentCanvas>
    )
}

function DialogMengundurkanDiri({
    pesertaDiklatId,
    peserta
}: {
    pesertaDiklatId: number
    peserta: any
}) {

    const [state, formAction, pending] =
        useActionState(updateStatusDaftarPesertaDiklatAction, null)

    const pathname = usePathname();
    const searchParams = useSearchParams();

    return (
        <ActionDialog
            title='Mengundurkan Diri'
            description='Apakah Anda yakin ingin mengundurkan diri peserta ini pada diklat?'
            sections={[
                {
                    title: 'Informasi',
                    fields: [
                        { label: 'Nama Peserta', value: peserta.user.name },
                    ]
                }
            ]}
            triggerButton={<Button size='sm' variant='destructive'><BiX /> Mengundurkan Diri {pending && <Spinner />}</Button>}
            actionButton={
                <form action={formAction}>
                    <input type="hidden" name="pesertaDiklatId" value={pesertaDiklatId} />
                    <input type="hidden" name="statusDaftarPesertaDiklatId" value={4} />
                    <input type="hidden" name="currentPath" value={`${pathname}?${searchParams}`} />

                    <AlertDialogAction type='submit' variant='destructive'>
                        Mengundurkan Diri
                    </AlertDialogAction>
                </form>
            } />
    )
}

function DialogBatalMengundurkanDiri({
    pesertaDiklatId,
    peserta
}: {
    pesertaDiklatId: number
    peserta: any
}) {
    const [state, formAction, pending] =
        useActionState(updateStatusDaftarPesertaDiklatAction, null)

    const pathname = usePathname();
    const searchParams = useSearchParams();
    return (
        <ActionDialog
            title='Batal Mengundurkan Diri'
            description='Apakah Anda yakin ingin batal mengundurkan diri peserta ini pada diklat?'
            sections={[
                {
                    title: 'Informasi',
                    fields: [
                        { label: 'Nama Peserta', value: peserta.user.name },
                    ]
                }
            ]}
            triggerButton={<Button size='sm'><BiReply /> Batal Mengundurkan Diri {pending && <Spinner />}</Button>}
            actionButton={
                <form action={formAction}>
                    <input type="hidden" name="pesertaDiklatId" value={pesertaDiklatId} />
                    <input type="hidden" name="statusDaftarPesertaDiklatId" value={2} />
                    <input type="hidden" name="currentPath" value={`${pathname}?${searchParams}`} />

                    <AlertDialogAction type='submit'>
                        Batal Mengundurkan Diri
                    </AlertDialogAction>
                </form>
            } />
    )
}
