"use server"

import ListDiklatNarasumberCard from "../components/list-diklat-narasumber-card";
import { getDaftarDiklatNarasumber } from "../data";

export default async function Narasumber_DiklatSaya_Page() {
    const daftarDiklatAktifSaya = await getDaftarDiklatNarasumber([1, 2])

    return (
        <ListDiklatNarasumberCard
            daftarDiklatSaya={daftarDiklatAktifSaya}
            title="Diklat Aktif Saya"
            description="Berikut adalah daftar diklat yang sedang aktif dan Anda ikuti sebagai narasumber."
            emptyTitle="Tidak Ada Diklat Aktif"
            emptyDescription="Anda belum mengikuti diklat aktif apapun."
            detailBasePath="/narasumber/diklat/aktif"
        />
    )
}
