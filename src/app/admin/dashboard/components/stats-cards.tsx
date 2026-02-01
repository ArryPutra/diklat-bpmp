"use client"

import StatsCard from '@/components/shared/stats-card'
import { BiBookReader, BiBuilding, BiUser, BiUserVoice } from 'react-icons/bi'

type StatsCardsProps = {
  dataStatistik: {
    totalDiklat: number,
    totalInstansi: number,
    totalPeserta: number,
    totalNarasumber: number
  }
}

export default function StatsCards({
  dataStatistik
}: StatsCardsProps) {
  return (
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
  )
}
