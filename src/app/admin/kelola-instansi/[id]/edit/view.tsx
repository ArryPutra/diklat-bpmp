"use client"

import { updateInstansiAction } from "@/actions/instansi-action";
import { useActionState } from "react";
import KelolaInstansiForm from "../../components/kelola-instansi-form";

export default function KelolaInstansiEditView({
    instansi
}: {
    instansi: any
}) {
    const [state, formAction, pending] =
        useActionState(updateInstansiAction.bind(null, instansi.id), null);

    return (
        <KelolaInstansiForm
            actionState={{
                state: state,
                formAction: formAction,
                pending: pending
            }}
            instansi={instansi} />
    )
}
