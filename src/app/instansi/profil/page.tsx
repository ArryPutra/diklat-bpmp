"use server"

import { getCurrentUser } from '@/actions/auth-action'
import { getCurrentInstansi } from '@/actions/instansi-action'
import Profil_Layout from '@/components/layouts/profil-layout'

export default async function Instansi_Profil_Page() {
    const currentUser = await getCurrentUser()
    const currentInstansi = await getCurrentInstansi()

    return (
        <Profil_Layout
            dataUser={{
                nama: currentUser?.name ?? '-',
                namaPeran: "Instansi",
                createdAt: currentUser?.createdAt,
                updatedAt: currentUser?.updatedAt,
            }}
            fields={[
                { label: 'Nama Instansi', value: currentInstansi?.registrasiInstansi?.nama ?? '-' },
                { label: 'Email', value: currentUser?.email ?? '-' },
                { label: 'No. Telepon', value: currentInstansi?.nomorTelepon ?? '-' },
                { label: 'Desa/Kelurahan', value: currentInstansi?.desaKelurahan ?? '-' },
                { label: 'Kecamatan', value: currentInstansi?.kecamatan ?? '-' },
                { label: 'Kabupaten/Kota', value: currentInstansi?.kabupatenKota ?? '-' },
                { label: 'Alamat', value: currentInstansi?.alamat ?? '-' },
            ]}
        />
    )
}
