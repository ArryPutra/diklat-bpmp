"use client"

import { ContentCanvas } from "@/components/layouts/auth-layout"
import TextLink from "@/components/shared/text-link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Diklat, MetodeDiklat, StatusPelaksanaanAcaraDiklat } from "@/generated/prisma/client"
import { dateRangeFormatted } from "@/utils/dateFormatted"
import { MapPin, Network } from "lucide-react"
import Link from "next/link"

type DiklatAktifPeserta = Diklat & {
    metodeDiklat: MetodeDiklat | null
    statusPelaksanaanAcaraDiklat: StatusPelaksanaanAcaraDiklat | null
}

export default function Peserta_DiklatAktif_View({
    daftarDiklatAktifDiikuti,
}: {
    daftarDiklatAktifDiikuti: DiklatAktifPeserta[]
}) {
    return (
        <ContentCanvas>
            <div>
                <h1 className="font-semibold">Diklat Aktif Saya</h1>
                <p className="text-sm text-gray-500">
                    Daftar diklat yang sedang Anda ikuti dan belum berakhir.
                </p>
            </div>

            {
                daftarDiklatAktifDiikuti.length > 0
                    ? (
                        <div className="grid grid-cols-2 gap-4 max-lg:grid-cols-1">
                            {
                                daftarDiklatAktifDiikuti.map((diklat) => (
                                    <Card key={diklat.id} className="gap-4">
                                        <CardHeader className="gap-3">
                                            {
                                                diklat.statusPelaksanaanAcaraDiklat &&
                                                <Badge className={`${diklat.statusPelaksanaanAcaraDiklat.backgroundColor} w-fit`}>
                                                    {diklat.statusPelaksanaanAcaraDiklat.nama}
                                                </Badge>
                                            }
                                            <CardTitle className="text-base leading-snug">
                                                <TextLink url={`/diklat/${diklat.id}`}>
                                                    {diklat.judul}
                                                </TextLink>
                                            </CardTitle>
                                            <CardDescription>
                                                {dateRangeFormatted(
                                                    diklat.tanggalMulaiAcara.toISOString(),
                                                    diklat.tanggalSelesaiAcara.toISOString()
                                                )}
                                            </CardDescription>
                                        </CardHeader>

                                        <CardContent className="space-y-3 text-sm">
                                            {
                                                diklat.metodeDiklat &&
                                                <div className="space-y-1">
                                                    <p className="text-gray-500 flex items-center gap-1">
                                                        <Network size={14} />
                                                        Metode
                                                    </p>
                                                    <Badge className={diklat.metodeDiklat.backgroundColor}>
                                                        {diklat.metodeDiklat.nama}
                                                    </Badge>
                                                </div>
                                            }
                                            <div className="space-y-1">
                                                <p className="text-gray-500 flex items-center gap-1">
                                                    <MapPin size={14} />
                                                    Lokasi
                                                </p>
                                                <p className="font-medium">{diklat.lokasi}</p>
                                            </div>
                                        </CardContent>

                                        <CardFooter className="flex gap-3 flex-wrap">
                                            <Link href={`/peserta/diklat/${diklat.id}/materi-diklat`}>
                                                <Button size="sm">Lihat Detail</Button>
                                            </Link>
                                        </CardFooter>
                                    </Card>
                                ))
                            }
                        </div>
                    )
                    : (
                        <div className="py-10 text-center">
                            <h2 className="text-base font-semibold">Belum ada diklat aktif yang Anda ikuti.</h2>
                            <p className="text-sm text-slate-500">Daftar akan tampil saat Anda terdaftar pada diklat aktif.</p>
                        </div>
                    )
            }
        </ContentCanvas>
    )
}
