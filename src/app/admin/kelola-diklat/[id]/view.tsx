"use client"

import DetailDataPage from "@/components/shared/layouts/detail-data-page"
import { Badge } from "@/components/ui/badge"
import dateFormatted from "@/utils/dateFormatted"

export default function KelolaDiklatDetailView({
    diklat
}: {
    diklat: any
}) {
    return (
        <DetailDataPage
            listData={[
                {
                    title: "Detail Diklat",
                    content: [
                        { label: "Judul", value: diklat.judul },
                        { label: "Deskripsi", value: diklat.deskripsi },
                        { label: "Metode Diklat", value: <Badge className={`${diklat.metodeDiklat?.backgroundColor}`}>{diklat.metodeDiklat?.nama}</Badge> },
                        { label: "Tujuan", value: diklat.tujuan },
                        { label: "Target/Sasaran", value: diklat.targetSasaran },
                        { label: "Maksimal Kuota", value: diklat.maksimalKuota },
                        { label: "Tanggal Mulai Acara", value: dateFormatted(diklat.tanggalMulaiAcara) },
                        { label: "Tanggal Selesai Acara", value: dateFormatted(diklat.tanggalSelesaiAcara) },
                        { label: "Tanggal Buka Pendaftaran", value: dateFormatted(diklat.tanggalBukaPendaftaran) },
                        { label: "Tanggal Tutup Pendaftaran", value: dateFormatted(diklat.tanggalTutupPendaftaran) },
                    ]
                }
            ]} />
    )
}
