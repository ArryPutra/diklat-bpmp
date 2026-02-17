"use server"

import { getAllDiklatAction } from "@/actions/diklat-action"
import VerifikasiPesertaDiklatView_Diklat from "./view"

export default async function VerifikasiPesertaDiklatPage({
    searchParams
}: {
    searchParams: Promise<{
        search?: string
        page?: string
    }>
}) {

    const _searchParams = await searchParams

    const daftarDiklatStatusDibuka = await getAllDiklatAction({
        page: _searchParams.page,
        search: _searchParams.search,
        statusPendaftaranDiklatId: [2]
    })

    return (
        <VerifikasiPesertaDiklatView_Diklat
            daftarDiklatStatusDibuka={daftarDiklatStatusDibuka.data}
            totalDaftarDiklat={daftarDiklatStatusDibuka.total} />
    )
}
