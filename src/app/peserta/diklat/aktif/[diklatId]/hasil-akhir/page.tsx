"use server"

import { getCurrentPeserta } from '@/actions/peserta-action'
import PesertaDiklatHasilAkhir from '@/app/peserta/diklat/components/peserta-diklat-hasil-akhir'
import prisma from '@/lib/prisma'

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
                kelulusanPesertaDiklat: {
                    select: {
                        kodeSertifikasi: true
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

    const apakahDiklatSudahSelesai = totalAbsensi === totalMateri
    const apakahLulus = pesertaDiklat?.statusKelulusanPesertaDiklat?.nama === "Lulus"
    const kodeSertifikasi = pesertaDiklat?.kelulusanPesertaDiklat[0]?.kodeSertifikasi || null

    return (
        <PesertaDiklatHasilAkhir
            diklatId={_params.diklatId}
            dataRekap={dataRekap}
            dataHasilAkhir={{
                apakahDiklatSudahSelesai: apakahDiklatSudahSelesai,
                apakahLulus,
                kodeSertifikasi,
                statusKelulusan: pesertaDiklat?.statusKelulusanPesertaDiklat?.nama ?? "Belum Dinilai"
            }} />
    )
}
