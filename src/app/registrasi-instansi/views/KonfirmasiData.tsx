import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import Instansi from '@/models/RegistrasiInstansi'
import PicInstansi from '@/models/RegistrasiPicInstansi'
import React from 'react'
import { BiLeftArrowAlt } from 'react-icons/bi'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

export default function KonfirmasiData({
    dataPic,
    dataInstansi,
    onBackStep,
    onSubmit,
    message,
    loading
}: {
    dataPic: PicInstansi,
    dataInstansi: Instansi,
    onBackStep: () => void,
    onSubmit: () => void,
    message: string,
    loading: boolean
}) {

    const dataPicTable = [
        { label: "Nama PIC", value: dataPic.nama },
        { label: "Email", value: dataPic.email },
        { label: "Nomor Telepon", value: dataPic.nomorTelepon },
        { label: "Jabatan", value: dataPic.jabatan }
    ]

    const dataInstansiTable = [
        { label: "Nama Instansi", value: dataInstansi.nama },
        { label: "Email", value: dataInstansi.email },
        { label: "Nomor Telepon", value: dataInstansi.nomorTelepon },
        { label: "Desa/Kelurahan", value: dataInstansi.desaKelurahan },
        { label: "Kecamatan", value: dataInstansi.kecamatan },
        { label: "Kabupaten/Kota", value: dataInstansi.kabupatenKota },
        { label: "Password", value: dataInstansi.password },
        { label: "Alamat Instansi", value: dataInstansi.alamat },
    ]

    return (
        <>
            <h1 className='font-semibold gradient-text animate-fade-in-up'>Silahkan Tinjau Kembali Data Anda</h1>
            <p className='mb-12 text-sm text-gray-500 animate-fade-in-up delay-100'>Sebelum melakukan pengiriman/submit, pastikan data instansi yang Anda masukkan sudah benar.</p>

            <h1 className='mb-3 text-sm font-semibold animate-fade-in-up delay-200'>Data PIC</h1>
            <Table className='mb-8 -mx-2 animate-fade-in-up delay-200'>
                <TableBody>
                    {
                        dataPicTable.map((data, index) => (
                            <TableRow key={index} className='hover:bg-primary/5 transition-colors'>
                                <TableCell>{data.label}</TableCell>
                                <TableHead>: {data.value}</TableHead>
                            </TableRow>
                        ))
                    }
                </TableBody>
            </Table>

            <h1 className='mb-3 text-sm font-semibold animate-fade-in-up delay-300'>Data Instansi</h1>
            <Table className='mb-6 -mx-2 animate-fade-in-up delay-300'>
                <TableBody>
                    {
                        dataInstansiTable.map((data, index) => (
                            <TableRow key={index} className='hover:bg-primary/5 transition-colors'>
                                <TableCell>{data.label}</TableCell>
                                <TableHead>: {data.value}</TableHead>
                            </TableRow>
                        ))
                    }
                </TableBody>
            </Table>

            {
                message &&
                <Alert variant='destructive' className='mb-6 animate-fade-in-up'>
                    <AlertTitle>Pesan Kesalahan</AlertTitle>
                    <AlertDescription>{message}</AlertDescription>
                </Alert>
            }

            <div className='flex animate-fade-in-up delay-400'>
                <Button className='w-fit hover-lift' variant='secondary' onClick={onBackStep}>
                    <BiLeftArrowAlt /> Kembali
                </Button>
                <Button
                    className='w-fit ml-auto hover-lift'
                    onClick={onSubmit}
                    variant={loading ? 'secondary' : 'default'}
                    disabled={loading}>
                    {loading ? 'Sedang Kirim...' : 'Kirim Data'}
                </Button>
            </div>
        </>
    )
}
