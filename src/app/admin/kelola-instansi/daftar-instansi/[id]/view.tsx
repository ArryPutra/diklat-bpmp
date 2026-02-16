import DetailDataPage from "@/components/shared/layouts/detail-data-page";

export default function KelolaInstansiView({
    instansi
}: {
    instansi: any
}) {
    return (
        <DetailDataPage
            listData={[
                {
                    title: "Instansi",
                    content: [
                        { label: "Nama Instansi", value: instansi.user.name },
                        { label: "Email", value: instansi.user.email },
                        { label: "Nomor Telepon", value: instansi.nomorTelepon },
                        { label: "Desa/Kelurahan", value: instansi.desaKelurahan },
                        { label: "Kecamatan", value: instansi.kecamatan },
                        { label: "Kabupaten/Kota", value: instansi.kabupatenKota },
                        { label: "Alamat", value: instansi.alamat },
                    ]
                },
                {
                    title: "PIC Instansi",
                    content: [
                        { label: 'Nama PIC', value: instansi.picInstansi.nama },
                        { label: 'Email PIC', value: instansi.picInstansi.email },
                        { label: 'Nomor Telepon', value: instansi.picInstansi.nomorTelepon },
                        { label: 'Jabatan', value: instansi.picInstansi.jabatan }
                    ]
                }
            ]} />
    )
}
