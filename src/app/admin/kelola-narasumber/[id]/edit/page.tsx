"use server"

import { getNarasumberAction } from "@/actions/narasumber-action";
import KelolaNarasumberEditView from "./view";

export default async function KelolaNarasumberEditPage({
    params
}: {
    params: Promise<{ id: string }>
}) {
    const _params = await params

    return (
        <KelolaNarasumberEditView
            narasumber={await getNarasumberAction(Number(_params.id))} />
    )
}
