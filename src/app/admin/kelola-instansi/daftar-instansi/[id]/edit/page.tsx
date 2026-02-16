"use server"

import { getInstansiAction } from "@/actions/instansi-action";
import KelolaInstansiEditView from "./view";

export default async function KelolaDiklatEditPage({
    params
}: {
    params: Promise<{ id: string }>
}) {
    const _params = await params

    return (
        <KelolaInstansiEditView
            instansi={await getInstansiAction(parseInt(_params.id))} />
    )
}
