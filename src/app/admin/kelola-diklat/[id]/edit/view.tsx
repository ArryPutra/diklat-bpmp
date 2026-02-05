"use client"

import { updateDiklatAction } from "@/actions/diklat-action";
import { useActionState } from "react";
import KelolaDiklatForm from "../../components/kelola-diklat-form";

export default function KelolaDiklatEditView({
    daftarMetodeDiklat,
    diklat
}: {
    daftarMetodeDiklat: any[]
    diklat: any
}) {
    const [state, formAction, pending] =
        useActionState(updateDiklatAction.bind(null, diklat.id), null);

    return (
        <KelolaDiklatForm
            daftarMetodeDiklat={daftarMetodeDiklat}
            actionState={{
                state: state,
                formAction: formAction,
                pending: pending
            }}
            diklat={diklat} />
    )
}
