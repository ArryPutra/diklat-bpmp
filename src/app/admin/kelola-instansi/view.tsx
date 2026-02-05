"use client"

import { updateStatusApakahNonaktifAction } from '@/actions/user-action'
import { ContentCanvas } from '@/components/layouts/auth-layout'
import ActionDialog from '@/components/shared/dialog/action-dialog'
import LoadingScreen from '@/components/shared/loading-screen'
import { PaginationWithLinks } from '@/components/shared/pagination-with-links'
import Search from '@/components/shared/search'
import SelectDropdown from '@/components/shared/select-dropdown'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertDialogAction } from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { getRowNumber } from '@/utils/getRowNumber'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
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

    const [stateUpdateStatusUserAction, formActionUpdateStatusUser, pendingUpdateStatusUser] =
        useActionState(updateStatusApakahNonaktifAction, null);

    const params = new URLSearchParams(useSearchParams().toString());

    const currentPage = parseInt(params.get("page") ?? "1");
    const newMessage = stateUpdateStatusUserAction?.message;

    return (
        <ContentCanvas>

            <LoadingScreen isLoading={pendingUpdateStatusUser} />

            <div className='flex gap-3 flex-wrap items-end justify-between mb-6'>
                {/* Select Status Akun */}
                <SelectDropdown
                    label='Status Akun'
                    query={{
                        name: "apakahNonaktif",
                        values: [
                            { label: "Aktif", value: "false" },
                            { label: "Nonaktif", value: "true" }
                        ],
                        defaultValue: "false"
                    }} />
                {/* Search */}
                <Search
                    name='search' />
            </div>

            {
                newMessage &&
                <Alert className='mb-4'>
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
                        <TableHead>Aksi</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {
                        daftarInstansi.length !== 0 ? (
                            daftarInstansi.map((instansi: any, index: number) => (
                                <TableRow key={index}>
                                    <TableCell>{getRowNumber(index, currentPage, 10)}</TableCell>
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
                                    <TableCell>
                                        <div className='flex gap-2'>
                                            {/* Info Action */}
                                            <Link href={`/admin/kelola-instansi/${instansi.id}`}>
                                                <Button size='icon-sm' variant='outline'><BiInfoCircle /></Button>
                                            </Link>
                                            {/* Nonaktifkan/Aktifkan User Action */}
                                            {
                                                instansi.user.apakahNonaktif
                                                    ? <ActionDialog
                                                        triggerButton={
                                                            <Button size='icon-sm'>
                                                                <BiCheck />
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
                                                            <form action={formActionUpdateStatusUser}>
                                                                <Input type='hidden' name='userId' value={instansi.user.id} />
                                                                <Input type='hidden' name='apakahNonaktif' value="false" />
                                                                <Input type='hidden' name='currentPath' value={"/admin/instansi"} />

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
                                                            <form action={formActionUpdateStatusUser}>
                                                                <Input type='hidden' name='userId' value={instansi.user.id} />
                                                                <Input type='hidden' name='apakahNonaktif' value="true" />
                                                                <Input type='hidden' name='currentPath' value={"/admin/instansi"} />

                                                                <AlertDialogAction
                                                                    variant='destructive'
                                                                    type='submit'>
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
                <div className='mt-6'>
                    <PaginationWithLinks
                        page={currentPage}
                        pageSize={10}
                        totalCount={totalDaftarInstansi} />
                </div>
            }
        </ContentCanvas>
    )
}