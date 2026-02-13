"use client"

import { updateStatusRegistrasiInstansiAction } from '@/actions/registrasi-instansi-action';
import { ContentCanvas } from '@/components/layouts/auth-layout';
import ActionDialog from '@/components/shared/dialog/action-dialog';
import InfoDialog from '@/components/shared/dialog/info-dialog';
import LoadingScreen from '@/components/shared/loading-screen';
import { PaginationWithLinks } from '@/components/shared/pagination-with-links';
import Search from '@/components/shared/search';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertDialogAction } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Field, FieldLabel } from '@/components/ui/field';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { format, formatDistanceToNow } from 'date-fns';
import { id } from 'date-fns/locale';
import { AlertTriangleIcon } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useActionState } from 'react';
import { BiCheck, BiInfoCircle, BiX } from 'react-icons/bi';

export default function VerifikasiRegistrasiInstansiCanvas({
    daftarRegistrasiInstansi,
    totalDaftarRegistrasiInstansi
}: {
    daftarRegistrasiInstansi: any[]
    totalDaftarRegistrasiInstansi: number
}) {
    const [stateUpdateStatusRegistrasiInstansi, formActionUpdateStatusRegistrasiInstansi, pendingUpdateStatusRegistrasiInstansi] =
        useActionState(updateStatusRegistrasiInstansiAction, null);

    const router = useRouter();
    const params = new URLSearchParams(useSearchParams().toString());

    const currentPage = parseInt(params.get("page") ?? "1");

    function onSearch(formData: FormData) {
        const search = formData.get('search')?.toString() ?? "";

        if (search) {
            params.set("search", search);
        } else {
            params.delete("search");
        }

        router.push(`?${params.toString()}`);
    }

    function onChangeStatus(value: string) {
        params.set("status", value);

        router.push(`?${params.toString()}`);
    }

    return (
        <ContentCanvas>

            <LoadingScreen isLoading={pendingUpdateStatusRegistrasiInstansi} />

            <div className='flex justify-between flex-wrap mb-4 gap-3'>
                <div>
                    <h1 className='font-bold'>Pendaftaran Instansi Terbaru</h1>
                    <p className='text-sm'>Pendaftaran instansi yang perlu ditinjau</p>
                </div>
            </div>

            <div className='flex items-end justify-between gap-3 mb-4 flex-wrap'>
                <Field className='w-fit'>
                    <FieldLabel>
                        Status
                    </FieldLabel>
                    <Select
                        defaultValue={params.get("status") ?? "1"}
                        onValueChange={onChangeStatus}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select page size" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectItem value='1'>Diajukan</SelectItem>
                                <SelectItem value='2'>Diterima</SelectItem>
                                <SelectItem value='3'>Ditolak</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </Field>

                <Search />
            </div>

            {
                stateUpdateStatusRegistrasiInstansi &&
                <Alert className='mb-4'>
                    <BiInfoCircle />
                    <AlertTitle>Pesan:</AlertTitle>
                    <AlertDescription>
                        {stateUpdateStatusRegistrasiInstansi?.message}
                    </AlertDescription>
                </Alert>
            }

            <Table className='max-w-full mb-6'>
                <TableHeader>
                    <TableRow>
                        <TableHead>No</TableHead>
                        <TableHead>Instansi</TableHead>
                        <TableHead>PIC</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Daerah</TableHead>
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
                                    <TableCell>{index + 1 + (currentPage - 1) * 10}</TableCell>
                                    <TableCell>
                                        <span className='font-semibold'>{item.nama}</span>
                                        <br />
                                        <span>{item.nomorTelepon}</span>
                                        <br />
                                        <span>{item.email}</span>
                                    </TableCell>
                                    <TableCell>
                                        <span className='font-semibold'>{item.registrasiPicInstansi.nama}</span>
                                        <br />
                                        <span>{item.registrasiPicInstansi.nomorTelepon}</span>
                                        <br />
                                        <span>{item.registrasiPicInstansi.email}</span>
                                    </TableCell>
                                    <TableCell>
                                        <span className={`${item.statusRegistrasiInstansi.backgroundColor} px-4 py-2 rounded-full text-white text-xs font-semibold`}>
                                            {item.statusRegistrasiInstansi.nama}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        <span className='font-semibold'>{item.kabupatenKota}</span>
                                        <br />
                                        <span>{item.kecamatan}</span>
                                        <br />
                                        <span>{item.desaKelurahan}</span>
                                    </TableCell>
                                    <TableCell>
                                        {
                                            formatDistanceToNow(new Date(item.createdAt), {
                                                locale: id
                                            })
                                        }
                                    </TableCell>
                                    <TableCell className='space-x-2'>
                                        <InfoDialog
                                            title='Informasi Registrasi Instansi'
                                            description={`Kode Tiket Registerasi: ${item.id}`}
                                            sections={
                                                [
                                                    {
                                                        title: 'Informasi Instansi',
                                                        fields: [
                                                            { label: 'Nama Instansi', value: item.nama },
                                                            { label: 'Email', value: item.email },
                                                            { label: 'Nomor Telepon', value: item.nomorTelepon },
                                                            { label: 'Desa/Kelurahan', value: item.desaKelurahan },
                                                            { label: 'Kecamatan', value: item.kecamatan },
                                                            { label: 'Kabupaten/Kota', value: item.kabupatenKota },
                                                            { label: 'Alamat', value: item.alamat }
                                                        ]
                                                    },
                                                    {
                                                        title: 'Informasi Penanggung Jawab (PIC)',
                                                        fields: [
                                                            { label: 'Nama PIC', value: item.registrasiPicInstansi.nama },
                                                            { label: 'Email PIC', value: item.registrasiPicInstansi.email },
                                                            { label: 'Nomor Telepon', value: item.registrasiPicInstansi.nomorTelepon },
                                                            { label: 'Jabatan', value: item.registrasiPicInstansi.jabatan }
                                                        ]
                                                    },
                                                    {
                                                        title: 'Status Pendaftaran',
                                                        fields: [
                                                            { label: 'Status', value: item.statusRegistrasiInstansi.nama },
                                                            { label: 'Tanggal Pendaftaran', value: format(new Date(item.createdAt), 'EEEE, dd MMMM yyyy', { locale: id }) }
                                                        ]
                                                    }
                                                ]
                                            } />
                                        {
                                            item.statusRegistrasiInstansiId === 1 &&
                                            <ActionDialog
                                                title='Tolak Pendaftaran'
                                                description='Apakah Anda yakin ingin menolak pendaftaran instansi ini?'
                                                sections={[
                                                    {
                                                        title: 'Informasi',
                                                        fields: [
                                                            { label: 'Nama Instansi', value: item.nama },
                                                        ]
                                                    }
                                                ]}
                                                triggerButton={<Button variant='destructive' size='icon-sm'><BiX /></Button>}
                                                actionButton={
                                                    <form action={formActionUpdateStatusRegistrasiInstansi}>
                                                        <input type="hidden" name="registrasiInstansiId" value={item.id} />
                                                        <input type="hidden" name="statusRegistrasiInstansi" value="Ditolak" />

                                                        <AlertDialogAction type='submit' variant='destructive'>
                                                            Tolak Pendaftaran
                                                        </AlertDialogAction>
                                                    </form>
                                                } />
                                        }
                                        {
                                            item.statusRegistrasiInstansiId !== 2 &&
                                            <ActionDialog
                                                title='Terima Pendaftaran'
                                                description='Apakah Anda yakin ingin menerima pendaftaran instansi ini?'
                                                sections={[
                                                    {
                                                        title: 'Informasi',
                                                        fields: [
                                                            { label: 'Nama Instansi', value: item.nama },
                                                        ]
                                                    }
                                                ]}
                                                triggerButton={<Button size='icon-sm'><BiCheck /></Button>}
                                                actionButton={
                                                    <form action={formActionUpdateStatusRegistrasiInstansi}>
                                                        <input type="hidden" name="registrasiInstansiId" value={item.id} />
                                                        <input type="hidden" name="statusRegistrasiInstansi" value="Diterima" />

                                                        <AlertDialogAction type='submit'>
                                                            Terima Pendaftaran
                                                        </AlertDialogAction>
                                                    </form>
                                                }
                                                content={
                                                    <Alert variant='danger'>
                                                        <AlertTriangleIcon />
                                                        <AlertTitle>Perhatian!</AlertTitle>
                                                        <AlertDescription>
                                                            Dengan melakukan aksi ini, instansi akan terdaftar sebagai akun dan dapat melakukan login. Proses ini tidak dapat dibatalkan.
                                                        </AlertDescription>
                                                    </Alert>
                                                } />
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

            {
                totalDaftarRegistrasiInstansi > 0 &&
                <PaginationWithLinks
                    page={currentPage}
                    pageSize={10}
                    totalCount={totalDaftarRegistrasiInstansi} />
            }
        </ContentCanvas>
    )
}