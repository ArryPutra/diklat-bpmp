"use client"

import StatsCard from "@/components/shared/cards/stats-card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";
import { dateRangeFormatted, formatDateId, formatDateTimeId } from "@/utils/dateFormatted";
import { differenceInDays } from "date-fns";
import { useEffect, useState } from "react";
import { BiBook, BiBuilding, BiCalendar, BiInfoCircle, BiTargetLock, BiTime, BiUser } from "react-icons/bi";
import DialogDaftarSekarang from "./dialog-daftar-sekarang";

export default function DetailDiklatTabsContent({
    diklat,
    isInstansi,
    daftarPesertaDariInstansi
}: {
    diklat: any
    isInstansi: boolean
    daftarPesertaDariInstansi: any[]
}) {
    const totalPesertaDariPersentase =
        (diklat.pesertaDiklat.length / diklat.maksimalKuota) * 100;

    console.log(diklat.materiDiklat)

    return (
        <TabsContent value="detail">
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
                            <CardTitle className="flex gap-2">
                                <BiBook /> Materi Pelatihan
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {
                                diklat.materiDiklat.length > 0 ? (
                                    <div className="space-y-6">
                                        {diklat.materiDiklat.map((materi: any, index: number) => (
                                            <div
                                                key={index}
                                                className="relative border border-l-4 border-l-blue-400 border-slate-200 rounded-lg p-4 hover:border-blue-500 hover:shadow-sm transition-all duration-200 bg-white">
                                                {/* Nomor Urut Floating */}
                                                <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-semibold shadow-md">
                                                    {index + 1}
                                                </div>
                                                {/* Konten */}
                                                <div className="flex items-start justify-between gap-4 max-md:flex-col">
                                                    <div className="flex-1 min-w-0">
                                                        <h3 className="font-semibold text-slate-900 mb-1 text-sm">
                                                            {materi.judul}
                                                        </h3>
                                                        <p className="text-xs text-slate-600 mb-3 line-clamp-2">
                                                            {materi.deskripsi}
                                                        </p>
                                                        <div className="flex flex-col gap-1 text-xs">
                                                            <div className="flex items-center gap-1">
                                                                <span className="flex items-center gap-1"><BiCalendar/> <b>{formatDateId(materi.tanggalPelaksanaan)}</b></span>
                                                            </div>
                                                            <div className="flex items-center gap-1">
                                                                <span className="flex items-center gap-1"><BiTime/> <b>{materi.waktuMulai}</b> - <b>{materi.waktuSelesai}</b></span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <Badge variant="secondary" className="flex-shrink-0 whitespace-nowrap text-xs">
                                                        <BiUser /> {materi.narasumber.user.name}
                                                    </Badge>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8 px-4 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                                        <p className="text-gray-400 text-sm">📚 Belum ada materi yang ditambahkan</p>
                                    </div>
                                )
                            }
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex gap-2">
                                <BiInfoCircle /> Persyaratan Peserta
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <CardDescription className="flex items-center gap-3 whitespace-pre-line text-black">
                                {diklat.persyaratanPeserta}
                            </CardDescription>
                        </CardContent>
                    </Card>
                </section>

                <Card className="border shadow-xl sticky top-32 self-start w-md
                    max-md:w-full">
                    <CardContent>
                        <CardTitle className="whitespace-nowrap mb-8">Informasi Pendaftaran</CardTitle>

                        <div className="text-sm flex justify-between mb-2">
                            <h1>Kuota Terisi</h1>
                            <h1>{diklat.pesertaDiklat.length}/{diklat.maksimalKuota}</h1>
                        </div>
                        <div className="border w-full h-4 rounded-full overflow-hidden mb-2">
                            <ProgressBar filledPercentage={totalPesertaDariPersentase} />
                        </div>
                        <p className="text-xs text-gray-500 mb-4">
                            Tersisa <b>{diklat.maksimalKuota - diklat.pesertaDiklat.length}</b> kuota dari {diklat.maksimalKuota} Peserta
                        </p>

                        <Alert variant='danger' className="mb-8">
                            <AlertDescription className="mb-3">Batas Pendaftaran</AlertDescription>
                            <AlertTitle className="text-lg font-semibold">{formatDateId(diklat.tanggalTutupPendaftaran)}</AlertTitle>
                            <AlertDescription>
                                {
                                    differenceInDays(diklat.tanggalTutupPendaftaran, new Date()) < 0
                                        ?
                                        'Pendaftaran Sudah Ditutup'
                                        :
                                        differenceInDays(diklat.tanggalTutupPendaftaran, new Date()) === 0
                                            ?
                                            'Hari Terakhir'
                                            : differenceInDays(diklat.tanggalTutupPendaftaran, new Date()) + 'Hari Lagi'
                                }
                            </AlertDescription>
                        </Alert>

                        <DialogDaftarSekarang
                            diklat={diklat}
                            isInstansi={isInstansi}
                            daftarPesertaDariInstansi={daftarPesertaDariInstansi} />
                    </CardContent>
                </Card>
            </div>
        </TabsContent>
    )
}

function ProgressBar({ filledPercentage }: { filledPercentage: number }) {
    const [width, setWidth] = useState(0);

    useEffect(() => {
        // jalankan animasi saat component mount / filledPercentage berubah
        const timeout = setTimeout(() => {
            setWidth(filledPercentage);
        }, 100); // delay sedikit supaya animasi terlihat smooth

        return () => clearTimeout(timeout);
    }, [filledPercentage]);

    return (
        <div className="w-full h-4 rounded-full overflow-hidden bg-gray-50">
            <div
                className="bg-gradient-to-r from-blue-500 to-blue-600 h-full transition-all duration-1000 ease-out"
                style={{ width: `${width}%` }}
            ></div>
        </div>
    );
}