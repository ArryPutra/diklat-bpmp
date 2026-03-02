"use server"

import { getCurrentPeserta } from "@/actions/peserta-action"
import PesertaDiklatMateriDiklat from "@/app/peserta/diklat/components/peserta-diklat-materi"
import prisma from "@/lib/prisma"
import { notFound } from "next/navigation"

export default async function Peserta_DiklatRiwayatMateriDiklat_Page({
    params
}: {
    params: Promise<{
        diklatId: string
    }>
}) {
    const _params = await params

    const currentPeserta = await getCurrentPeserta()

    if (!currentPeserta) {
        notFound()
    }

    const diklat: any = await prisma.diklat.findUnique({
        where: {
            id: _params.diklatId,
            pesertaDiklat: {
                some: {
                    pesertaId: currentPeserta.id,
                    statusDaftarPesertaDiklatId: 2,
                }
            }
        },
        include: {
            metodeDiklat: true,
            materiDiklat: {
                include: {
                    absensiPesertaDiklat: {
                        where: {
                            pesertaDiklat: {
                                pesertaId: currentPeserta?.id
                            },
                        },
                        include: {
                            statusAbsensiPesertaDiklat: true
                        }
                    },

                },
                orderBy: [
                    {
                        tanggalPelaksanaan: "asc",
                    },
                    {
                        waktuMulai: "asc",
                    }
                ]
            },
            statusPelaksanaanAcaraDiklat: true
        }
    })

    if (!diklat) {
        notFound()
    }

    return (
        <PesertaDiklatMateriDiklat
            diklatId={_params.diklatId}
            routeSegment="riwayat"
            daftarMateriDiklat={diklat.materiDiklat} />
    )
}
