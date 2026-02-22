"use client"

import PesertaDiklatList, { DiklatPesertaItem } from "@/app/peserta/diklat/components/peserta-diklat-list"
import { ContentCanvas } from "@/components/layouts/auth-layout"

export default function Peserta_DiklatAktif_View({
    daftarDiklatAktifDiikuti,
}: {
    daftarDiklatAktifDiikuti: DiklatPesertaItem[]
}) {
    return (
        <ContentCanvas>
            <div>
                <h1 className="font-semibold">Diklat Aktif Saya</h1>
                <p className="text-sm text-gray-500">
                    Daftar diklat yang sedang Anda ikuti dan belum berakhir.
                </p>
            </div>

            <PesertaDiklatList
                daftarDiklat={daftarDiklatAktifDiikuti}
                detailBasePath="/peserta/diklat/aktif"
                emptyTitle="Belum ada diklat aktif yang Anda ikuti."
                emptyDescription="Daftar akan tampil saat Anda terdaftar pada diklat aktif." />
        </ContentCanvas>
    )
}
