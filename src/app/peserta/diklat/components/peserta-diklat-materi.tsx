"use client"

import { submitAbsensiPesertaByKodeUnikFormAction } from '@/actions/absensi-peserta-diklat-action'
import GetStatusMateriDiklatBadge from '@/components/shared/get-status-materi-diklat-badge'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Spinner } from '@/components/ui/spinner'
import { formatDateId, formatDateTimeId } from '@/utils/dateFormatted'
import Link from 'next/link'
import { useActionState } from 'react'
import { BiBlock, BiBookOpen, BiCalendar, BiLink, BiNetworkChart } from 'react-icons/bi'

function SubmitAbsensiMateriForm({
    materiId,
    sudahAbsen,
}: {
    materiId: number
    sudahAbsen: boolean
}) {
    const [state, formAction, pending] = useActionState(
        submitAbsensiPesertaByKodeUnikFormAction,
        null,
    )

    return (
        <div className='space-y-3'>
            {
                state?.message &&
                <Alert variant={state.success ? 'default' : 'destructive'}>
                    <AlertTitle>Pesan</AlertTitle>
                    <AlertDescription>{state.message}</AlertDescription>
                </Alert>
            }

            <form action={formAction} className='flex flex-col md:flex-row gap-2'>
                <input type='hidden' name='materiDiklatId' value={materiId} />
                <Input
                    name='kodeUnikAbsensi'
                    placeholder='Masukkan kode absensi'
                    disabled={sudahAbsen || pending}
                    autoComplete='off'
                    maxLength={32}
                />
                <Button type='submit' disabled={sudahAbsen || pending}>
                    Submit Absensi {pending && <Spinner />}
                </Button>
            </form>
        </div>
    )
}

export default function PesertaDiklatMateriDiklat({
    diklatId,
    routeSegment = "aktif",
    daftarMateriDiklat
}: {
    diklatId: string
    routeSegment?: "aktif" | "riwayat"
    daftarMateriDiklat: any[]
}) {
    return (
        <>
            <div className='flex gap-3 flex-wrap'>
                <Button size='sm'>Materi Diklat</Button>
                <Link href={`/peserta/diklat/${routeSegment}/${diklatId}/hasil-akhir`}>
                    <Button size='sm' variant='outline'>Hasil Akhir</Button>
                </Link>
            </div>

            {
                daftarMateriDiklat.length > 0 ?
                    <div className='space-y-4'>
                        {
                            daftarMateriDiklat.map((materi: any, index: number) => {
                                return (
                                    <Card className='w-full bg-linear-to-br from-white to-blue-50 hover:border-primary/20' key={materi.id}>
                                        <CardHeader>
                                            <GetStatusMateriDiklatBadge materi={materi} />
                                            <CardTitle>{materi.judul}</CardTitle>
                                            <CardDescription>{materi.deskripsi}</CardDescription>
                                        </CardHeader>
                                        <CardContent className='grid grid-cols-2 max-md:grid-cols-1 gap-4'>
                                            <div className='text-sm'>
                                                <h1 className='flex gap-1 items-center text-gray-500 flex-wrap'><BiCalendar /> Tanggal Pelaksanaan:</h1>
                                                <h1 className='font-semibold'>{formatDateId(materi.tanggalPelaksanaan)}</h1>
                                            </div>
                                            <div className='text-sm'>
                                                <h1 className='flex gap-1 items-center text-gray-500 flex-wrap'><BiNetworkChart /> Waktu Pelaksanaan:</h1>
                                                <h1 className='font-semibold'>{materi.waktuMulai} - {materi.waktuSelesai}</h1>
                                            </div>
                                            {
                                                materi.linkMateri ?
                                                    <Link href={materi.linkMateri} target='_blank'>
                                                        <Button variant='outline' className='w-fit' size='sm'>
                                                            <BiLink /> Link Materi
                                                        </Button>
                                                    </Link> :
                                                    <Button variant='secondary' className='w-fit' size='sm' disabled>
                                                        <BiBlock /> Link Materi Kosong
                                                    </Button>
                                            }
                                        </CardContent>
                                        <Separator />
                                        <CardFooter className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                                            <div className='text-sm md:col-span-1'>
                                                <h1>Status Absensi:</h1>
                                                <h1>
                                                    {
                                                        materi.absensiPesertaDiklat[0] ?
                                                            <span><span className='font-semibold'>{materi.absensiPesertaDiklat[0].statusAbsensiPesertaDiklat.nama}</span> ({formatDateTimeId(materi.absensiPesertaDiklat[0].updatedAt)})</span>
                                                            :
                                                            <span className='font-semibold text-gray-400'>Belum Absen</span>
                                                    }
                                                </h1>
                                            </div>

                                            {
                                                routeSegment === 'aktif' &&
                                                <div className='md:col-span-2'>
                                                    <SubmitAbsensiMateriForm
                                                        materiId={materi.id}
                                                        sudahAbsen={Boolean(materi.absensiPesertaDiklat[0])}
                                                    />
                                                </div>
                                            }
                                        </CardFooter>
                                    </Card>
                                )
                            })
                        }
                    </div>
                    :
                    <div className='text-center py-10 border p-4 rounded-md bg-gray-50'>
                        <BiBookOpen className='mx-auto text-4xl text-gray-400' />
                        <h1 className='text-lg font-semibold mt-4'>Belum Ada Materi Diklat</h1>
                        <p className='text-gray-500 text-sm mt-1'>Materi diklat untuk diklat ini belum tersedia. Silakan cek kembali nanti.</p>
                    </div>
            }
        </>
    )
}
