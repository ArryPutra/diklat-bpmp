"use server"

import { getPesertaAction } from "@/actions/peserta-action";
import KelolaPesertaEditView from "./view";

export default async function KelolaPesertaEditPage({
    params
}: {
    params: Promise<{ id: string }>
}) {
    const _params = await params

    return (
        <KelolaPesertaEditView
            peserta={await getPesertaAction(parseInt(_params.id))} />
    )
}
