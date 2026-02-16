"use client"

import { updateManyStatusDaftarPesertaDiklatAction, updateStatusDaftarPesertaDiklatAction } from "@/actions/peserta-diklat-action";
import { ContentCanvas } from "@/components/layouts/auth-layout";
import BackButton from "@/components/shared/back-button";
import ActionDialog from "@/components/shared/dialog/action-dialog";
import { PaginationWithLinks } from "@/components/shared/pagination-with-links";
import Search from "@/components/shared/search";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertDialogAction } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatDateTimeId } from "@/utils/dateFormatted";
import { usePathname, useSearchParams } from "next/navigation";
import { useActionState } from "react";
import { BiCheck, BiX } from "react-icons/bi";

export default function VerifikasiPesertaDiklatView_PesertaDiklat({
    diklat,
    daftarPesertaDiklat,
    totalPesertaDiklat
}: {
    diklat: any,
    daftarPesertaDiklat: any[]
    totalPesertaDiklat: number
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
            <BackButton url="/admin/dashboard?content=verifikasi-peserta-diklat" />

            <div className='flex justify-between flex-wrapgap-3'>
                <div>
                    <h1 className='font-bold'>Registrasi Peserta Diklat</h1>
                    <p className='text-sm'>Daftar registrasi peserta diklat yang perlu ditinjau</p>
                </div>
            </div>

            {
                newMessage &&
                <Alert>
                    <AlertTitle>Pesan:</AlertTitle>
                    <AlertDescription>{newMessage}</AlertDescription>
                </Alert>
            }

            <div className="flex justify-between">
                <Search />

                <DialogTerimaSemuaPeserta
                    formAction={formActionManyUpdateStatusPendaftarPesertaDiklatAction} />
            </div>

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>No</TableHead>
                        <TableHead>Nama Peserta</TableHead>
                        <TableHead>Status Daftar</TableHead>
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
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>{pesertaDiklat.peserta.user.name}</TableCell>
                                    <TableCell>{pesertaDiklat.statusDaftarPesertaDiklat.nama}</TableCell>
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
                                <TableCell colSpan={5} className="text-center">Tidak ada data</TableCell>
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