"use client"

import StatsCard from '@/components/shared/cards/stats-card'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { BiBookReader, BiBuilding, BiCheckDouble, BiRightArrowAlt, BiUser, BiUserVoice } from 'react-icons/bi'

export default function Admin_Dashboard_View({
    dataStatistik,
    totalVerifikasiInstansi,
    totalVerifikasiPesertaDiklat
}: {
    dataStatistik: any
    totalVerifikasiInstansi: number
    totalVerifikasiPesertaDiklat: number
}) {
    return (
        <>
            {
                totalVerifikasiInstansi > 0 &&
                <Alert variant='danger'>
                    <BiCheckDouble />
                    <AlertTitle>Lakukan verifikasi instansi</AlertTitle>
                    <AlertDescription className='mb-2'>Silahkan lakukan verifikasi instansi segera, terdapat {totalVerifikasiInstansi} instansi menunggu verifikasi.</AlertDescription>
                    <Link className='ml-7' href="/admin/kelola-instansi/verifikasi-instansi">
                        <Button size='sm' className='ml-auto' variant='outline'>Verifikasi Sekarang <BiRightArrowAlt /></Button>
                    </Link>
                </Alert>
            }
            {totalVerifikasiPesertaDiklat > 0 &&
                <Alert variant='danger'>
                    <BiCheckDouble />
                    <AlertTitle>Lakukan verifikasi peserta diklat</AlertTitle>
                    <AlertDescription className='mb-2'>Silahkan lakukan verifikasi peserta diklat segera, terdapat {totalVerifikasiPesertaDiklat} peserta diklat menunggu verifikasi.</AlertDescription>
                    <Link className='ml-7' href="/admin/verifikasi-peserta-diklat">
                        <Button size='sm' className='ml-auto' variant='outline'>Verifikasi Sekarang <BiRightArrowAlt /></Button>
                    </Link>
                </Alert>
            }

            <div className='grid grid-cols-3 gap-3 max-lg:grid-cols-2 max-md:grid-cols-1 mb-6'>
                <StatsCard
                    label='Total Diklat'
                    value={dataStatistik.totalDiklat.toString()}
                    icon={<BiBookReader />} />
                <StatsCard
                    label='Total Instansi'
                    value={dataStatistik.totalInstansi.toString()}
                    icon={<BiBuilding />} />
                <StatsCard
                    label='Total Peserta'
                    value={dataStatistik.totalPeserta.toString()}
                    icon={<BiUser />} />
                <StatsCard
                    label='Total Narasumber'
                    value={dataStatistik.totalNarasumber.toString()}
                    icon={<BiUserVoice />} />
            </div>
        </>
    )
}
