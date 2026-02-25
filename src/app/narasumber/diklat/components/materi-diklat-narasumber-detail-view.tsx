"use client"

import { upsertManyAbsensiPesertaDiklatFormAction } from '@/actions/absensi-peserta-diklat-action'
import { ContentCanvas } from '@/components/layouts/auth-layout'
import BackButton from '@/components/shared/back-button'
import GetStatusMateriDiklatBadge from '@/components/shared/get-status-materi-diklat-badge'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Separator } from '@/components/ui/separator'
import { Spinner } from '@/components/ui/spinner'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { formatDateId, formatDateTimeId } from '@/utils/dateFormatted'
import Link from 'next/link'
import { useActionState } from 'react'
import { BiBlock, BiCalendar, BiLink, BiLocationPlus, BiTime } from 'react-icons/bi'

export default function MateriDiklatNarasumberDetailView({
    materi,
    statusAbsensiPesertaDiklat,
    totalAbsensiStatus,
    isReadOnlyAbsensi = false,
    readOnlyMessage
}: {
    materi: any
    statusAbsensiPesertaDiklat: any
    totalAbsensiStatus: any
    isReadOnlyAbsensi?: boolean
    readOnlyMessage?: string
}) {
    const [state, formAction, pending] = useActionState(
        upsertManyAbsensiPesertaDiklatFormAction,
        null,
    )

    return (
        <ContentCanvas>
            <BackButton />

            <section className='space-y-6'>

                <Card className='bg-linear-to-br from-white to-primary/5'>
                    <CardHeader>
                        <GetStatusMateriDiklatBadge materi={materi} />
                        <h1 className='text-xl font-semibold'>{materi.judul}</h1>
                        <p className='text-sm text-slate-500'>
                            {materi.deskripsi ? materi.deskripsi : 'Tidak ada deskripsi yang diberikan untuk materi ini.'}
                        </p>
                    </CardHeader>
                    <CardContent>
                        <div className='text-sm grid grid-cols-3 max-lg:grid-cols-2 max-sm:grid-cols-1 gap-4'>
                            <div>
                                <h1 className='text-gray-500 flex gap-1 items-center flex-wrap'><BiCalendar /> Tanggal Pelaksanaan:</h1>
                                <h1 className='font-semibold'>{formatDateId(materi.tanggalPelaksanaan)}</h1>
                            </div>
                            <div>
                                <h1 className='text-gray-500 flex gap-1 items-center flex-wrap'><BiTime /> Waktu:</h1>
                                <h1 className='font-semibold'>{materi.waktuMulai} - {materi.waktuSelesai} WITA</h1>
                            </div>
                            <div>
                                <h1 className='text-gray-500 flex gap-1 items-center flex-wrap'><BiLocationPlus /> Lokasi:</h1>
                                <h1 className='font-semibold'>{materi.lokasi}</h1>
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter>
                        {
                            materi.linkMateri ?
                                <Link href={materi.linkMateri} target='_blank'>
                                    <Button size='sm' variant='outline'><BiLink /> Link Materi</Button>
                                </Link>
                                :
                                <Button size='sm' variant='outline' disabled><BiBlock /> Link Materi Kosong</Button>
                        }
                    </CardFooter>
                </Card>

                <Separator />

                <div className='grid grid-cols-3 max-lg:grid-cols-2 max-sm:grid-cols-1'>
                    <Card>
                        <CardHeader>
                            <CardTitle>Informasi Absensi</CardTitle>
                        </CardHeader>
                        <CardContent className='space-y-3'>
                            <div className='flex justify-between'>
                                <CardDescription>Hadir:</CardDescription>
                                <Badge>{totalAbsensiStatus.find((item: any) => item.statusAbsensiId === 1)?._count._all || 0}</Badge>
                            </div>
                            <div className='flex justify-between'>
                                <CardDescription>Tidak Hadir:</CardDescription>
                                <Badge variant='destructive'>{totalAbsensiStatus.find((item: any) => item.statusAbsensiId === 2)?._count._all || 0}</Badge>
                            </div>
                            <div className='flex justify-between'>
                                <CardDescription>Izin:</CardDescription>
                                <Badge className='bg-amber-500'>{totalAbsensiStatus.find((item: any) => item.statusAbsensiId === 3)?._count._all || 0}</Badge>
                            </div>
                            <div className='flex justify-between'>
                                <CardDescription>Sakit:</CardDescription>
                                <Badge className='bg-purple-500'>{totalAbsensiStatus.find((item: any) => item.statusAbsensiId === 4)?._count._all || 0}</Badge>
                            </div>
                        </CardContent>
                        <Separator />
                        <CardFooter className='flex justify-between'>
                            <CardDescription>Total Peserta:</CardDescription>
                            <Badge variant='secondary'>{materi.diklat.pesertaDiklat.length}</Badge>
                        </CardFooter>
                    </Card>
                </div>

                <div className='space-y-6 border p-4 rounded-xl'>
                    <form action={formAction} className='space-y-6'>
                        <input type='hidden' name='materiDiklatId' value={materi.id} />

                        <div>
                            <h2 className='font-semibold'>Absensi Peserta</h2>
                            <p className='text-sm text-slate-500'>
                                {isReadOnlyAbsensi
                                    ? (readOnlyMessage ?? 'Absensi tidak dapat diubah pada mode ini.')
                                    : 'Tentukan status kehadiran setiap peserta untuk sesi materi ini.'}
                            </p>
                        </div>

                        {
                            isReadOnlyAbsensi &&
                            <Alert>
                                <AlertTitle>Absensi Dinonaktifkan</AlertTitle>
                                <AlertDescription>
                                    {readOnlyMessage ?? 'Diklat sudah selesai, absensi hanya dapat dilihat.'}
                                </AlertDescription>
                            </Alert>
                        }

                        {
                            state?.message &&
                            <Alert variant={state.success ? 'default' : 'destructive'}>
                                <AlertTitle>Pesan</AlertTitle>
                                <AlertDescription>{state.message}</AlertDescription>
                            </Alert>
                        }

                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className='w-14'>No</TableHead>
                                    <TableHead>Nama Peserta</TableHead>
                                    <TableHead>Asal Instansi</TableHead>
                                    <TableHead>Waktu Absensi</TableHead>
                                    <TableHead>Status Absen</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {
                                    materi.diklat.pesertaDiklat.length > 0 ?
                                        materi.diklat.pesertaDiklat.map((pesertaDiklat: any, index: number) => (
                                            <TableRow key={index}>
                                                <TableCell>{index + 1}</TableCell>
                                                <TableCell>{pesertaDiklat.peserta.user.name}</TableCell>
                                                <TableCell>{pesertaDiklat.peserta.instansi.user.name}</TableCell>
                                                <TableCell>{pesertaDiklat.absensiPesertaDiklat[0]?.updatedAt ? formatDateTimeId(pesertaDiklat.absensiPesertaDiklat[0].updatedAt) : "-"}</TableCell>
                                                <TableCell>
                                                    <RadioGroup
                                                        name={`statusAbsensi-${pesertaDiklat.id}`}
                                                        defaultValue={
                                                            pesertaDiklat.absensiPesertaDiklat[0]?.statusAbsensiId
                                                                ? String(pesertaDiklat.absensiPesertaDiklat[0].statusAbsensiId)
                                                                : undefined
                                                        }
                                                        className='flex flex-wrap gap-4'
                                                        disabled={isReadOnlyAbsensi}
                                                    >
                                                        {
                                                            statusAbsensiPesertaDiklat.map((statusAbsensi: any) => {
                                                                const id = `status-${pesertaDiklat.id}-${statusAbsensi.id}`

                                                                return (
                                                                    <div key={id} className='flex items-center gap-2'>
                                                                        <RadioGroupItem
                                                                            value={String(statusAbsensi.id)}
                                                                            id={id}
                                                                        />
                                                                        <Label htmlFor={id}>{statusAbsensi.nama}</Label>
                                                                    </div>
                                                                )
                                                            })
                                                        }
                                                    </RadioGroup>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                        :
                                        <TableRow>
                                            <TableCell colSpan={99} className='text-center py-4'>
                                                Tidak ada peserta yang terdaftar pada materi diklat ini.
                                            </TableCell>
                                        </TableRow>
                                }
                            </TableBody>
                        </Table>

                        <div className='flex justify-end items-center gap-3 flex-wrap-reverse'>
                            <p className='text-sm text-gray-500'>Pastikan semua peserta diabsen agar tercatat sebagai sesi materi ini selesai.</p>
                            <Button disabled={pending || isReadOnlyAbsensi}>
                                Simpan Absensi {pending && <Spinner />}
                            </Button>
                        </div>
                    </form>
                </div>
            </section>
        </ContentCanvas>
    )
}
