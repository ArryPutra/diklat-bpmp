"use client"

import { updateManyStatusDaftarPesertaDiklatAction, updateStatusDaftarPesertaDiklatAction } from "@/actions/peserta-diklat-action";
import { ContentCanvas } from "@/components/layouts/auth-layout";
import BackButton from "@/components/shared/back-button";
import ActionDialog from "@/components/shared/dialog/action-dialog";
import { PaginationWithLinks } from "@/components/shared/pagination-with-links";
import Search from "@/components/shared/search";
import SelectDropdown from "@/components/shared/select-dropdown";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertDialogAction } from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { dateRangeFormatted, formatDateTimeId } from "@/utils/dateFormatted";
import { getRowNumber } from "@/utils/getRowNumber";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useActionState } from "react";
import { BiCheck, BiRightArrowAlt, BiX } from "react-icons/bi";

export default function VerifikasiPesertaDiklatView_PesertaDiklat({
    diklat,
    daftarPesertaDiklat,
    totalPesertaDiklat,
    daftarInstansiUnik
}: {
    diklat: any,
    daftarPesertaDiklat: any[]
    totalPesertaDiklat: number
    daftarInstansiUnik: any[]
}) {

    const params = new URLSearchParams(useSearchParams().toString());
    const currentPage = parseInt(params.get("page") ?? "1");

    const [stateUpdateStatusPendaftarPesertaDiklatAction, formActionUpdateStatusPendaftarPesertaDiklatAction, pendingUpdateStatusPendaftarPesertaDiklatAction] =
        useActionState(updateStatusDaftarPesertaDiklatAction, null);

    const [stateManyUpdateStatusPendaftarPesertaDiklatAction, formActionManyUpdateStatusPendaftarPesertaDiklatAction, pendingManyUpdateStatusPendaftarPesertaDiklatAction] =
        useActionState(updateManyStatusDaftarPesertaDiklatAction.bind(null, daftarPesertaDiklat.map((pesertaDiklat: any) => pesertaDiklat.id)), null);

    const newMessage = stateUpdateStatusPendaftarPesertaDiklatAction?.message ?? stateManyUpdateStatusPendaftarPesertaDiklatAction?.message;

    return (
        <ContentCanvas>
            <BackButton url="/admin/kelola-diklat/verifikasi-peserta" />

            <div className='flex justify-between flex-wrap gap-3'>
                <div>
                    <h1 className='font-bold'>Registrasi Peserta Diklat - {diklat?.judul}</h1>
                    <p className='text-sm'>Daftar registrasi peserta diklat yang perlu ditinjau</p>
                </div>
            </div>

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

            {
                newMessage &&
                <Alert>
                    <AlertTitle>Pesan:</AlertTitle>
                    <AlertDescription>{newMessage}</AlertDescription>
                </Alert>
            }

            <div className="flex justify-between items-end flex-wrap gap-3">
                <SelectDropdown
                    label='Instansi'
                    query={{
                        name: "instansiId",
                        defaultValue: "all",
                        deleteValue: "all",
                        values: [
                            { label: "Semua", value: "all" },
                            ...daftarInstansiUnik.map((instansi) => ({
                                label: instansi.instansi.user.name,
                                value: String(instansi.instansiId)
                            }))
                        ],
                    }} />
                <Search />
            </div>

            <DialogTerimaSemuaPeserta
                formAction={formActionManyUpdateStatusPendaftarPesertaDiklatAction} />

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>No</TableHead>
                        <TableHead>Nama Peserta</TableHead>
                        <TableHead>Status Daftar</TableHead>
                        <TableHead>Status Kelulusan</TableHead>
                        <TableHead>Asal Instansi</TableHead>
                        <TableHead>Waktu Pendaftaran</TableHead>
                        <TableHead>Aksi</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {
                        daftarPesertaDiklat.length > 0 ?
                            daftarPesertaDiklat.map((pesertaDiklat, index) => (
                                <TableRow key={index}>
                                    <TableCell>{getRowNumber(index, currentPage, 10)}</TableCell>
                                    <TableCell className="font-semibold">{pesertaDiklat.peserta.user.name}</TableCell>
                                    <TableCell>{pesertaDiklat.statusDaftarPesertaDiklat.nama}</TableCell>
                                    <TableCell>{pesertaDiklat.statusKelulusanPesertaDiklat?.nama ?? "-"}</TableCell>
                                    <TableCell>{pesertaDiklat.peserta.instansi.user.name}</TableCell>
                                    <TableCell>{formatDateTimeId(pesertaDiklat.peserta.createdAt)}</TableCell>
                                    <TableCell className="space-x-2">
                                        {
                                            pesertaDiklat.statusDaftarPesertaDiklat.id === 1 ||
                                                pesertaDiklat.statusDaftarPesertaDiklat.id === 3 ?
                                                <DialogTerimaStatusPeserta
                                                    item={pesertaDiklat}
                                                    formAction={formActionUpdateStatusPendaftarPesertaDiklatAction} />
                                                : null
                                        }
                                        {
                                            pesertaDiklat.statusDaftarPesertaDiklat.id === 1 ||
                                                pesertaDiklat.statusDaftarPesertaDiklat.id === 2 ?
                                                <DialogTolakStatusPeserta
                                                    item={pesertaDiklat}
                                                    formAction={formActionUpdateStatusPendaftarPesertaDiklatAction} />
                                                : null
                                        }
                                    </TableCell>
                                </TableRow>
                            ))
                            :
                            <TableRow>
                                <TableCell colSpan={6} className="text-center">Tidak ada data</TableCell>
                            </TableRow>
                    }
                </TableBody>
            </Table>

            {
                totalPesertaDiklat > 0 &&
                <PaginationWithLinks
                    page={currentPage}
                    pageSize={10}
                    totalCount={totalPesertaDiklat} />
            }
        </ContentCanvas>
    )
}

function DialogTerimaStatusPeserta({
    item,
    formAction
}: {
    item: any
    formAction: (formData: FormData) => void
}) {

    const pathName = usePathname();
    const searchParams = new URLSearchParams(useSearchParams().toString());

    return (
        <ActionDialog
            title='Terima Pendaftaran Diklat'
            description='Apakah Anda yakin ingin menyetujui pendaftaran peserta pada diklat ini?'
            sections={[
                {
                    title: 'Informasi',
                    fields: [
                        { label: 'Nama Peserta', value: item.peserta.user.name },
                        { label: 'Asal Instansi', value: item.peserta.instansi.user.name },
                        { label: 'Waktu Pendaftaran', value: formatDateTimeId(item.peserta.createdAt) },
                    ]
                }
            ]}
            triggerButton={<Button size='sm'><BiCheck /> Terima</Button>}
            actionButton={
                <form action={formAction}>
                    <input type="hidden" name="pesertaDiklatId" value={item.id} />
                    <input type="hidden" name="statusDaftarPesertaDiklatId" value={2} />
                    <input type="hidden" name="currentPath" value={pathName + '?' + searchParams} />

                    <AlertDialogAction type='submit'>
                        Terima Pendaftaran
                    </AlertDialogAction>
                </form>
            } />
    )
}

function DialogTolakStatusPeserta({
    item,
    formAction
}: {
    item: any
    formAction: (formData: FormData) => void
}) {
    const pathName = usePathname();
    const searchParams = new URLSearchParams(useSearchParams().toString());

    return (
        <ActionDialog
            title='Tolak Pendaftaran Peserta Diklat'
            description='Apakah Anda yakin ingin menolak pendaftaran peserta pada diklat ini?'
            sections={[
                {
                    title: 'Informasi',
                    fields: [
                        { label: 'Nama Peserta', value: item.peserta.user.name },
                        { label: 'Asal Instansi', value: item.peserta.instansi.user.name },
                        { label: 'Waktu Pendaftaran', value: formatDateTimeId(item.peserta.createdAt) },
                    ]
                }
            ]}
            triggerButton={<Button size='sm' variant='destructive'><BiX /> Tolak</Button>}
            actionButton={
                <form action={formAction}>
                    <input type="hidden" name="pesertaDiklatId" value={item.id} />
                    <input type="hidden" name="statusDaftarPesertaDiklatId" value={3} />
                    <input type="hidden" name="currentPath" value={pathName + '?' + searchParams} />

                    <AlertDialogAction type='submit' variant='destructive'>
                        Tolak Pendaftaran
                    </AlertDialogAction>
                </form>
            } />
    )
}

function DialogTerimaSemuaPeserta({
    formAction
}: {
    formAction: (formData: FormData) => void
}) {
    const pathName = usePathname();
    const searchParams = new URLSearchParams(useSearchParams().toString());

    return (
        <ActionDialog
            title='Terima Pendaftaran Diklat'
            description='Apakah Anda yakin ingin menyetujui semua pendaftaran peserta pada diklat ini?'
            triggerButton={<Button size='sm'>Terima Semua Peserta <BiCheck /></Button>}
            actionButton={
                <form action={formAction}>
                    <input type="hidden" name="statusDaftarPesertaDiklatId" value='2' />
                    <input type="hidden" name="currentPath" value={pathName + '?' + searchParams} />

                    <AlertDialogAction type='submit'>
                        Terima Semua
                    </AlertDialogAction>
                </form>
            } />
    )
}
