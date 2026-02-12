"use client"

import ButtonNav from '../components/button-nav'
import StatsCards from '../components/stats-cards'
import VerifikasiRegistrasiInstansiCanvas from '../components/verifikasi-registrasi-instansi-canvas'

type AdminDashboardVerifikasiRegistrasiInstansiViewProps = {
    dataStatistik: {
        totalDiklat: number;
        totalInstansi: number;
        totalPeserta: number;
        totalNarasumber: number;
    }
    daftarRegistrasiInstansi: any[]
    totalDaftarRegistrasiInstansi: number
}

export default function AdminDashboardVerifikasiRegistrasiInstansiView({
    dataStatistik,
    daftarRegistrasiInstansi,
    totalDaftarRegistrasiInstansi
}: AdminDashboardVerifikasiRegistrasiInstansiViewProps) {

    return (
        <>
            <StatsCards dataStatistik={{
                totalDiklat: dataStatistik.totalDiklat,
                totalInstansi: dataStatistik.totalInstansi,
                totalPeserta: dataStatistik.totalPeserta,
                totalNarasumber: dataStatistik.totalNarasumber
            }} />

            <ButtonNav />

            <VerifikasiRegistrasiInstansiCanvas
                daftarRegistrasiInstansi={daftarRegistrasiInstansi}
                totalDaftarRegistrasiInstansi={totalDaftarRegistrasiInstansi}
            />
        </>
    )
}
