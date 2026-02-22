"use server"

import { getAllDiklatAction } from "@/actions/diklat-action"
import Admin_VerifikasiPeserta_View from "./view"

export default async function Admin_VerifikasiPeserta_Page({
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
        <Admin_VerifikasiPeserta_View
            daftarDiklatStatusDibuka={daftarDiklatStatusDibuka.data}
            totalDaftarDiklat={daftarDiklatStatusDibuka.total} />
    )
}
