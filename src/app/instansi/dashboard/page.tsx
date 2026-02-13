"use server"

import { getAllDiklatAction } from "@/actions/diklat-action";
import { getCurrentInstansi } from "@/actions/instansi-action";
import DaftarDiklatDiikutiServer from "./content/diklat/daftar-diklat-diikuti/server";

export default async function InstansiDashboardPage({
    searchParams
}: {
    searchParams: Promise<{
        content: string
        diklatId?: string
    }>
}) {

    const _searchParams = await searchParams

    if (
        !_searchParams.content || _searchParams.content === 'diklat'
    ) {
        const currentInstansi = await getCurrentInstansi()
        const daftarDiklatDiikuti = await getAllDiklatAction({
            where: {
                pesertaDiklat: {
                    some: {
                        peserta: {
                            instansiId: currentInstansi.id
                        }
                    }
                }
            }
        })

        return (
            <DaftarDiklatDiikutiServer
                daftarDiklatDiikuti={daftarDiklatDiikuti.data}
                diklatId={_searchParams.diklatId} />
        )
    }
}
