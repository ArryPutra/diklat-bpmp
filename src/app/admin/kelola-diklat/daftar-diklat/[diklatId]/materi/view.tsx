"use client"

import { createMateriDiklatAction, deleteMateriDiklatAction, updateMateriDiklatAction } from "@/actions/materi-diklat-action"
import { ContentCanvas } from "@/components/layouts/auth-layout"
import BackButton from "@/components/shared/back-button"
import ActionDialog from "@/components/shared/dialog/action-dialog"
import FormDialog from "@/components/shared/dialog/form-dialog"
import InfoDialog from "@/components/shared/dialog/info-dialog"
import GetStatusMateriDiklatBadge from "@/components/shared/get-status-materi-diklat-badge"
import LoadingScreen from "@/components/shared/loading-screen"
import TextLink from "@/components/shared/text-link"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertDialogAction } from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { formatDateId } from "@/utils/dateFormatted"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useActionState } from "react"
import { BiCalendar, BiEdit, BiPlus, BiTime, BiX } from "react-icons/bi"
import DialogFormMateri from "./components/dialog-form-materi"

export default function Admin_DaftarDiklatMateri_View({
    diklatId,
    daftarNarasumber,
    daftarMateriDiklat,
    newMessage
}: {
    diklatId: string,
    daftarNarasumber: any[]
    daftarMateriDiklat: any[]
    newMessage?: string
}) {

    const router = useRouter();

    return (
        <ContentCanvas>
            <div>
                <BackButton />
            </div>

            <DialogTambahMateri
                daftarNarasumber={daftarNarasumber}
                diklatId={diklatId} />

            {
                newMessage &&
                <Alert>
                    <AlertTitle>Pesan:</AlertTitle>
                    <AlertDescription>{newMessage}</AlertDescription>
                </Alert>
            }

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>No.</TableHead>
                        <TableHead>Judul</TableHead>
                        <TableHead>Deskripsi</TableHead>
                        <TableHead>Waktu Pelaksanaan</TableHead>
                        <TableHead>Narasumber</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Link Materi</TableHead>
                        <TableHead>Aksi</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {
                        daftarMateriDiklat.length > 0 ?
                            daftarMateriDiklat.map((materi, index) => (
                                <TableRow key={index}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell className="font-semibold">{materi.judul}</TableCell>
                                    <TableCell>{materi.deskripsi}</TableCell>
                                    <TableCell>
                                        <div className="flex flex-col gap-2 py-1">
                                            <div className="flex items-center gap-2">
                                                <BiCalendar />
                                                <span className="text-sm font-medium text-gray-900">
                                                    {formatDateId(materi.tanggalPelaksanaan)}
                                                </span>
                                            </div>
                                            <Separator />
                                            <div className="flex items-center gap-2">
                                                <BiTime />
                                                <span className="text-sm font-medium text-gray-900">
                                                    {materi.waktuMulai} - {materi.waktuSelesai}
                                                </span>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <TextLink
                                            url={`/admin/kelola-narasumber/${materi.narasumber.id}`}>
                                            {materi.narasumber.user.name}
                                        </TextLink>
                                    </TableCell>
                                    <TableCell>
                                        <GetStatusMateriDiklatBadge materi={materi} />
                                    </TableCell>
                                    <TableCell>
                                        {
                                            materi.linkMateri ?
                                                <Link href={materi.linkMateri} target="_blank" rel="noopener noreferrer">
                                                    <Button size='xs' variant='link'>
                                                        Link Materi
                                                    </Button>
                                                </Link>
                                                :
                                                '-'
                                        }
                                    </TableCell>
                                    <TableCell className="space-x-2">
                                        <DialogInfoMateri
                                            materi={materi} />
                                        <DialogEditMateri
                                            materiDiklat={materi}
                                            daftarNarasumber={daftarNarasumber} />
                                        <DialogHapusMateri
                                            materi={materi}
                                            materiDiklatId={materi.id}
                                            diklatId={materi.diklatId} />
                                    </TableCell>
                                </TableRow>
                            ))
                            :
                            <TableRow>
                                <TableCell colSpan={99} className="text-center py-6">
                                    Tidak ada data materi diklat.
                                </TableCell>
                            </TableRow>
                    }
                </TableBody>
                <TableCaption>
                    Daftar materi diklat diurutkan berdasarkan waktu mulai paling awal.
                </TableCaption>
            </Table>
        </ContentCanvas>
    )
}

function DialogTambahMateri({
    daftarNarasumber,
    diklatId
}: {
    daftarNarasumber: any[]
    diklatId: string
}) {

    const [state, formAction, isPending] =
        useActionState(createMateriDiklatAction.bind(null, diklatId), null)

    return (
        <FormDialog
            triggerButton={<Button>Tambah Materi <BiPlus /></Button>}
            title="Tambah Materi Diklat"
            description="Silahkan tambahkan materi diklat baru."
            formContent={
                <DialogFormMateri
                    daftarNarasumber={daftarNarasumber}
                    state={state} />
            }
            actionButtonLabel="Tambah Materi"
            formAction={formAction}
            isSuccess={state?.success}
            message={state?.message} />
    )
}

function DialogInfoMateri({
    materi
}: {
    materi: any
}) {
    return (
        <InfoDialog
            title="Detail Materi Diklat"
            description="Detail materi diklat"
            sections={[
                {
                    title: 'Informasi Materi Diklat',
                    fields: [
                        { label: 'Judul Materi', value: materi.judul },
                        { label: 'Deskripsi', value: materi.deskripsi },
                        { label: 'Status', value: <GetStatusMateriDiklatBadge materi={materi} /> },
                        { label: 'Tanggal Pelaksanaan', value: formatDateId(materi.tanggalPelaksanaan) },
                        { label: 'Waktu Mulai', value: materi.waktuMulai },
                        { label: 'Waktu Selesai', value: materi.waktuSelesai },
                        { label: 'Narasumber', value: materi.narasumber.user.name },
                        { label: 'File Materi', value: materi.linkMateri || '-', isLink: true }
                    ]
                }
            ]} />
    )
}

function DialogHapusMateri({
    materi,
    materiDiklatId,
    diklatId
}: {
    materi: any
    materiDiklatId: number
    diklatId: string
}) {

    const [state, formAction, isPending] =
        useActionState(deleteMateriDiklatAction.bind(null, materiDiklatId, diklatId), null)

    return (
        <>
            <LoadingScreen isLoading={isPending} />
            <ActionDialog
                triggerButton={<Button variant="destructive" size='icon-sm'><BiX /></Button>}
                title="Hapus Materi"
                description="Hapus materi"
                sections={
                    [
                        {
                            title: "Informasi Materi",
                            fields: [
                                {
                                    label: "Judul",
                                    value: materi.judul
                                }
                            ]
                        }
                    ]
                }
                actionButton={
                    <form action={formAction}>
                        <AlertDialogAction variant='destructive' type="submit">
                            Hapus Materi
                        </AlertDialogAction>
                    </form>
                } />
        </>
    )
}

function DialogEditMateri({
    materiDiklat,
    daftarNarasumber
}: {
    materiDiklat: any
    daftarNarasumber: any[]
}) {

    const [state, formAction, isPending] =
        useActionState(updateMateriDiklatAction.bind(null, materiDiklat.id), null)

    return (
        <FormDialog
            triggerButton={<Button size='icon-sm'><BiEdit /></Button>}
            title="Tambah Materi Diklat"
            description="Silahkan tambahkan materi diklat baru."
            formContent={
                <DialogFormMateri
                    daftarNarasumber={daftarNarasumber}
                    state={state}
                    materiDiklat={materiDiklat} />
            }
            actionButtonLabel="Edit Materi"
            formAction={formAction}
            isSuccess={state?.success}
            message={state?.message} />
    )

}