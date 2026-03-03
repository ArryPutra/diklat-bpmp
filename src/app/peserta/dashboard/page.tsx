"use server"

import { getCurrentPeserta } from '@/actions/peserta-action'
import prisma from '@/lib/prisma'
import Peserta_Dashboard_View from './view'

export default async function Peserta_Dashboard_Page() {
    const currentPeserta = await getCurrentPeserta()

    const now = new Date()
    const batasTigaHariTerakhir = new Date(now)
    batasTigaHariTerakhir.setDate(now.getDate() - 3)

    const totalDiklatDiikuti = await prisma.pesertaDiklat.count({
        where: {
            pesertaId: currentPeserta?.id,
            statusDaftarPesertaDiklatId: 2, // diterima sebagai peserta
        }
    })

    const totalDiklatSedangDiikuti = await prisma.pesertaDiklat.count({
        where: {
            pesertaId: currentPeserta?.id,
            statusDaftarPesertaDiklatId: 2, // diterima sebagai peserta
            diklat: {
                statusPelaksanaanAcaraDiklatId: 2
            }
        }
    })

    const daftarDiklatBaruSelesai = await prisma.pesertaDiklat.findMany({
        where: {
            pesertaId: currentPeserta?.id,
            statusDaftarPesertaDiklatId: 2,
            diklat: {
                statusPelaksanaanAcaraDiklatId: 3,
                tanggalSelesaiAcara: {
                    lte: now,
                    gte: batasTigaHariTerakhir
                }
            }
        },
        select: {
            diklat: {
                select: {
                    id: true,
                    judul: true,
                    tanggalSelesaiAcara: true
                }
            }
        },
        orderBy: {
            diklat: {
                tanggalSelesaiAcara: "desc"
            }
        }
    })

    return (
        <Peserta_Dashboard_View
            totalDiklatDiikutiAktif={totalDiklatSedangDiikuti}
            daftarDiklatBaruSelesai={daftarDiklatBaruSelesai.map((item) => ({
                id: item.diklat.id,
                judul: item.diklat.judul,
                tanggalSelesaiAcara: item.diklat.tanggalSelesaiAcara
            }))}
            dataStatistik={{
                diklatDiikuti: totalDiklatDiikuti
            }} />
    )
}
