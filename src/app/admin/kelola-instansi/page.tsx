"use server"

import { getAllInstansiAction } from '@/actions/instansi-action'
import AdminInstansiView from './view'

type AdminInstansiPageProps = {
    searchParams: Promise<{
        apakahNonaktif?: "false" | "true"
        search?: string
        page?: string
    }>
}

export default async function AdminInstansiPage({
    searchParams
}: {
    searchParams: Promise<{
        apakahNonaktif?: "false" | "true"
        search?: string
        page?: string
    }>
}) {

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
