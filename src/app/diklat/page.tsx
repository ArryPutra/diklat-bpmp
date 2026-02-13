"use server"

import { getAllDiklatAction } from "@/actions/diklat-action";
import CariDiklatView from "./view";

export default async function CariDiklatPage({
    searchParams
}: {
    searchParams: Promise<{
        search?: string
        page?: string
    }>
}) {
    const daftarDiklat = await getAllDiklatAction({
        page: (await searchParams).page,
        search: (await searchParams).search,
        statusPendaftaranDiklatId: [1, 2]
    });

    return (
        <CariDiklatView
            daftarDiklat={daftarDiklat.data}
            totalDaftarDiklat={daftarDiklat.total} />
    )
}