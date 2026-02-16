"use client"

import { updateDiklatAction } from "@/actions/diklat-action";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useActionState } from "react";
import KelolaDiklatForm from "../../components/kelola-diklat-form";

export default function KelolaDiklatEditView({
    daftarMetodeDiklat,
    diklat,
    isMateriDiklatExist
}: {
    daftarMetodeDiklat: any[]
    diklat: any
    isMateriDiklatExist: boolean
}) {
    const [state, formAction, pending] =
        useActionState(updateDiklatAction.bind(null, diklat.id), null);

    return (
        <>
            <div className="flex gap-3 flex-wrap">
                <Button>Umum</Button>
                <Link href={`/admin/kelola-diklat/daftar-diklat/${diklat.id}/materi`}>
                    <Button variant='outline'>Materi</Button>
                </Link>
            </div>

            {
                !isMateriDiklatExist &&
                <Alert variant='destructive'>
                    <AlertTitle>Pesan:</AlertTitle>
                    <AlertDescription>Saat ini materi kosong, silahkan masukkan materi terlebih dahulu.</AlertDescription>
                </Alert>
            }

            <KelolaDiklatForm
                daftarMetodeDiklat={daftarMetodeDiklat}
                actionState={{
                    state: state,
                    formAction: formAction,
                    pending: pending
                }}
                diklat={diklat} />
        </>
    )
}
