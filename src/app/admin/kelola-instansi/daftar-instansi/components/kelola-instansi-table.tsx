"use client"

import ActionDialog from '@/components/shared/dialog/action-dialog'
import { AlertDialogAction } from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { getRowNumber } from '@/utils/getRowNumber'
import Link from 'next/link'
import { BiBlock, BiCheck, BiEdit, BiInfoCircle } from 'react-icons/bi'

export default function KelolaInstansiTable({
    daftarInstansi,
    currentPage,
    formActionUpdateStatusUser
}: {
    daftarInstansi: any[]
    currentPage: number
    formActionUpdateStatusUser: (data: FormData) => void
}) {
    return (
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
                                        {/* Edit Action */}
                                        <Link href={`/admin/kelola-instansi/${instansi.id}/edit`}>
                                            <Button size='icon-sm'><BiEdit /></Button>
                                        </Link>
                                        {/* Nonaktifkan/Aktifkan User Action */}
                                        {
                                            instansi.user.banned
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
                                                            <Input type='hidden' name='banned' value="false" />
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
                                                            <Input type='hidden' name='banned' value="true" />
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
                                Tidak ada data instansi.
                            </TableCell>
                        </TableRow>
                    )
                }
            </TableBody>
        </Table>
    )
}
