"use server"

import { getCurrentUser } from '@/actions/auth-action'
import Profil_Layout from '@/components/layouts/profil-layout'

export default async function Peserta_Profil_Page() {
    const currentUser = await getCurrentUser()

    return (
        <Profil_Layout
            dataUser={{
                nama: currentUser?.name ?? '-',
                namaPeran: "Admin",
                createdAt: currentUser?.createdAt ?? '',
                updatedAt: currentUser?.updatedAt ?? '',
            }}
            fields={[
                { label: 'Nama Lengkap', value: currentUser?.name ?? '-' },
                { label: 'Email', value: currentUser?.email ?? '-' },
                { label: 'Peran', value: "Admin" },
            ]}
        />
    )
}
