"use client"

import TextLink from "@/components/shared/text-link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Diklat, MetodeDiklat, StatusPelaksanaanAcaraDiklat } from "@/generated/prisma/client"
import { dateRangeFormatted } from "@/utils/dateFormatted"
import { MapPin, Network } from "lucide-react"
import Link from "next/link"

export type DiklatPesertaItem = Diklat & {
    metodeDiklat: MetodeDiklat | null
    statusPelaksanaanAcaraDiklat: StatusPelaksanaanAcaraDiklat | null
}

export default function PesertaDiklatList({
    daftarDiklat,
    detailBasePath,
    emptyTitle,
    emptyDescription,
    actionLabel = "Lihat Detail"
}: {
    daftarDiklat: DiklatPesertaItem[]
    detailBasePath: string
    emptyTitle: string
    emptyDescription: string
    actionLabel?: string
}) {
    if (daftarDiklat.length === 0) {
        return (
            <div className="py-10 text-center">
                <h2 className="text-base font-semibold">{emptyTitle}</h2>
                <p className="text-sm text-slate-500">{emptyDescription}</p>
            </div>
        )
    }

    return (
        <div className="grid grid-cols-2 gap-4 max-lg:grid-cols-1">
            {
                daftarDiklat.map((diklat) => (
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
                            <Link href={`${detailBasePath}/${diklat.id}`}>
                                <Button size="sm">{actionLabel}</Button>
                            </Link>
                        </CardFooter>
                    </Card>
                ))
            }
        </div>
    )
}