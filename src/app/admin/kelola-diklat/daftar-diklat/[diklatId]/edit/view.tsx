"use client"

import { updateDiklatAction } from "@/actions/diklat-action";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useActionState } from "react";
import { BiRightArrowAlt } from "react-icons/bi";
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
            {
                !isMateriDiklatExist &&
                <Alert variant='danger'>
                    <AlertTitle>Pesan:</AlertTitle>
                    <AlertDescription>Saat ini materi kosong, silahkan masukkan materi terlebih dahulu.</AlertDescription>
                    <Link href={`/admin/kelola-diklat/daftar-diklat/${diklat.id}/materi`} className="w-fit">
                        <Button variant='outline' size='sm' className="w-fit mt-2">
                            Tambah Materi <BiRightArrowAlt />
                        </Button>
                    </Link>
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
