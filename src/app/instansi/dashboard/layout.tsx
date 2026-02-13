"use server"

import { getCurrentInstansi } from "@/actions/instansi-action";
import StatsCard from "@/components/shared/cards/stats-card";
import { Button } from "@/components/ui/button";
import prisma from "@/lib/prisma";
import { BiUser } from "react-icons/bi";

export default async function InstansiDashboardLayout({ children }: { children: React.ReactNode }) {
    const dataStatistik = {
        totalPeserta: await prisma.peserta.count({
            where: {
                instansiId: (await getCurrentInstansi()).id
            }
        })
    }
    return (
        <>
            <div className='grid grid-cols-3 gap-3 max-lg:grid-cols-2 max-md:grid-cols-1'>
                <StatsCard
                    label='Total Peserta'
                    value={dataStatistik.totalPeserta.toString()}
                    icon={<BiUser />} />
            </div>

            <div>
                <Button>Diklat</Button>
            </div>

            {children}
        </>
    )
}
