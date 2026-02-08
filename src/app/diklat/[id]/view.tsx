import { Footer, Header } from "@/app/view";
import GuestLayout from "@/components/layouts/guest-layout";
import StatsCard from "@/components/shared/cards/stats-card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { dateRangeFormatted, formatDateId } from "@/utils/dateFormatted";
import { BiBuilding, BiCalendar, BiTargetLock } from "react-icons/bi";

export default function DiklatView({
    diklat
}: {
    diklat: any
}) {

    return (
        <>
            <Header activeMenuLabel="Diklat" />
            <GuestLayout className="pt-40 max-md:pt-36 min-h-screen">
                <Badge className={`mb-2 ${diklat.statusPendaftaranDiklat.backgroundColor}`}>
                    {diklat.apakahDiklatDibuka ? "Dibuka" : "Ditutup"}
                </Badge>
                <h1 className="text-2xl font-bold text-primary mb-2">{diklat.judul}</h1>
                <p className="text-sm mb-4">{diklat.deskripsi}</p>
                <div className="flex gap-3 flex-wrap mb-8">
                    <Badge>Metode: {diklat.metodeDiklat.nama}</Badge>
                    <Badge>Target: {diklat.targetSasaran}</Badge>
                </div>
                <div className="border text-sm p-4 rounded-lg mb-6">
                    <h1 className="flex items-center gap-2 font-semibold text-lg mb-1 text-primary"><BiTargetLock /> Tujuan</h1>
                    <p>{diklat.tujuan}</p>
                </div>

                <div className="flex gap-8 max-md:flex-col max-md:gap-0">
                    <section className="max-md:mb-8">
                        <div className="grid grid-cols-2 gap-4 max-md:grid-cols-1 mb-8">
                            <StatsCard
                                label="Tanggal Pelaksanaan"
                                value={dateRangeFormatted(diklat.tanggalMulaiAcara, diklat.tanggalSelesaiAcara)}
                                icon={<BiCalendar />}
                                variant="small" />
                            <StatsCard
                                label="Lokasi Pelaksanaan"
                                value={diklat.lokasi}
                                icon={<BiBuilding />}
                                variant="small" />
                        </div>

                        <Card className="mb-8">
                            <CardHeader>
                                <CardTitle >
                                    Daftar Materi Pelatihan
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <CardDescription className="flex items-center gap-3">
                                    <Badge className="w-6 h-6">1</Badge> Mengenalkan Platform Pembelajaran Digital
                                </CardDescription>
                                <CardDescription className="flex items-center gap-3">
                                    <Badge className="w-6 h-6">2</Badge> Mengenalkan Platform Pembelajaran Digital
                                </CardDescription>
                            </CardContent>
                            <CardFooter className="border-t">
                                <CardDescription>Total Materi: 2 Materi</CardDescription>
                            </CardFooter>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>
                                    Persyaratan Peserta
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <CardDescription className="flex items-center gap-3">
                                    <Badge className="w-6 h-6" variant='destructive'>1</Badge> Guru Aktif di Satuan Pendidikan
                                </CardDescription>
                                <CardDescription className="flex items-center gap-3">
                                    <Badge className="w-6 h-6" variant='destructive'>2</Badge> Bersedia Mengikuti Segala Rangkaian dari Awal hingga Akhir
                                </CardDescription>
                            </CardContent>
                            <CardFooter className="border-t">
                                <CardDescription>Total Persyaratan: 2 Persyaratan</CardDescription>
                            </CardFooter>
                        </Card>
                    </section>

                    <Card className="border shadow-xl sticky top-32 self-start w-md
                    max-md:w-full">
                        <CardContent>
                            <CardTitle className="whitespace-nowrap mb-8">Informasi Pendaftaran</CardTitle>

                            <div className="text-sm flex justify-between mb-2">
                                <h1>Kuota Terisi</h1>
                                <h1>0/{diklat.maksimalKuota}</h1>
                            </div>
                            <div className="border w-full h-4 rounded-full overflow-hidden mb-2">
                                <div className="bg-linear-to-r from-red-500 to-red-600 w-1/2 h-full"></div>
                            </div>
                            <p className="text-xs text-gray-500 mb-4">Tersisa 16 Peserta</p>

                            <Alert variant='danger' className="mb-8">
                                <AlertDescription className="mb-3">Batas Pendaftaran</AlertDescription>
                                <AlertTitle className="text-lg font-semibold">{formatDateId(diklat.tanggalTutupPendaftaran)}</AlertTitle>
                                <AlertDescription> 2 Hari Lagi</AlertDescription>
                            </Alert>

                            <Button className="w-full mb-2">Daftar Sekarang</Button>
                        </CardContent>
                    </Card>
                </div>
            </GuestLayout>
            <Footer />
        </>
    )
}
