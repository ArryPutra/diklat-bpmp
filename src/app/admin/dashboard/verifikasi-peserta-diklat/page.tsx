"use server"

import prisma from '@/lib/prisma';
import AdminDashboardVerifikasiPesertaDiklatView from './view';

type AdminDashboardVerifikasiPesertaDiklatPageProps = {
    searchParams: Promise<{
        search?: string
        page?: string
    }>
}

export default async function AdminDashboardVerifikasiPesertaDiklatPage({
    searchParams
}: AdminDashboardVerifikasiPesertaDiklatPageProps) {
    const searchQuery = await searchParams;

    const dataStatistik = {
        totalDiklat: await prisma.diklat.count(),
        totalInstansi: await prisma.instansi.count(),
        totalPeserta: await prisma.peserta.count(),
        totalNarasumber: 0
    }

    return (
        <AdminDashboardVerifikasiPesertaDiklatView
            dataStatistik={{
                totalDiklat: dataStatistik.totalDiklat,
                totalInstansi: dataStatistik.totalInstansi,
                totalPeserta: dataStatistik.totalPeserta,
                totalNarasumber: dataStatistik.totalNarasumber
            }}
        />
    )
}
