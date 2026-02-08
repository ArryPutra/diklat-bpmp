"use client"

import DetailDataPage from "@/components/shared/layouts/detail-data-page"
import { Badge } from "@/components/ui/badge"
import { formatDateId } from "@/utils/dateFormatted"

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
                        { label: "Status Pendaftaran", value: <Badge className={`${diklat.statusPendaftaranDiklat?.backgroundColor}`}>{diklat.statusPendaftaranDiklat?.nama}</Badge> },
                        { label: "Tujuan", value: diklat.tujuan },
                        { label: "Target/Sasaran", value: diklat.targetSasaran },
                        { label: "Maksimal Kuota", value: diklat.maksimalKuota },
                        { label: "Lokasi", value: diklat.lokasi },
                        { label: "Tanggal Mulai Acara", value: formatDateId(diklat.tanggalMulaiAcara) },
                        { label: "Tanggal Selesai Acara", value: formatDateId(diklat.tanggalSelesaiAcara) },
                        { label: "Tanggal Buka Pendaftaran", value: formatDateId(diklat.tanggalBukaPendaftaran) },
                        { label: "Tanggal Tutup Pendaftaran", value: formatDateId(diklat.tanggalTutupPendaftaran) },
                    ]
                }
            ]} />
    )
}
