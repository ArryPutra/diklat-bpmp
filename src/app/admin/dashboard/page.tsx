"use server"

import { getAllRegistrasiInstansiAction } from '@/actions/registrasi-instansi-action';
import prisma from '@/lib/prisma';
import AdminDashboardView from './view';

type AdminDashboardViewProps = {
    searchParams: Promise<{
        search?: string
        page?: string
        status?: string
    }>
}

export default async function AdminDashboardPage({
    searchParams
}: AdminDashboardViewProps) {
    const searchQuery = await searchParams;

    const daftarRegistrasiInstansi =
        await getAllRegistrasiInstansiAction({
            page: searchQuery.page,
            search: searchQuery.search,
            statusRegistrasiInstansiId: parseInt(searchQuery.status ?? "1"),
        });

    const dataStatistik = {
        totalDiklat: 0,
        totalInstansi: await prisma.user.count({ where: { peranId: 2 } }),
        totalPeserta: 0,
        totalNarasumber: 0
    }

    return (
        <AdminDashboardView
            daftarRegistrasiInstansi={daftarRegistrasiInstansi.data}
            dataStatistik={{
                totalDiklat: dataStatistik.totalDiklat,
                totalInstansi: dataStatistik.totalInstansi,
                totalPeserta: dataStatistik.totalPeserta,
                totalNarasumber: dataStatistik.totalNarasumber
            }}
            totalDaftarRegistrasiInstansi={daftarRegistrasiInstansi.total}
        />
    )
}
