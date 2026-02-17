"use client"

import LoadingScreen from '@/components/shared/loading-screen'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { dateRangeFormatted } from '@/utils/dateFormatted'
import { isTanggalPelaksanaanDiklatAktif } from '@/utils/isDiklatAktif'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useTransition } from 'react'
import { BiRightArrowAlt, BiTime } from 'react-icons/bi'

export default function Narasumber_DiklatSaya_View({
    daftarDiklatAktifSaya
}: {
    daftarDiklatAktifSaya: any[]
}) {

    const router = useRouter()
    const [isPending, startTransition] = useTransition()

    return (
        <>
            <LoadingScreen isLoading={isPending} />
            {
                daftarDiklatAktifSaya.length > 0 ?
                    daftarDiklatAktifSaya.map((diklat) => (
                        <Card key={diklat.id}>
                            <CardHeader>
                                {
                                    isTanggalPelaksanaanDiklatAktif(diklat.tanggalMulaiAcara, diklat.tanggalSelesaiAcara) ?
                                        <Badge>Aktif</Badge>
                                        :
                                        <Badge variant='destructive'>Tidak aktif</Badge>
                                }
                                <CardTitle className='text-lg'>{diklat.judul}</CardTitle>
                                <CardDescription className='mb-4'>{diklat.deskripsi}</CardDescription>

                                <div className='grid grid-cols-4 gap-3 max-lg:grid-cols-2 max-sm:grid-cols-1'>
                                    <div className='text-sm'>
                                        <h1>Tanggal Pelaksanaan:</h1>
                                        <h1 className='font-semibold'>{dateRangeFormatted(diklat.tanggalMulaiAcara, diklat.tanggalSelesaiAcara)}</h1>
                                    </div>
                                    <div className='text-sm'>
                                        <h1>Metode:</h1>
                                        <Badge className={`${diklat.metodeDiklat.backgroundColor}`}>{diklat.metodeDiklat.nama}</Badge>
                                    </div>
                                    <div className='text-sm'>
                                        <h1>Lokasi:</h1>
                                        <h1 className='font-semibold'>{diklat.lokasi}</h1>
                                    </div>
                                    <div className='text-sm'>
                                        <h1>Maksimal Kuota:</h1>
                                        <h1 className='font-semibold'>{diklat.maksimalKuota} Peserta</h1>
                                    </div>
                                </div>

                            </CardHeader>

                            <Separator />

                            <CardContent>
                                <CardTitle className='mb-1'>Daftar Materi Diklat yang Anda Ajarkan</CardTitle>
                                <CardDescription className='mb-6'>Materi Diklat ditemukan: {diklat.materiDiklat.length}</CardDescription>

                                {
                                    diklat.materiDiklat.map((materi: any) => (
                                        <div key={materi.id} className='text-sm border p-4 rounded-md bg-linear-to-r from-white to-slate-50'>
                                            {
                                                (materi.waktuMulai <= new Date().getHours() + ':' + new Date().getMinutes())
                                                &&
                                                (materi.waktuSelesai >= new Date().getHours() + ':' + new Date().getMinutes())
                                                    &&
                                                    new Date().setHours(0, 0, 0, 0) >= new Date(diklat.tanggalMulaiAcara).setHours(0, 0, 0, 0)
                                                    ?
                                                    <Badge className='mb-2'>
                                                        Aktif
                                                    </Badge>
                                                    :
                                                    <Badge className='mb-2' variant='destructive'>
                                                        Tidak aktif
                                                    </Badge>
                                            }
                                            <h1 className='font-semibold text-base'>{materi.judul}</h1>
                                            <h1 className='mb-3 text-slate-500'>{materi.deskripsi}</h1>
                                            <div className='flex gap-6 mb-3'>
                                                <div className='flex items-center gap-1'>
                                                    <BiTime />
                                                    <h1 className='font-semibold'>
                                                        <span>{materi.waktuMulai}</span>
                                                        <span> - </span>
                                                        <span>{materi.waktuSelesai}</span>
                                                    </h1>
                                                </div>
                                            </div>

                                            <Button size='sm'
                                                onClick={() => {
                                                    startTransition(() => {
                                                        router.push(`/narasumber/materi-diklat/aktif/${materi.id}`)
                                                    })
                                                }}>
                                                Kelola Materi <BiRightArrowAlt />
                                            </Button>
                                        </div>
                                    ))
                                }
                            </CardContent>

                            <Separator />

                            <CardFooter>
                                <Link href='/diklat/diklatId'>
                                    <Button>Detail Diklat</Button>
                                </Link>
                            </CardFooter>
                        </Card>
                    ))
                    :
                    <div className='text-center py-10'>
                        <h1 className='text-lg font-semibold'>Belum ada materi diklat aktif yang Anda ajarkan.</h1>
                        <p className='text-slate-500'>Materi diklat aktif adalah materi diklat yang tanggal pelaksanaannya hari ini atau di masa depan.</p>
                    </div>
            }
        </>
    )
}
