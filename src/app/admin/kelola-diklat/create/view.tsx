"use client"


import { createDiklatAction } from "@/actions/diklat-action";
import { useActionState } from "react";
import KelolaDiklatForm from "../components/kelola-diklat-form";

export default function KelolaDiklatCreateView({
    daftarMetodeDiklat
}: {
    daftarMetodeDiklat: any[]
}) {
    const [state, formAction, pending] = useActionState(createDiklatAction, null);

    return (
        <KelolaDiklatForm
            daftarMetodeDiklat={daftarMetodeDiklat}
            actionState={{
                state: state,
                formAction: formAction,
                pending: pending
            }} />
    )
}
