"use client"

import DetailDataPage from "@/components/shared/layouts/detail-data-page";
import { formatDateId } from "@/utils/dateFormatted";

export default function KelolaPesertaDetailView({
    peserta
}: {
    peserta: any
}) {
    return (
        <DetailDataPage
            listData={[
                {
                    title: "Data Peserta",
                    content: [
                        { label: "Nama Peserta", value: peserta.user.name },
                        { label: "Email", value: peserta.user.email },
                        { label: "Nomor Telepon", value: peserta.nomorTelepon },
                        { label: "Nomor Induk Kependudukan", value: peserta.nik },
                        { label: "Jabatan", value: peserta.jabatan },
                        { label: "Jenis Kelamin", value: peserta.jenisKelamin },
                        { label: "Tempat Lahir", value: peserta.tempatLahir },
                        { label: "Tanggal Lahir", value: formatDateId(peserta.tanggalLahir) },
                        { label: "Alamat", value: peserta.alamat },
                    ]
                },
                {
                    title: "Informasi Lainnya",
                    content: [
                        { label: "Tanggal Dibuat", value: formatDateId(peserta.createdAt) },
                        { label: "Tanggal Diperbarui", value: formatDateId(peserta.updatedAt) },
                    ]
                }
            ]} />
    )
}
