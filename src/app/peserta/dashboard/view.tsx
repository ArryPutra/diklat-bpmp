import StatsCard from "@/components/shared/cards/stats-card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { BiBookOpen } from "react-icons/bi";

export default function Peserta_Dashboard_View({
    dataStatistik,
    totalDiklatDiikutiAktif
}: {
    dataStatistik: {
        diklatDiikuti: number
    },
    totalDiklatDiikutiAktif?: number
}) {
    return (
        <>
            {
                (totalDiklatDiikutiAktif ?? 0) > 0 &&
                <Alert>
                    <AlertTitle>Informasi Diklat Aktif</AlertTitle>
                    <AlertDescription>
                        <p>
                            Anda sedang mengikuti {totalDiklatDiikutiAktif} diklat yang masih aktif.
                        </p>
                        <Link href="/peserta/diklat/aktif">
                            <Button size="sm" className="mt-2">Lihat Diklat Aktif</Button>
                        </Link>
                    </AlertDescription>
                </Alert>
            }

            <div className="grid grid-cols-3 gap-3 max-lg:grid-cols-2 max-md:grid-cols-1">
                <StatsCard
                    icon={<BiBookOpen />}
                    label="Diklat Diikuti"
                    value={dataStatistik.diklatDiikuti.toString()} />
            </div>
        </>
    )
}
