"use server"

import { getCurrentPeserta } from '@/actions/peserta-action'
import prisma from '@/lib/prisma'
import Peserta_Dashboard_View from './view'

export default async function Peserta_Dashboard_Page() {
    const currentPeserta = await getCurrentPeserta()

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
        }
    })

    return (
        <Peserta_Dashboard_View
            totalDiklatSedangDiikuti={totalDiklatSedangDiikuti}
            dataStatistik={{
                diklatDiikuti: totalDiklatDiikuti
            }} />
    )
}
