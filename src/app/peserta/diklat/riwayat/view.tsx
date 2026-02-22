"use client"

import PesertaDiklatList, { DiklatPesertaItem } from "@/app/peserta/diklat/components/peserta-diklat-list"
import { ContentCanvas } from "@/components/layouts/auth-layout"

export default function Peserta_DiklatRiwayat_View({
    daftarDiklatRiwayatDiikuti,
}: {
    daftarDiklatRiwayatDiikuti: DiklatPesertaItem[]
}) {
    return (
        <ContentCanvas>
            <div>
                <h1 className="font-semibold">Riwayat Diklat Saya</h1>
                <p className="text-sm text-gray-500">
                    Daftar diklat yang sudah selesai Anda ikuti.
                </p>
            </div>

            <PesertaDiklatList
                daftarDiklat={daftarDiklatRiwayatDiikuti}
                detailBasePath="/peserta/diklat/riwayat"
                emptyTitle="Belum ada riwayat diklat."
                emptyDescription="Riwayat akan muncul saat diklat yang Anda ikuti sudah selesai." />
        </ContentCanvas>
    )
}
