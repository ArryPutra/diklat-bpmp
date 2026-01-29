"use client"

import StatsCard from '@/components/shared/stats-card'
import { BiBookReader, BiBuilding, BiSolidBookReader, BiUser, BiUserCheck, BiUserVoice } from 'react-icons/bi'

type AdminDashboardViewProps = {
    dataStatistik: {
        totalDiklat: number;
        totalInstansi: number;
        totalPeserta: number;
        totalNarasumber: number;
    }
}

export default function AdminDashboardView({ dataStatistik }: AdminDashboardViewProps) {
    return (
        <div className='grid grid-cols-3 gap-3 max-lg:grid-cols-2 max-md:grid-cols-1'>
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
    )
}
