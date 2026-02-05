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
    }>
}) {

    const _searchParams = await searchParams

    const metodeDiklatId = parseInt(_searchParams.metodeDiklatId ?? "0")

    const daftarDiklat = await getAllDiklatAction({
        search: _searchParams.search,
        page: _searchParams.page,
        metodeDiklatId: metodeDiklatId === 0 ? undefined : metodeDiklatId
    });

    return (
        <AdminDiklatView
            daftarDiklat={daftarDiklat.data}
            totalDaftarDiklat={daftarDiklat.total}
            newMessage={(await cookies()).get("flash")?.value} />
    )
}
