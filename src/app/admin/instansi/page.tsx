"use server"

import prisma from '@/lib/prisma'
import AdminInstansiView from './view'

export default async function AdminInstansiPage() {
    const daftarRegistrasiInstansi =
        await prisma.registrasiInstansi.findMany();

    return (
        <AdminInstansiView
            daftarRegistrasiInstansi={
                daftarRegistrasiInstansi.map((item) => (
                    {
                        nama: item.nama,
                        email: item.email
                    })
                )
            } />
    )
}
