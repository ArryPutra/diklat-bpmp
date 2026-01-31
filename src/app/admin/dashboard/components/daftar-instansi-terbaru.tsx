import { ContentCanvas } from '@/components/layouts/auth-layout'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogMedia, AlertDialogPortal, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { format, formatDistanceToNow } from 'date-fns';
import { id } from 'date-fns/locale';
import { BiCheck, BiInfoCircle, BiSearch, BiX, BiBuilding, BiUser, BiCalendar, BiPhone, BiMailSend, BiCopy } from 'react-icons/bi'
import { startTransition, useActionState, useEffect, useState } from 'react'
import { AlertTriangleIcon, CheckCircle2Icon, CircleFadingPlusIcon } from 'lucide-react'
import { Spinner } from '@/components/ui/spinner'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { updateStatusRegistrasiInstansi } from '@/actions/registrasi-instansi-action'
import { Dialog, DialogHeader } from '@/components/ui/dialog'
import { DialogContent, DialogDescription, DialogTitle } from '@radix-ui/react-dialog'

export default function DaftarInstansiTerbaru({
    daftarRegistrasiInstansi
}: {
    daftarRegistrasiInstansi: any[]
}) {
    return (
        <ContentCanvas>
            <div className='flex justify-between flex-wrap mb-4 gap-3'>
                <div>
                    <h1 className='font-bold'>Pendaftaran Instansi Terbaru</h1>
                    <p className='text-sm'>Pendaftaran instansi yang perlu ditinjau</p>
                </div>
                <div className='flex gap-2'>
                    <Input placeholder='Cari' />
                    <Button size='icon'><BiSearch /></Button>
                </div>
            </div>

            <Table className='max-w-full'>
                <TableHeader>
                    <TableRow>
                        <TableHead>No</TableHead>
                        <TableHead>Instansi</TableHead>
                        <TableHead>Instansi Kontak</TableHead>
                        <TableHead>PIC</TableHead>
                        <TableHead>PIC Kontak</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Waktu Pendaftaran</TableHead>
                        <TableHead>Aksi</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {
                        daftarRegistrasiInstansi.length !== 0
                            ?
                            daftarRegistrasiInstansi.map((item: any, index: number) => (
                                <TableRow key={index}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>{item.nama}</TableCell>
                                    <TableCell>
                                        <span className='font-semibold'>{item.nomorTelepon}</span>
                                        <br />
                                        <span>{item.email}</span>
                                    </TableCell>
                                    <TableCell>{item.registrasiPicInstansi.nama}</TableCell>
                                    <TableCell>
                                        <span className='font-semibold'>{item.registrasiPicInstansi.nomorTelepon}</span>
                                        <br />
                                        <span>{item.registrasiPicInstansi.email}</span>
                                    </TableCell>
                                    <TableCell>
                                        <span className={`${item.statusRegistrasiInstansi.warna} px-4 py-2 rounded-full text-white text-xs font-semibold`}>
                                            {item.statusRegistrasiInstansi.nama}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        {
                                            formatDistanceToNow(new Date(item.createdAt), {
                                                locale: id
                                            })
                                        }
                                    </TableCell>
                                    <TableCell className='space-x-2'>
                                        <DialogInfo registrasiInstansi={item} />
                                        {
                                            item.statusRegistrasiInstansiId === 1 &&
                                            <DialogDitolak registrasiInstansi={item} />
                                        }
                                        {
                                            item.statusRegistrasiInstansiId !== 2 &&
                                            <DialogDiterima registrasiInstansi={item} />
                                        }
                                    </TableCell>
                                </TableRow>
                            ))
                            :
                            <TableRow>
                                <TableCell colSpan={7} className='text-center'>Tidak ada data</TableCell>
                            </TableRow>
                    }
                </TableBody>
            </Table>
        </ContentCanvas>
    )
}

function DialogInfo({ registrasiInstansi }: { registrasiInstansi: any }) {
    const sections = [
        {
            title: 'Informasi Instansi',
            fields: [
                { label: 'Nama Instansi', value: registrasiInstansi.nama },
                { label: 'Email', value: registrasiInstansi.email },
                { label: 'Nomor Telepon', value: registrasiInstansi.nomorTelepon },
                { label: 'Desa/Kelurahan', value: registrasiInstansi.desaKelurahan },
                { label: 'Kecamatan', value: registrasiInstansi.kecamatan },
                { label: 'Kabupaten/Kota', value: registrasiInstansi.kabupatenKota },
                { label: 'Alamat', value: registrasiInstansi.alamat }
            ]
        },
        {
            title: 'Informasi Penanggung Jawab (PIC)',
            fields: [
                { label: 'Nama PIC', value: registrasiInstansi.registrasiPicInstansi.nama },
                { label: 'Email PIC', value: registrasiInstansi.registrasiPicInstansi.email },
                { label: 'Nomor Telepon', value: registrasiInstansi.registrasiPicInstansi.nomorTelepon },
                { label: 'Jabatan', value: registrasiInstansi.registrasiPicInstansi.jabatan }
            ]
        },
        {
            title: 'Status Pendaftaran',
            fields: [
                { label: 'Status', value: registrasiInstansi.statusRegistrasiInstansi.nama },
                { label: 'Tanggal Pendaftaran', value: format(new Date(registrasiInstansi.createdAt), 'EEEE, dd MMMM yyyy', { locale: id }) }
            ]
        }
    ]

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button size='icon-sm' variant="outline">
                    <BiInfoCircle />
                </Button>
            </AlertDialogTrigger>

            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Detail Pendaftaran Instansi</AlertDialogTitle>
                    <AlertDialogDescription>
                        Kode Tiket Registrasi: {registrasiInstansi.id}
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <div className='space-y-4 max-h-96 overflow-y-auto'>
                    {sections.map((section, index) =>
                        <div key={index} className='border rounded-lg p-4'>
                            <h3 className='font-semibold mb-3'>{section.title}</h3>
                            <div className='grid grid-cols-2 gap-3 text-sm max-md:grid-cols-1'>
                                {section.fields.map((field: any) => (
                                    <div key={field.label}>
                                        <p className='text-gray-500 text-xs'>{field.label}</p>
                                        <p className='font-medium'>{field.value || '-'}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <AlertDialogFooter>
                    <AlertDialogCancel>Tutup</AlertDialogCancel>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

function DialogDitolak({ registrasiInstansi }: { registrasiInstansi: any }) {
    const [state, formAction, pending] = useActionState(updateStatusRegistrasiInstansi, null);

    const sections = {
        title: 'Informasi',
        fields: [
            { label: 'Nama Instansi', value: registrasiInstansi.nama },
            { label: 'Tanggal Pendaftaran', value: format(new Date(registrasiInstansi.createdAt), 'EEEE, dd MMMM yyyy', { locale: id }) },
        ]
    }

    function onSubmit() {
        const formData = new FormData();
        formData.append('registrasiInstansiId', registrasiInstansi.id);
        formData.append('statusRegistrasiInstansi', 'Ditolak');

        startTransition(() => {
            formAction(formData);
        });
    }

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button size='icon-sm' variant="destructive">
                    {pending ? <Spinner /> : <BiX />}
                </Button>
            </AlertDialogTrigger>

            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle className='text-red-500'>Tolak Pendaftaran</AlertDialogTitle>
                    <AlertDialogDescription>
                        Apakah Anda yakin ingin menolak pendaftaran Instansi ini?
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <div className='p-4 border rounded-lg'>
                    <h3 className='font-semibold mb-3'>Informasi Instansi</h3>
                    <div className='grid grid-cols-2 gap-3 text-sm max-md:grid-cols-1'>
                        {sections.fields.map((field: any) => (
                            <div key={field.label}>
                                <p className='text-gray-500 text-xs'>{field.label}</p>
                                <p className='font-medium'>{field.value || '-'}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <AlertDialogFooter className='flex'>
                    <AlertDialogCancel>Tutup</AlertDialogCancel>
                    <AlertDialogAction onClick={onSubmit} variant='destructive'>
                        Tolak
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

function DialogDiterima({ registrasiInstansi }: { registrasiInstansi: any }) {
    const [state, formAction, pending] = useActionState(updateStatusRegistrasiInstansi, null);

    const sections = {
        title: 'Informasi',
        fields: [
            { label: 'Nama Instansi', value: registrasiInstansi.nama },
            { label: 'Tanggal Pendaftaran', value: format(new Date(registrasiInstansi.createdAt), 'EEEE, dd MMMM yyyy', { locale: id }) },
        ]
    }

    function onSubmit() {
        const formData = new FormData();
        formData.append('registrasiInstansiId', registrasiInstansi.id);
        formData.append('statusRegistrasiInstansi', 'Diterima');

        startTransition(() => {
            formAction(formData);
        })
    }

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button size='icon-sm'>
                    {pending ? <Spinner /> : <BiCheck />}
                </Button>
            </AlertDialogTrigger>

            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle className='text-primary'>Terima Pendaftaran</AlertDialogTitle>
                    <AlertDialogDescription>
                        Apakah Anda yakin ingin menerima pendaftaran Instansi ini?
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <div className='p-4 border rounded-lg'>
                    <h3 className='font-semibold mb-3'>Informasi Instansi</h3>
                    <div className='grid grid-cols-2 gap-3 text-sm max-md:grid-cols-1'>
                        {sections.fields.map((field: any) => (
                            <div key={field.label}>
                                <p className='text-gray-500 text-xs'>{field.label}</p>
                                <p className='font-medium'>{field.value || '-'}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <Alert className="max-w-md border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-50">
                    <AlertTriangleIcon />
                    <AlertTitle>Peringatan Terima Registrasi Akun Instansi</AlertTitle>
                    <AlertDescription>
                        Setelah Anda menerima registrasi akun instansi, penolakan tidak dapat dibatalkan. Akun tersebut akan langsung aktif dan dapat digunakan.
                    </AlertDescription>
                </Alert>


                <AlertDialogFooter>
                    <AlertDialogCancel>Tutup</AlertDialogCancel>
                    <AlertDialogAction onClick={onSubmit}>
                        Terima {pending && <Spinner />}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}