"use client"

import { updateNarasumberAction } from "@/actions/narasumber-action";
import { useActionState } from "react";
import KelolaNarasumberForm from "../../components/kelola-narasumber-form";

export default function KelolaNarasumberEditView({
    narasumber
}: {
    narasumber: any
}) {
    const [state, formAction, pending] =
        useActionState(updateNarasumberAction.bind(null, narasumber.id), null);

    return (
        <KelolaNarasumberForm
            actionState={{
                state: state,
                formAction: formAction,
                pending: pending
            }}
            narasumber={narasumber} />
    )
}
