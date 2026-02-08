"use client"

import DaftarInstansiTerbaru from './components/daftar-instansi-terbaru'
import StatsCards from './components/stats-cards'

type AdminDashboardViewProps = {
    dataStatistik: {
        totalDiklat: number;
        totalInstansi: number;
        totalPeserta: number;
        totalNarasumber: number;
    }
    daftarRegistrasiInstansi: any[]
    totalDaftarRegistrasiInstansi: number
}

export default function AdminDashboardView({
    dataStatistik,
    daftarRegistrasiInstansi,
    totalDaftarRegistrasiInstansi
}: AdminDashboardViewProps) {

    return (
        <>
            <StatsCards dataStatistik={{
                totalDiklat: dataStatistik.totalDiklat,
                totalInstansi: dataStatistik.totalInstansi,
                totalPeserta: dataStatistik.totalPeserta,
                totalNarasumber: dataStatistik.totalNarasumber
            }} />

            <DaftarInstansiTerbaru
                daftarRegistrasiInstansi={daftarRegistrasiInstansi}
                totalDaftarRegistrasiInstansi={totalDaftarRegistrasiInstansi}
            />
        </>
    )
}
