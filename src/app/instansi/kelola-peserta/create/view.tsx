"use client"

import { createPesertaAction } from "@/actions/peserta-action";
import { useActionState } from "react";
import KelolaPesertaForm from "../components/kelola-peserta-form";

export default function KelolaPesertaCreateView() {
    const [state, formAction, pending] =
        useActionState(createPesertaAction, null);

    return (
        <KelolaPesertaForm
            actionState={{
                state: state,
                formAction: formAction,
                pending: pending
            }} />
    )
}
