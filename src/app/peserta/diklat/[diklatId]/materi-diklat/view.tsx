"use client"

import GetStatusMateriDiklatBadge from '@/components/shared/get-status-materi-diklat-badge'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { formatDateId } from '@/utils/dateFormatted'
import { getCurrentHourMinute } from '@/utils/getCurrentHourMinute'
import Link from 'next/link'
import { BiBlock, BiBookOpen, BiCalendar, BiLink, BiNetworkChart } from 'react-icons/bi'

export default function Peserta_DiklatMateriDiklat_View({
  diklatId,
  daftarMateriDiklat
}: {
  diklatId: string
  daftarMateriDiklat: any[]
}) {
  return (
    <>
      <div className='flex gap-3 flex-wrap'>
        <Button size='sm'>Materi Diklat</Button>
        <Link href={`/peserta/diklat/${diklatId}/hasil-akhir`}>
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
                      <GetStatusMateriDiklatBadge materi={materi}/>
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
                    <CardFooter className='grid grid-cols-3'>
                      <div className='text-sm'>
                        <h1>Status Absensi:</h1>
                        <h1>
                          {
                            materi.absensiPesertaDiklat[0] ?
                            <span className='font-semibold'>{materi.absensiPesertaDiklat[0].statusAbsensiPesertaDiklat.nama}</span>
                            :
                            <span className='font-semibold text-gray-400'>Belum Absen</span>
                          }
                        </h1>
                      </div>
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
