"use server"

import { getAllPesertaAction } from "@/actions/peserta-action";
import { cookies } from "next/headers";
import KelolaPesertaView from "./view";

export default async function InstansiPesertaPage({
    searchParams
}: {
    searchParams: Promise<{
        search?: string
        page?: string
        banned?: "false" | "true"
    }>
}) {

    const daftarPeserta = await getAllPesertaAction({
        search: (await searchParams).search,
        page: (await searchParams).page,
        banned: (await searchParams).banned
    });

    return (
        <KelolaPesertaView
            daftarPeserta={daftarPeserta.data}
            totalDaftarPeserta={0}
            newMessage={(await cookies()).get("flash")?.value} />
    )
}