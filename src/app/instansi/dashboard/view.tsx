import StatsCard from '@/components/shared/cards/stats-card'
import { BiUser } from 'react-icons/bi'

export default function Instansi_Dashboard_View({
    dataStatistik
}: {
    dataStatistik: any
}) {
    return (
        <div className='grid grid-cols-3 max-lg:grid-cols-2 max-md:grid-cols-1'>
            <StatsCard
                icon={<BiUser />}
                label='Total Peserta'
                value={dataStatistik.totalPeserta} />
        </div>
    )
}
