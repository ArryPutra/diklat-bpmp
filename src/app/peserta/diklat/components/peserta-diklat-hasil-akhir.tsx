import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { BiBookOpen, BiCheckDouble, BiSolidGraduation } from "react-icons/bi";

export default function PesertaDiklatHasilAkhir({
    diklatId,
    routeSegment = "aktif",
    dataRekap,
    dataHasilAkhir
}: {
    diklatId: string
    routeSegment?: "aktif" | "riwayat"
    dataRekap: {
        totalKehadiran: string
        totalMateriSelesai: string
        statusKelulusan: string
    },
    dataHasilAkhir: {
        apakahDiklatSudahSelesai: boolean
        apakahLulus: boolean
        kodeSertifikasi: string | null
    }
}) {
    return (
        <>
            <div className='flex gap-3 flex-wrap'>
                <Link href={`/peserta/diklat/${routeSegment}/${diklatId}/materi-diklat`}>
                    <Button size='sm' variant='outline'>Materi Diklat</Button>
                </Link>
                <Button size='sm'>Hasil Akhir</Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Rekap Hasil Akhir Diklat</CardTitle>
                    <CardDescription>Ringkasan hasil akhir keikutsertaan Anda dalam diklat ini.</CardDescription>
                </CardHeader>
                <CardContent>

                    <div className="grid grid-cols-3 gap-4 max-lg:grid-cols-2 max-sm:grid-cols-1">
                        <Card>
                            <CardHeader>
                                <CardAction>
                                    <BiCheckDouble />
                                </CardAction>
                                <CardDescription>Kehadiran</CardDescription>
                                <CardTitle>{dataRekap.totalKehadiran}</CardTitle>
                            </CardHeader>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardAction>
                                    <BiBookOpen />
                                </CardAction>
                                <CardDescription>Materi Selesai</CardDescription>
                                <CardTitle>{dataRekap.totalMateriSelesai}</CardTitle>
                            </CardHeader>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardAction>
                                    <BiSolidGraduation />
                                </CardAction>
                                <CardDescription>Status Kelulusan</CardDescription>
                                <CardTitle>{dataRekap.statusKelulusan}</CardTitle>
                            </CardHeader>
                        </Card>
                    </div>
                </CardContent>

                <CardFooter>
                    {
                        // jika diklat belum selesai
                        !dataHasilAkhir.apakahDiklatSudahSelesai &&
                        <Alert>
                            <AlertTitle>Hasil Akhir Belum Tersedia</AlertTitle>
                            <AlertDescription>Hasil akhir akan tersedia setelah Anda menyelesaikan seluruh materi diklat.</AlertDescription>
                        </Alert>
                    }
                    {
                        // jika diklat sudah selesai dan peserta lullus
                        (dataHasilAkhir.apakahDiklatSudahSelesai && dataHasilAkhir.apakahLulus && dataHasilAkhir.kodeSertifikasi) &&
                        <Link href={`/api/sertifikat/${dataHasilAkhir.kodeSertifikasi}`}>
                            <Button>
                                <BiCheckDouble />
                                Unduh Sertifikasi
                            </Button>
                        </Link>
                    }
                    {
                        // jika diklat sudah selesai, lulus, tetapi sertifikasi belum tersedia
                        (dataHasilAkhir.apakahDiklatSudahSelesai && dataHasilAkhir.apakahLulus && !dataHasilAkhir.kodeSertifikasi) &&
                        <Alert>
                            <AlertTitle>Sertifikasi Belum Tersedia</AlertTitle>
                            <AlertDescription>Sertifikasi Anda sedang diproses. Silakan cek kembali secara berkala.</AlertDescription>
                        </Alert>
                    }
                    {
                        // jika diklat sudah selesai dan peserta tidak lullus
                        (dataHasilAkhir.apakahDiklatSudahSelesai && !dataHasilAkhir.apakahLulus) &&
                        <Alert variant='danger'>
                            <AlertTitle>Hasil Akhir:</AlertTitle>
                            <AlertDescription>Mohon maaf, Anda tidak lulus pada diklat ini. Jika ada pengaduan, silakan hubungi admin.</AlertDescription>
                        </Alert>
                    }
                </CardFooter>
            </Card>
        </>
    )
}
