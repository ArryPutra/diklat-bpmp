import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import React from 'react'
import { BiCheck, BiX } from 'react-icons/bi'

type AdminInstansiViewProps = {
    daftarRegistrasiInstansi: any[]
}

export default function AdminInstansiView({
    daftarRegistrasiInstansi
}: AdminInstansiViewProps) {

    console.log(daftarRegistrasiInstansi)

    return (
        <div className='p-6 bg-white border rounded-md'>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>No</TableHead>
                        <TableHead>Nama Instansi</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Aksi</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {
                        daftarRegistrasiInstansi.length !== 0 ? (
                            daftarRegistrasiInstansi.map((instansi: any, index: number) => (
                                <TableRow key={index}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell className='font-semibold'>{instansi.nama}</TableCell>
                                    <TableCell>{instansi.email}</TableCell>
                                    <TableCell>
                                        <div className='flex gap-2'>
                                            <Button size='icon'>
                                                <BiCheck />
                                            </Button>
                                            <Button variant='destructive' size='icon'>
                                                <BiX />
                                            </Button>
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
        </div>
    )
}
