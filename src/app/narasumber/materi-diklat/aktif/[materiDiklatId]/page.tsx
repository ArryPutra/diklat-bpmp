"use server"

import { isDiklatAcaraAktifByDiklatIdAction } from "@/actions/diklat-action";
import { getCurrentNarasumber } from "@/actions/narasumber-action";
import { ContentCanvas } from "@/components/layouts/auth-layout";
import BackButton from "@/components/shared/back-button";
import { Badge } from "@/components/ui/badge";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import Narasumber_KelolaMateriDiklatAktif_View from "./view";

export default async function Narasumber_KelolaMateriDiklatAktif_Page({
  params
}: {
  params: Promise<{
    materiDiklatId: string
  }>
}) {

  const _params = await params
  const currentNarasumber = await getCurrentNarasumber()

  // pastikan materi diklat adalah milik narasumber
  const materiDiklat = await prisma.materiDiklat.findFirstOrThrow({
    where: {
      id: Number(_params.materiDiklatId),
      narasumberId: currentNarasumber?.id
    },
    include: {
      diklat: {
        include: {
          pesertaDiklat: {
            select: {
              peserta: {
                select: {
                  instansi: {
                    select: {
                      user: {
                        select: {
                          name: true
                        }
                      }
                    }
                  },
                  user: {
                    select: {
                      name: true
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  })

  const diklat = materiDiklat.diklat ?? notFound() // pastikan diklat ada, jika tidak ada tampilkan halaman not found

  const apakahDiklatAktif = await isDiklatAcaraAktifByDiklatIdAction(diklat.id); // Ganti dengan logika sebenarnya untuk memeriksa status diklat

  console.log(materiDiklat.diklat.pesertaDiklat)

  if (apakahDiklatAktif) {
    return (
      <Narasumber_KelolaMateriDiklatAktif_View
      materiDiklat={materiDiklat} />
    )
  }

  return (
    <ContentCanvas>
      <BackButton />
      <div className='space-y-6'>
        {/* Informasi Materi */}
        <div className='rounded-lg border bg-white p-4'>
          <div className='space-y-3'>
            <div>
              <p className='text-xs text-slate-500 uppercase tracking-wide'>Nama Diklat</p>
              <p className='font-semibold text-slate-900'>{diklat.judul}</p>
            </div>
            <div>
              <p className='text-xs text-slate-500 uppercase tracking-wide'>Judul Materi</p>
              <p className='font-semibold text-slate-900'>{materiDiklat.judul}</p>
            </div>
            <div>
              <p className='text-xs text-slate-500 uppercase tracking-wide'>Deskripsi Materi</p>
              <p className='text-sm text-slate-700'>{materiDiklat.deskripsi}</p>
            </div>
            <div className='grid grid-cols-2 gap-3 pt-2'>
              <div>
                <p className='text-xs text-slate-500 uppercase tracking-wide'>Tanggal Pelaksanaan</p>
                <p className='text-sm font-medium'>{new Date(materiDiklat.tanggalPelaksanaan).toLocaleDateString('id-ID')}</p>
              </div>
              <div>
                <p className='text-xs text-slate-500 uppercase tracking-wide'>Waktu</p>
                <p className='text-sm font-medium'>{materiDiklat.waktuMulai} - {materiDiklat.waktuSelesai}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Pesan Tidak Aktif */}
        <div className='space-y-4'>
          <Badge className='w-fit mb-2'>Materi Tidak Aktif</Badge>
          <h1 className='text-xl font-semibold'>Materi Diklat Belum Aktif</h1>
          <p className='text-sm text-slate-500'>
            Materi diklat tidak dapat diakses ketika status diklat belum aktif. Silakan tunggu hingga diklat aktif, atau kembali ke halaman sebelumnya untuk melihat materi diklat lain yang sudah aktif.
          </p>
        </div>
      </div>
    </ContentCanvas>
  )
}
