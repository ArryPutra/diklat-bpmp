"use client"

import { updatePesertaAction } from "@/actions/peserta-action";
import { useActionState } from "react";
import KelolaPesertaForm from "../../components/kelola-peserta-form";

export default function KelolaPesertaEditView({
    peserta
}: {
    peserta: any
}) {
    const [state, formAction, pending] =
        useActionState(updatePesertaAction.bind(null, peserta.id), null);

    return (
        <KelolaPesertaForm
            actionState={{
                state: state,
                formAction: formAction,
                pending: pending
            }}
            peserta={peserta} />
    )
}
