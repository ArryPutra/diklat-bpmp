"use server"

import { getDiklatAction } from "@/actions/diklat-action";
import KelolaDiklatDetailView from "./view";

export default async function KelolaDiklatDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const _params = await params

    return (
        <KelolaDiklatDetailView
            diklat={await getDiklatAction(_params.id)} />
    )
}
