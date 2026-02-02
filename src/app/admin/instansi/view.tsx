"use client"

import { aktifkanUserAction, nonaktifkanUserAction } from '@/actions/user-action'
import { ContentCanvas } from '@/components/layouts/auth-layout'
import ActionDialog from '@/components/shared/dialog/action-dialog'
import InfoDialog from '@/components/shared/dialog/info-dialog'
import { PaginationWithLinks } from '@/components/shared/pagination-with-links'
import Search from '@/components/shared/search'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertDialogAction } from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Field, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Spinner } from '@/components/ui/spinner'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useRouter, useSearchParams } from 'next/navigation'
import { useActionState } from 'react'
import { BiBlock, BiCheck, BiInfoCircle } from 'react-icons/bi'

type AdminInstansiViewProps = {
    daftarInstansi: any[]
    totalDaftarInstansi: number
}

export default function AdminInstansiView({
    daftarInstansi,
    totalDaftarInstansi
}: AdminInstansiViewProps) {

    const [stateNonaktifkanUserAction, nonaktifkanUserFormAction, pendingNonaktifkanUserFormAction] =
        useActionState(nonaktifkanUserAction, null);
    const [stateAktifkanUserAction, aktifkanUserFormAction, pendingAktifkanUserFormAction] =
        useActionState(aktifkanUserAction, null);

    const router = useRouter();
    const searchParams = useSearchParams();
    const params = new URLSearchParams(searchParams.toString());

    function onChangeApakahNonaktifUser(value: "false" | "true") {
        params.set("apakahNonaktif", value)

        router.push(`?${params}`)
    }

    function onSearch(formData: FormData) {
        const search = formData.get('search')?.toString() ?? "";

        if (search) {
            params.set("search", search);
        } else {
            params.delete("search");
        }

        router.push(`?${params.toString()}`);
    }

    const currentPage = parseInt(params.get("page") ?? "1");
    const newMessage =
        stateNonaktifkanUserAction?.message ?? stateAktifkanUserAction?.message;

    return (
        <ContentCanvas>
            <div className='flex gap-3 flex-wrap items-end justify-between mb-6'>
                {/* Select Status Akun */}
                <Field className='w-fit'>
                    <FieldLabel>Status Akun</FieldLabel>
                    <Select defaultValue={searchParams.get("apakahNonaktif") ?? "false"} onValueChange={onChangeApakahNonaktifUser}>
                        <SelectTrigger>
                            <SelectValue placeholder="Pilih Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectItem value="false">Aktif</SelectItem>
                                <SelectItem value="true">Tidak Aktif</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </Field>
                {/* Search */}
                <Search
                    name='search'
                    defaultValue={params.get("search") ?? ""}
                    formAction={onSearch} />
            </div>

            {
                newMessage &&
                <Alert variant='danger' className='mb-4'>
                    <BiInfoCircle />
                    <AlertTitle>Pesan:</AlertTitle>
                    <AlertDescription>
                        {newMessage}
                    </AlertDescription>
                </Alert>
            }

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>No</TableHead>
                        <TableHead>Instansi</TableHead>
                        <TableHead>PIC</TableHead>
                        <TableHead>Alamat</TableHead>
                        <TableHead>Aksi</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {
                        daftarInstansi.length !== 0 ? (
                            daftarInstansi.map((instansi: any, index: number) => (
                                <TableRow key={index}>
                                    <TableCell>{index + 1 + (currentPage - 1) * 10}</TableCell>
                                    <TableCell>
                                        <span className='font-semibold'>{instansi.user.name}</span>
                                        <br />
                                        <span>{instansi.user.email}</span>
                                        <br />
                                        <span className='text-gray-500'>{instansi.nomorTelepon}</span>
                                    </TableCell>
                                    <TableCell>
                                        <span className='font-semibold'>{instansi.picInstansi.nama}</span>
                                        <br />
                                        <span>{instansi.picInstansi.email}</span>
                                        <br />
                                        <span className='text-gray-500'>{instansi.picInstansi.nomorTelepon}</span>
                                    </TableCell>
                                    <TableCell>{instansi.alamat}</TableCell>
                                    <TableCell>
                                        <div className='flex gap-2'>
                                            {/* Info Action */}
                                            <InfoDialog
                                                triggerButton={
                                                    <Button variant='outline' size='icon-sm'>
                                                        <BiInfoCircle />
                                                    </Button>
                                                }
                                                title='Informasi Instansi'
                                                description={`Kode Tiket Registrasi: ${instansi.registrasiInstansiId}`}
                                                sections={[
                                                    {
                                                        title: "Instansi",
                                                        fields: [
                                                            { label: 'Nama Instansi', value: instansi.user.name },
                                                            { label: 'Email', value: instansi.user.email },
                                                            { label: 'Nomor Telepon', value: instansi.nomorTelepon },
                                                            { label: 'Desa/Kelurahan', value: instansi.desaKelurahan },
                                                            { label: 'Kecamatan', value: instansi.kecamatan },
                                                            { label: 'Kabupaten/Kota', value: instansi.kabupatenKota },
                                                            { label: 'Alamat', value: instansi.alamat }
                                                        ],
                                                    },
                                                    {
                                                        title: "Penanggung Jawab (PIC)",
                                                        fields: [
                                                            { label: 'Nama PIC', value: instansi.picInstansi.nama },
                                                            { label: 'Email PIC', value: instansi.picInstansi.email },
                                                            { label: 'Nomor Telepon', value: instansi.picInstansi.nomorTelepon },
                                                            { label: 'Jabatan', value: instansi.picInstansi.jabatan }
                                                        ]
                                                    }
                                                ]} />
                                            {/* Nonaktifkan/Aktifkan User Action */}
                                            {
                                                instansi.user.apakahNonaktif
                                                    ? <ActionDialog
                                                        triggerButton={
                                                            <Button size='icon-sm'>
                                                                {pendingAktifkanUserFormAction ? <Spinner /> : <BiCheck />}
                                                            </Button>
                                                        }
                                                        title='Aktifkan Instansi'
                                                        description='Apakah Anda yakin ingin mengaktifkan instansi ini?'
                                                        sections={[
                                                            {
                                                                title: "Informasi Instansi",
                                                                fields: [
                                                                    { label: 'Nama Instansi', value: instansi.user.name },
                                                                ]
                                                            }
                                                        ]}
                                                        actionButton={
                                                            <form action={aktifkanUserFormAction}>
                                                                <Input type='hidden' name='userId' value={instansi.user.id} />
                                                                <Input type='hidden' name='currentPath' value={"/admin/instansi"} />

                                                                <AlertDialogAction
                                                                    type='submit'
                                                                    disabled={pendingNonaktifkanUserFormAction}>
                                                                    Aktifkan
                                                                </AlertDialogAction>
                                                            </form>
                                                        } />
                                                    : <ActionDialog
                                                        triggerButton={
                                                            <Button variant='destructive' size='icon-sm'>
                                                                {pendingNonaktifkanUserFormAction ? <Spinner /> : <BiBlock />}
                                                            </Button>
                                                        }
                                                        title='Nonaktifkan Instansi'
                                                        description='Apakah Anda yakin ingin menonaktifkan instansi ini?'
                                                        sections={[
                                                            {
                                                                title: "Informasi Instansi",
                                                                fields: [
                                                                    { label: 'Nama Instansi', value: instansi.user.name },
                                                                ]
                                                            }
                                                        ]}
                                                        actionButton={
                                                            <form action={nonaktifkanUserFormAction}>
                                                                <Input type='hidden' name='userId' value={instansi.user.id} />
                                                                <Input type='hidden' name='currentPath' value={"/admin/instansi"} />

                                                                <AlertDialogAction
                                                                    variant='destructive'
                                                                    type='submit'
                                                                    disabled={pendingNonaktifkanUserFormAction}>
                                                                    Nonaktifkan
                                                                </AlertDialogAction>
                                                            </form>
                                                        } />
                                            }
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={4} className='text-center'>
                                    Tidak ada data registrasi instansi.
                                </TableCell>
                            </TableRow>
                        )
                    }
                </TableBody>
            </Table>

            {
                totalDaftarInstansi > 0 &&
                <div className='w-fit ml-auto'>
                    <PaginationWithLinks
                        page={currentPage}
                        pageSize={10}
                        totalCount={totalDaftarInstansi} />
                </div>
            }
        </ContentCanvas>
    )
}