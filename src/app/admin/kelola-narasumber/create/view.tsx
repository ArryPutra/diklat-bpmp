"use client"

import { createNarasumberAction } from "@/actions/narasumber-action";
import { useActionState } from "react";
import KelolaNarasumberForm from "../components/kelola-narasumber-form";

export default function KelolaNarasumberCreateView() {
    const [state, formAction, pending] = useActionState(createNarasumberAction, null);

    return (
        <KelolaNarasumberForm
            actionState={{
                state: state,
                formAction: formAction,
                pending: pending
            }} />
    )
}
