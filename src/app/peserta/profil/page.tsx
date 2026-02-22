"use server"

import { getCurrentPeserta } from '@/actions/peserta-action'
import Profil_Layout from '@/components/layouts/profil-layout'

export default async function Peserta_Profil_Page() {
    const currentPeserta = await getCurrentPeserta()

    return (
        <Profil_Layout
            dataUser={{
                nama: currentPeserta?.user?.name ?? '-',
                namaPeran: "Peserta",
                createdAt: currentPeserta?.createdAt ?? '',
                updatedAt: currentPeserta?.updatedAt ?? '',
            }}
            fields={[
                { label: 'Nama Lengkap', value: currentPeserta?.user?.name ?? '-' },
                { label: 'Email', value: currentPeserta?.user?.email ?? '-' },
                { label: 'Peran', value: "Peserta" },
                { label: 'No. Telepon', value: currentPeserta?.nomorTelepon ?? '-' },
                { label: 'Instansi', value: currentPeserta?.instansi?.user?.name ?? '-' },
                { label: 'Alamat', value: currentPeserta?.alamat ?? '-' },
            ]}
        />
    )
}
