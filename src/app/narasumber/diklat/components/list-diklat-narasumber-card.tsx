"use client"

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { dateRangeFormatted } from '@/utils/dateFormatted'
import Link from 'next/link'
import { BiCalendar, BiCategory, BiLocationPlus, BiSolidGraduation } from 'react-icons/bi'
import MateriDiklatNarasumberCard from './materi-diklat-narasumber-card'

export default function ListDiklatNarasumberCard({
    daftarDiklatSaya,
    title,
    description,
    emptyTitle,
    emptyDescription,
    detailBasePath = '/narasumber/diklat/aktif'
}: {
    daftarDiklatSaya: any[]
    title: string
    description: string
    emptyTitle: string
    emptyDescription: string
    detailBasePath?: string
}) {
    return (
        <>
            <div>
                <h1 className='text-lg font-semibold'>{title}</h1>
                <h1 className='text-gray-500 text-sm'>{description}</h1>
            </div>
            {
                daftarDiklatSaya.length > 0 ?
                    daftarDiklatSaya.map((diklat) => (
                        <Card key={diklat.id}>
                            <CardHeader>
                                {
                                    <Badge className={`${diklat.statusPelaksanaanAcaraDiklat.backgroundColor}`}>
                                        {diklat.statusPelaksanaanAcaraDiklat.nama}
                                    </Badge>
                                }
                                <CardTitle className='text-lg'>{diklat.judul}</CardTitle>
                                <CardDescription className='mb-4'>{diklat.deskripsi}</CardDescription>

                                <div className='grid grid-cols-4 gap-3 max-lg:grid-cols-2 max-sm:grid-cols-1'>
                                    <div className='text-sm'>
                                        <h1 className='flex flex-wrap gap-1 items-center'><BiCalendar /> Tanggal Pelaksanaan:</h1>
                                        <h1 className='font-semibold'>{dateRangeFormatted(diklat.tanggalMulaiAcara, diklat.tanggalSelesaiAcara)}</h1>
                                    </div>
                                    <div className='text-sm'>
                                        <h1 className='flex flex-wrap gap-1 items-center'><BiCategory /> Metode:</h1>
                                        <Badge className={`${diklat.metodeDiklat.backgroundColor}`}>{diklat.metodeDiklat.nama}</Badge>
                                    </div>
                                    <div className='text-sm'>
                                        <h1 className='flex flex-wrap gap-1 items-center'><BiLocationPlus /> Lokasi:</h1>
                                        <h1 className='font-semibold'>{diklat.lokasi}</h1>
                                    </div>
                                    <div className='text-sm'>
                                        <h1 className='flex gap-1 items-center text-gray-500 flex-wrap'><BiSolidGraduation /> Syarat Kelulusan:</h1>
                                        <h1 className="font-semibold">Kehadiran {diklat.minimalKehadiranPersen.toString()}%
                                            atau {Math.ceil(
                                                diklat.materiDiklat.length * (diklat.minimalKehadiranPersen / 100)
                                            )} kehadiran
                                        </h1>
                                    </div>
                                </div>

                            </CardHeader>

                            <Separator />

                            <CardContent>
                                <CardTitle className='mb-1'>Daftar Materi Diklat yang Anda Ajarkan</CardTitle>
                                <CardDescription className='mb-6'>Materi Diklat ditemukan: {diklat.materiDiklat.length}</CardDescription>

                                <div className='space-y-4'>
                                    {
                                        diklat.materiDiklat.map((materi: any) => (
                                            <MateriDiklatNarasumberCard
                                                key={materi.id}
                                                materi={materi}
                                                totalPeserta={diklat._count.pesertaDiklat}
                                                detailBasePath={detailBasePath} />
                                        ))
                                    }
                                </div>
                                <p className='text-sm text-gray-500 mt-4'>Hanya menampilkan daftar materi diklat yang akan Anda ajarkan.</p>
                            </CardContent>

                            <Separator />

                            <CardFooter>
                                <Link href={`/diklat/${diklat.id}`} target='_blank'>
                                    <Button>Detail Diklat</Button>
                                </Link>
                            </CardFooter>
                        </Card >
                    ))
                    :
                    <div className='text-center py-10'>
                        <h1 className='text-lg font-semibold'>{emptyTitle}</h1>
                        <p className='text-slate-500'>{emptyDescription}</p>
                    </div>
            }
        </>
    )
}
