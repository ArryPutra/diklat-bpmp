"use server"

import { getDiklatByIdAction } from "@/actions/diklat-action";
import KelolaDiklatDetailView from "./view";

export default async function KelolaDiklatDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const _params = await params

    return (
        <KelolaDiklatDetailView
            diklat={await getDiklatByIdAction(_params.id)} />
    )
}
