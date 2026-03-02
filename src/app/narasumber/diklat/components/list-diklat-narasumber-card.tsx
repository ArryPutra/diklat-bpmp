"use client"

import InfoDiklatCard from '@/components/shared/cards/info-diklat-card'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import Link from 'next/link'
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
                                <InfoDiklatCard diklat={diklat} />
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
