"use server"

import { getCurrentPeserta } from '@/actions/peserta-action'
import PesertaDiklatMateriDiklat from '@/app/peserta/diklat/components/peserta-diklat-materi'
import prisma from '@/lib/prisma'

export default async function Peserta_DiklatMateriDiklat_Page({
    params
}: {
    params: Promise<{
        diklatId: string
    }>
}) {

    const _params = await params

    const currentPeserta = await getCurrentPeserta()

    const diklat: any = await prisma.diklat.findUnique({
        where: {
            id: _params.diklatId
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
                        tanggalPelaksanaan: 'asc',
                    },
                    {
                        waktuMulai: 'asc',
                    }
                ]
            },
            statusPelaksanaanAcaraDiklat: true
        }
    })

    return (
        <PesertaDiklatMateriDiklat
            diklatId={_params.diklatId}
            daftarMateriDiklat={diklat.materiDiklat} />
    )
}
