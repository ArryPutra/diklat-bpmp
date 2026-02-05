"use server"

import { getInstansiById } from "@/actions/instansi-action";
import KelolaInstansiView from "./view";

export default async function KelolaInstansiPage({
    params
}: {
    params: Promise<{ id: string }>
}) {
    const _params = await params

    return (
        <KelolaInstansiView
            instansi={await getInstansiById(parseInt(_params.id))} />
    )
}
