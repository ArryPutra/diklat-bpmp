"use server"

import { getPesertaAction } from "@/actions/peserta-action"
import KelolaPesertaDetailView from "./view"


export default async function KelolaPesertaDetailPage({
    params
}: {
    params: Promise<{ id: string }>
}) {
    const _params = await params

    return (
        <KelolaPesertaDetailView
            peserta={await getPesertaAction(parseInt(_params.id))} />
    )
}
