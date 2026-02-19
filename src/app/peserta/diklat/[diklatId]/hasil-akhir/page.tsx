"use server"

import { getCurrentPeserta } from '@/actions/peserta-action'
import prisma from '@/lib/prisma'
import Peserta_DiklatHasilAkhir_View from './view'

export default async function Peserta_DiklatHasilAkhir_Page({
    params
}: {
    params: Promise<{
        diklatId: string
    }>
}) {

    const _params = await params

    const currentPeserta = await getCurrentPeserta()

    const pesertaDiklat = currentPeserta?.id
        ? await prisma.pesertaDiklat.findUnique({
            where: {
                diklatId_pesertaId: {
                    diklatId: _params.diklatId,
                    pesertaId: currentPeserta.id
                }
            },
            include: {
                diklat: {
                    select: {
                        id: true,
                        materiDiklat: {
                            select: {
                                id: true
                            }
                        }
                    }
                },
                statusKelulusanPesertaDiklat: {
                    select: {
                        nama: true
                    }
                },
                absensiPesertaDiklat: {
                    select: {
                        statusAbsensiPesertaDiklat: {
                            select: {
                                nama: true
                            }
                        }
                    }
                }
            }
        })
        : null

    const totalMateri = pesertaDiklat?.diklat.materiDiklat.length ?? 0
    const totalAbsensi = pesertaDiklat?.absensiPesertaDiklat.length ?? 0
    const totalHadir =
        pesertaDiklat?.absensiPesertaDiklat.filter(
            (absensi) => absensi.statusAbsensiPesertaDiklat.nama === "Hadir"
        ).length ?? 0

    const persentaseKehadiran =
        totalMateri > 0 ? Math.round((totalHadir / totalMateri) * 100) : 0

    const dataRekap = {
        totalKehadiran: `${totalHadir}/${totalMateri} (${persentaseKehadiran}%)`,
        totalMateriSelesai: `${totalAbsensi}/${totalMateri}`,
        statusKelulusan: pesertaDiklat?.statusKelulusanPesertaDiklat?.nama ?? "Belum Dinilai"
    }

    return (
        <Peserta_DiklatHasilAkhir_View
            diklatId={_params.diklatId}
            dataRekap={dataRekap} />
    )
}
