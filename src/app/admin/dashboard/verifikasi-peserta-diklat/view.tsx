"use client"

import ButtonNav from '../components/button-nav'
import StatsCards from '../components/stats-cards'
import VerifikasiPesertaDiklatCanvas from '../components/verifikasi-peserta-diklat-canvas'

type AdminDashboardVerifikasiPesertaDiklatViewProps = {
    dataStatistik: {
        totalDiklat: number;
        totalInstansi: number;
        totalPeserta: number;
        totalNarasumber: number;
    }
}

export default function AdminDashboardVerifikasiPesertaDiklatView({
    dataStatistik,
}: AdminDashboardVerifikasiPesertaDiklatViewProps) {

    return (
        <>
            <StatsCards dataStatistik={{
                totalDiklat: dataStatistik.totalDiklat,
                totalInstansi: dataStatistik.totalInstansi,
                totalPeserta: dataStatistik.totalPeserta,
                totalNarasumber: dataStatistik.totalNarasumber
            }} />

            <ButtonNav />

            <VerifikasiPesertaDiklatCanvas />
        </>
    )
}
