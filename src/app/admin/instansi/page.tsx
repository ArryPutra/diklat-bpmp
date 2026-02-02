"use server"

import prisma from '@/lib/prisma'
import AdminInstansiView from './view'
import { getAllInstansiAction } from '@/actions/instansi-action'

type AdminInstansiPageProps = {
    searchParams: Promise<{
        apakahNonaktif?: "false" | "true"
        search?: string
        page?: string
    }>
}

export default async function AdminInstansiPage({ searchParams }: AdminInstansiPageProps) {
    const daftarInstansi = await getAllInstansiAction({
        search: (await searchParams).search,
        apakahNonaktif: (await searchParams).apakahNonaktif,
        page: (await searchParams).page
    })

    return (
        <AdminInstansiView
            daftarInstansi={daftarInstansi.data}
            totalDaftarInstansi={daftarInstansi.total} />
    )
}
