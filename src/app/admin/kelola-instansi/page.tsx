"use server"

import { getAllInstansiAction } from '@/actions/instansi-action'
import { cookies } from 'next/headers'
import AdminInstansiView from './view'

export default async function AdminInstansiPage({
    searchParams
}: {
    searchParams: Promise<{
        banned?: "false" | "true"
        search?: string
        page?: string
    }>
}) {

    const daftarInstansi = await getAllInstansiAction({
        search: (await searchParams).search,
        banned: (await searchParams).banned,
        page: (await searchParams).page
    })

    return (
        <AdminInstansiView
            daftarInstansi={daftarInstansi.data}
            totalDaftarInstansi={daftarInstansi.total}
            newMessage={(await cookies()).get("flash")?.value} />
    )
}
