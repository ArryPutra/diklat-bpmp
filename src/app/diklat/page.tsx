"use server"

import { getAllDiklatAction } from "@/actions/diklat-action";
import CariDiklatView from "./view";

export default async function CariDiklatPage() {
    const daftarDiklat = await getAllDiklatAction({
        statusPendaftaranDiklatId: [1, 2]
    });

    return (
        <CariDiklatView
            daftarDiklat={daftarDiklat.data} />
    )
}