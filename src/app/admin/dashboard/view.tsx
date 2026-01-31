"use client"

import StatsCard from '@/components/shared/stats-card'
import { BiBookReader, BiBuilding, BiCheck, BiInfoCircle, BiInfoSquare, BiSearch, BiSolidBookReader, BiUser, BiUserCheck, BiUserVoice, BiX } from 'react-icons/bi'
import DaftarInstansiTerbaru from './components/daftar-instansi-terbaru'
import { RegistrasiInstansi } from '@/generated/prisma/client'

type AdminDashboardViewProps = {
    dataStatistik: {
        totalDiklat: number;
        totalInstansi: number;
        totalPeserta: number;
        totalNarasumber: number;
    }
    daftarRegistrasiInstansi: any[]
}

export default function AdminDashboardView({
    dataStatistik,
    daftarRegistrasiInstansi
}: AdminDashboardViewProps) {

    return (
        <>
            <div className='grid grid-cols-3 gap-3 max-lg:grid-cols-2 max-md:grid-cols-1 mb-6'>
                <StatsCard
                    label='Total Diklat'
                    value={dataStatistik.totalDiklat.toString()}
                    icon={<BiBookReader />} />
                <StatsCard
                    label='Total Instansi'
                    value={dataStatistik.totalInstansi.toString()}
                    icon={<BiBuilding />} />
                <StatsCard
                    label='Total Peserta'
                    value={dataStatistik.totalPeserta.toString()}
                    icon={<BiUser />} />
                <StatsCard
                    label='Total Narasumber'
                    value={dataStatistik.totalNarasumber.toString()}
                    icon={<BiUserVoice />} />
            </div>

            <DaftarInstansiTerbaru
                daftarRegistrasiInstansi={daftarRegistrasiInstansi}
            />
        </>
    )
}
