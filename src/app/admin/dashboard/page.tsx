"use server"

import prisma from "@/lib/prisma";
import ButtonNav from "./components/button-nav";
import StatsCards from "./components/stats-cards";
import VerifikasiPesertaDiklatServer from "./content/verifikasi-peserta-diklat/server";
import VerifikasiRegistrasiInstansiServer from "./content/verifikasi-registrasi-instansi/server";

export default async function AdminDashboardPage({
    searchParams
}: {
    searchParams: Promise<{
        search?: string
        page?: string
        status?: string
        content?: string
    }>
}) {
    const _searchParams = await searchParams;

    const dataStatistik = {
        totalDiklat: await prisma.diklat.count(),
        totalInstansi: await prisma.instansi.count(),
        totalPeserta: await prisma.peserta.count(),
        totalNarasumber: await prisma.narasumber.count(),
    }

    return (
        <>
            <StatsCards dataStatistik={{
                totalDiklat: dataStatistik.totalDiklat,
                totalInstansi: dataStatistik.totalInstansi,
                totalPeserta: dataStatistik.totalPeserta,
                totalNarasumber: dataStatistik.totalNarasumber
            }} />

            <ButtonNav />

            {
                (_searchParams.content === 'verifikasi-registrasi-instansi' || _searchParams.content === undefined) &&
                <VerifikasiRegistrasiInstansiServer searchQuery={_searchParams} />
            }
            {
                _searchParams.content === 'verifikasi-peserta-diklat' &&
                <VerifikasiPesertaDiklatServer searchQuery={_searchParams} />
            }
        </>
    )
}
