"use server"

import { getNarasumberAction } from "@/actions/narasumber-action";
import KelolaNarasumberDetailView from "./view";

export default async function KelolaNarasumberDetailPage({
    params
}: {
    params: Promise<{ id: string }>
}) {
    const _params = await params

    console.log(await getNarasumberAction(Number(_params.id)))

    return (
        <KelolaNarasumberDetailView
            narasumber={await getNarasumberAction(Number(_params.id))} />
    )
}
