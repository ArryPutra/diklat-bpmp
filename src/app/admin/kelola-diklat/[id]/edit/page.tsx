"use server"

import { getDiklatByIdAction } from "@/actions/diklat-action";
import { getAllMetodeDiklatAction } from "@/actions/metode-diklat";
import KelolaDiklatEditView from "./view";

export default async function KelolaDiklatEditPage({
    params
}: {
    params: Promise<{ id: string }>
}) {
    const _params = await params

    return (
        <KelolaDiklatEditView
            daftarMetodeDiklat={await getAllMetodeDiklatAction()}
            diklat={await getDiklatByIdAction(_params.id)} />
    )
}
