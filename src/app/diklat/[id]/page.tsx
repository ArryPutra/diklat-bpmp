"use server"

import { getDiklatByIdAction } from "@/actions/diklat-action";
import DiklatView from "./view";

export default async function DiklatPage({
    params
}: {
    params: Promise<{ id: string }>
}) {

    const _params = await params

    const diklat = await getDiklatByIdAction(_params.id)

    console.log(diklat)

    return (
        <DiklatView
            diklat={diklat} />
    )
}
