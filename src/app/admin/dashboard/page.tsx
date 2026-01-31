"use server"

import prisma from '@/lib/prisma';
import AdminDashboardView from './view'

export default async function AdminDashboardPage() {
    const daftarRegistrasiInstansi =
        await prisma.registrasiInstansi.findMany({
            include: {
                statusRegistrasiInstansi: true,
                registrasiPicInstansi: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

    return (
        <AdminDashboardView
            dataStatistik={{ totalDiklat: 100, totalInstansi: 0, totalPeserta: 0, totalNarasumber: 0 }}
            daftarRegistrasiInstansi={daftarRegistrasiInstansi} />
    )
}
