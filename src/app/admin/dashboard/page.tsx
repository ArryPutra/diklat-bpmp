"use server"

import AdminDashboardView from './view'

export default async function AdminDashboardPage() {
    return (
        <AdminDashboardView
            dataStatistik={{ totalDiklat: 100, totalInstansi: 0, totalPeserta: 0, totalNarasumber: 0 }} />
    )
}
