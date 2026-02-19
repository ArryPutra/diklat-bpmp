"use client"

import StatsCard from "@/components/shared/cards/stats-card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { BiBookOpen, BiRightArrowAlt } from "react-icons/bi"

export default function Narasumber_Dashboard_View({
    dataStatistik,
    apakahAdaMateriDiklatAktif
}: {
    dataStatistik: any
    apakahAdaMateriDiklatAktif: number
}) {
    return (
        <>
            {
                apakahAdaMateriDiklatAktif > 0 &&
                <Alert>
                    <BiBookOpen />
                    <AlertTitle>Informasi Materi Diklat Saya</AlertTitle>
                    <AlertDescription>Anda telah didaftarkan pada materi diklat</AlertDescription>
                    <div className="mt-2 ml-6">
                        <Link href='/narasumber/materi-diklat/aktif'>
                            <Button variant="outline" size='sm'>Lihat Detail <BiRightArrowAlt /></Button>
                        </Link>
                    </div>
                </Alert>
            }

            <div className="grid grid-cols-3 gap-3 max-lg:grid-cols-2 max-md:grid-cols-1">
                <StatsCard
                    icon={<BiBookOpen />}
                    label="Total Diklat"
                    value={dataStatistik.totalDiklat} />
            </div>
        </>
    )
}
