"use server"

import { getCurrentNarasumber } from "@/actions/narasumber-action";
import Profil_Layout from "@/components/layouts/profil-layout";

export default async function Narasumber_Profil_Page() {
    const currentNarasumber = await getCurrentNarasumber()

    return (
        <Profil_Layout
            dataUser={{
                nama: currentNarasumber?.user?.name ?? '-',
                namaPeran: "Narasumber",
                createdAt: currentNarasumber?.createdAt ?? '',
                updatedAt: currentNarasumber?.updatedAt ?? '',
            }}
            fields={
                [
                    {label: 'Nama Lengkap', value: currentNarasumber?.user?.name ?? '-'},
                    {label: 'Email', value: currentNarasumber?.user?.email ?? '-'},
                    {label: 'Peran', value: "Narasumber"},
                    {label: 'No. Telepon', value: currentNarasumber?.nomorTelepon ?? '-'},
                ]
            }/>
    )
}
