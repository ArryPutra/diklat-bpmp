"use client"

import { ContentCanvas } from '@/components/layouts/auth-layout'
import BackButton from '@/components/shared/back-button'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Separator } from '@/components/ui/separator'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { formatDateId } from '@/utils/dateFormatted'
import { BiChevronDown, BiChevronUp } from 'react-icons/bi'

export default function Narasumber_KelolaMateriDiklatAktif_View({
    materiDiklat
}: {
    materiDiklat: any
}) {
    return (
        <ContentCanvas>
            <BackButton />

            <section className='space-y-6'>
                <div>
                    <Badge className='w-fit mb-2'>Materi Aktif</Badge>
                    <h1 className='text-xl font-semibold'>Detail Kelola Materi Diklat</h1>
                    <p className='text-sm text-slate-500'>
                        Halaman ini menampilkan informasi utama materi dan absensi peserta pada sesi yang sedang berjalan.
                    </p>
                </div>

                <div className='space-y-6'>
                    <details className='group rounded-md border p-4'>
                        <summary className='flex cursor-pointer list-none items-center justify-between font-semibold text-sm'>
                            <span>Informasi Materi (klik untuk melihat)</span>
                            <span>
                                <BiChevronDown className='text-lg group-open:hidden' />
                                <BiChevronUp className='hidden text-lg group-open:block' />
                            </span>
                        </summary>

                        <div className='mt-4 space-y-4'>
                            <div className='grid grid-cols-2 gap-4 text-sm max-md:grid-cols-1'>
                                <div className='rounded-md border p-4'>
                                    <h2 className='text-slate-500 mb-1'>Judul Materi</h2>
                                    <p className='font-semibold'>{materiDiklat.judul}</p>
                                </div>
                                <div className='rounded-md border p-4'>
                                    <h2 className='text-slate-500 mb-1'>Tanggal & Waktu</h2>
                                    <p className='font-semibold'>{formatDateId(materiDiklat.tanggalPelaksanaan)}, {materiDiklat.waktuMulai} - {materiDiklat.waktuSelesai}</p>
                                </div>
                            </div>

                            <div className='rounded-md border p-4 text-sm'>
                                <h2 className='font-semibold mb-2'>Deskripsi Materi</h2>
                                <p className='text-slate-600'>
                                    {materiDiklat.deskripsi ? materiDiklat.deskripsi : 'Tidak ada deskripsi yang diberikan untuk materi ini.'}
                                </p>
                            </div>
                        </div>
                    </details>

                    <Separator />

                    <div>
                        <h2 className='font-semibold'>Absensi Peserta</h2>
                        <p className='text-sm text-slate-500 mb-4'>
                            Tentukan status kehadiran setiap peserta untuk sesi materi ini.
                        </p>

                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className='w-14'>No</TableHead>
                                    <TableHead>Nama Peserta</TableHead>
                                    <TableHead>Asal Instansi</TableHead>
                                    <TableHead>Status Absen</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {
                                    materiDiklat.diklat.pesertaDiklat.map((pesertaDiklat: any, index: number) => (
                                        <TableRow>
                                            <TableCell>{index + 1}</TableCell>
                                            <TableCell>{pesertaDiklat.peserta.user.name}</TableCell>
                                            <TableCell>{pesertaDiklat.peserta.instansi.user.name}</TableCell>
                                            <TableCell>
                                                <RadioGroup className='flex flex-wrap gap-4'>
                                                    <div className='flex items-center gap-2'>
                                                        <RadioGroupItem value='hadir' id='p1-hadir' />
                                                        <Label htmlFor='p1-hadir'>Hadir</Label>
                                                    </div>
                                                    <div className='flex items-center gap-2'>
                                                        <RadioGroupItem value='tidak-hadir' id='p1-tidak-hadir' />
                                                        <Label htmlFor='p1-tidak-hadir'>Tidak Hadir</Label>
                                                    </div>
                                                    <div className='flex items-center gap-2'>
                                                        <RadioGroupItem value='izin' id='p1-izin' />
                                                        <Label htmlFor='p1-izin'>Izin</Label>
                                                    </div>
                                                    <div className='flex items-center gap-2'>
                                                        <RadioGroupItem value='sakit' id='p1-sakit' />
                                                        <Label htmlFor='p1-sakit'>Sakit</Label>
                                                    </div>
                                                </RadioGroup>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                }
                            </TableBody>
                        </Table>
                    </div>

                    <div className='flex justify-end gap-2'>
                        <Button>Simpan Absensi</Button>
                    </div>
                </div>
            </section>
        </ContentCanvas>
    )
}
