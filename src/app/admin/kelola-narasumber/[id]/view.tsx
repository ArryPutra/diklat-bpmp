import DetailDataPage from "@/components/shared/layouts/detail-data-page";
import { formatDateTimeId } from "@/utils/dateFormatted";

export default function KelolaNarasumberDetailView({
    narasumber
}: {
    narasumber: any
}) {
    return (
        <DetailDataPage
            listData={[
                {
                    title: "Narasumber",
                    content: [
                        { label: "Nama Narasumber", value: narasumber.user.name },
                        { label: "Email", value: narasumber.user.email },
                        { label: "Nomor Telepon", value: narasumber.nomorTelepon },
                        { label: "Jenis Kelamin", value: narasumber.jenisKelamin },
                    ]
                },
                {
                    title: "Informasi Lainnya",
                    content: [
                        { label: 'Tanggal Dibuat', value: formatDateTimeId(narasumber.createdAt) },
                        { label: 'Tanggal Diperbarui', value: formatDateTimeId(narasumber.updatedAt) }
                    ]
                }
            ]} />
    )
}
