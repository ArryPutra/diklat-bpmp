import StatsCard from "@/components/shared/cards/stats-card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { BiBookOpen } from "react-icons/bi";

export default function Peserta_Dashboard_View({
    dataStatistik,
    totalDiklatDiikutiAktif,
    daftarDiklatBaruSelesai
}: {
    dataStatistik: {
        diklatDiikuti: number
    },
    totalDiklatDiikutiAktif?: number,
    daftarDiklatBaruSelesai?: {
        id: string
        judul: string
        tanggalSelesaiAcara: Date
    }[]
}) {
    return (
        <>
            {
                (daftarDiklatBaruSelesai?.length ?? 0) > 0 &&
                <Alert>
                    <AlertTitle>Selamat! Anda telah menyelesaikan diklat</AlertTitle>
                    <AlertDescription>
                        {
                            (daftarDiklatBaruSelesai?.length ?? 0) === 1
                                ? <p>Selamat, Anda telah menyelesaikan diklat <strong>{daftarDiklatBaruSelesai?.[0]?.judul}</strong>.</p>
                                : <p>Selamat, Anda telah menyelesaikan {daftarDiklatBaruSelesai?.length} diklat dalam 3 hari terakhir.</p>
                        }
                        <ul className="mt-2 list-disc pl-5">
                            {
                                daftarDiklatBaruSelesai?.map((diklat) => (
                                    <li key={diklat.id}>{diklat.judul}</li>
                                ))
                            }
                        </ul>
                        <Link href="/peserta/diklat/riwayat">
                            <Button size="sm" className="mt-2">Lihat Riwayat Diklat</Button>
                        </Link>
                    </AlertDescription>
                </Alert>
            }

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
