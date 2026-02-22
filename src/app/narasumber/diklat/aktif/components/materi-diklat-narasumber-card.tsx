"use client"

import GetStatusMateriDiklatBadge from '@/components/shared/get-status-materi-diklat-badge'
import LoadingScreen from '@/components/shared/loading-screen'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { formatDateId } from '@/utils/dateFormatted'
import { getStatusMateriDiklat } from '@/utils/getStatusMateriDiklat'
import { useRouter } from 'next/navigation'
import { useTransition } from 'react'
import { BiCalendar, BiRightArrowAlt, BiTime } from 'react-icons/bi'

export default function MateriDiklatNarasumberCard({
    materi,
    totalPeserta
}: {
    materi: any
    totalPeserta?: number
}) {

    const router = useRouter()
    const [isPending, startTransition] = useTransition()

    const isMateriSelesaiAndBelumAbsensi = totalPeserta !== undefined &&
        (getStatusMateriDiklat(materi) === "sudah-selesai") &&
        (totalPeserta > materi._count.absensiPesertaDiklat)

    return (
        <>
            <LoadingScreen isLoading={isPending} />
            <div key={materi.id} className='text-sm border p-4 rounded-md bg-linear-to-r from-white to-slate-50'>
                {
                    <GetStatusMateriDiklatBadge materi={materi} />
                }
                <h1 className='font-semibold text-base mt-2'>{materi.judul}</h1>
                <h1 className='mb-3 text-slate-500'>{materi.deskripsi}</h1>
                <div className='flex gap-1 mb-3 flex-col'>
                    <div className='flex items-center gap-2'>
                        <BiCalendar />
                        <h1 className='font-semibold'>
                            <span>{formatDateId(materi.tanggalPelaksanaan)}</span>
                        </h1>
                    </div>
                    <div className='flex items-center gap-2'>
                        <BiTime />
                        <h1 className='font-semibold'>
                            <span>{materi.waktuMulai}</span>
                            <span> - </span>
                            <span>{materi.waktuSelesai}</span>
                        </h1>
                    </div>
                </div>

                <Button size='sm' variant='outline'
                    onClick={() => {
                        startTransition(() => {
                            router.push(`/narasumber/diklat/aktif/${materi.id}`)
                        })
                    }}>
                    Detail Materi <BiRightArrowAlt />
                </Button>

                {
                    isMateriSelesaiAndBelumAbsensi &&
                    <Alert variant='danger' className='mt-4'>
                        <AlertTitle>Lakukan Absensi</AlertTitle>
                        <AlertDescription>Sesi materi sudah selesai, silahkan lakukan absensi pada semua peserta.</AlertDescription>
                    </Alert>
                }
            </div>
        </>
    )
}