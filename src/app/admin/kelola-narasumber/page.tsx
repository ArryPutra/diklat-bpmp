"use server"

import { getAllNarasumberAction } from "@/actions/narasumber-action";
import { cookies } from "next/headers";
import AdminKelolaNarasumberView from "./view";

export default async function AdminKelolaNarasumberPage({
    searchParams
}: {
    searchParams: Promise<{
        search?: string
        page?: string
    }>
}) {

    const _searchParams = await searchParams

    const getAllNarasumber = await getAllNarasumberAction({
        search: _searchParams.search,
        page: _searchParams.page
    })

    return (
        <AdminKelolaNarasumberView
            daftarNarasumber={getAllNarasumber.data}
            totalNarasumber={getAllNarasumber.total}
            newMessage={(await cookies()).get("flash")?.value} />
    )
}
