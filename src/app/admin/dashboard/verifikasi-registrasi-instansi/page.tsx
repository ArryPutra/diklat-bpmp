"use server"

import { getAllRegistrasiInstansiAction } from "@/actions/registrasi-instansi-action"
import prisma from "@/lib/prisma"
import AdminDashboardVerifikasiRegistrasiInstansiView from "./view"

type AdminDashboardVerifikasiRegistrasiInstansiPageProps = {
    searchParams: Promise<{
        search?: string
        page?: string
        status?: string
    }>
}

export default async function AdminDashboardVerifikasiRegistrasiInstansiPage({
    searchParams
}: AdminDashboardVerifikasiRegistrasiInstansiPageProps) {
    const searchQuery = await searchParams;

    const daftarRegistrasiInstansi =
        await getAllRegistrasiInstansiAction({
            page: searchQuery.page,
            search: searchQuery.search,
            statusRegistrasiInstansiId: parseInt(searchQuery.status ?? "1"),
        });

    const dataStatistik = {
        totalDiklat: await prisma.diklat.count(),
        totalInstansi: await prisma.instansi.count(),
        totalPeserta: await prisma.peserta.count(),
        totalNarasumber: 0
    }

    return (
        <AdminDashboardVerifikasiRegistrasiInstansiView
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
