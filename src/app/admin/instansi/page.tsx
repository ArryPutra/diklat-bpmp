"use server"

import prisma from '@/lib/prisma'
import AdminInstansiView from './view'

export default async function AdminInstansiPage() {
    const daftarRegistrasiInstansi =
        await prisma.user.findMany({
            where: {
                peranId: 2
            }
        });

    return (
        <AdminInstansiView
            daftarRegistrasiInstansi={
                daftarRegistrasiInstansi.map((item) => (
                    {
                        nama: item.name,
                        email: item.email
                    })
                )
            } />
    )
}
