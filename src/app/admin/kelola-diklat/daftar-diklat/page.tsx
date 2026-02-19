"use server"

import { getAllDiklatAction } from "@/actions/diklat-action";
import { cookies } from "next/headers";
import AdminDiklatView from "./view";

export default async function AdminDiklatPage({
    searchParams
}: {
    searchParams: Promise<{
        search?: string
        page?: string
        metodeDiklatId?: string
        statusPendaftaranDiklatId?: string
        statusPelaksanaanAcaraDiklatId?: string
    }>
}) {

    const _searchParams = await searchParams

    const metodeDiklatId = parseInt(_searchParams.metodeDiklatId ?? "0");
    const statusPendaftaranDiklatId = parseInt(_searchParams.statusPendaftaranDiklatId ?? "0");
    const statusPelaksanaanAcaraDiklatId = parseInt(_searchParams.statusPelaksanaanAcaraDiklatId ?? "0");


    const daftarDiklat = await getAllDiklatAction({
        search: _searchParams.search,
        page: _searchParams.page,
        metodeDiklatId: metodeDiklatId === 0 ? undefined : metodeDiklatId,
        statusPendaftaranDiklatId: statusPendaftaranDiklatId === 0 ? [1, 2, 3] : [statusPendaftaranDiklatId],
        statusPelaksanaanAcaraDiklatId: statusPelaksanaanAcaraDiklatId === 0 ? [1, 2, 3] : [statusPelaksanaanAcaraDiklatId]
    });

    return (
        <AdminDiklatView
            daftarDiklat={daftarDiklat.data}
            totalDaftarDiklat={daftarDiklat.total}
            newMessage={(await cookies()).get("flash")?.value} />
    )
}
