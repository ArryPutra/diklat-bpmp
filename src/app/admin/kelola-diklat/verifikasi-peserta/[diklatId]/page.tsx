import { getDiklatAction } from "@/actions/diklat-action"
import { getAllPesertaDiklatAction } from "@/actions/peserta-diklat-action"
import prisma from "@/lib/prisma"
import VerifikasiPesertaDiklatView_PesertaDiklat from "./view"

export const metadata = {
    title: "Verifikasi Peserta Diklat",
}

export default async function VerifikasiPesertaDiklatDetailPage({
    params,
    searchParams
}: {
    params: Promise<{
        diklatId: string
    }>
    searchParams: Promise<{
        search?: string
        page?: string
        instansiId?: string
    }>
}) {
    const _params = await params
    const _searchParams = await searchParams

    const diklat = await getDiklatAction(_params.diklatId)
    const daftarPesertaDiklat = await getAllPesertaDiklatAction({
        // page: _searchParams.page,
        // search: _searchParams.search,
        // diklatId: _params.diklatId,
        // extraWhere: {
        //     peserta: {
        //         instansiId: _searchParams.instansiId ? Number(_searchParams.instansiId) : undefined,
        //     }
        // }
    })

    const daftarInstansiUnik = await prisma.peserta.findMany({
        where: {
            pesertaDiklat: {
                some: {
                    diklatId: _params.diklatId,
                }
            }
        },
        distinct: ["instansiId"],
        select: {
            instansiId: true,
            instansi: {
                select: {
                    id: true,
                    user: {
                        select: {
                            name: true,
                        },
                    },
                },
            },
        },
    })

    return (
        <VerifikasiPesertaDiklatView_PesertaDiklat
            diklat={diklat}
            daftarPesertaDiklat={daftarPesertaDiklat.data}
            totalPesertaDiklat={daftarPesertaDiklat.total}
            daftarInstansiUnik={daftarInstansiUnik}
        />
    )
}
