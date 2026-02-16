"use server"

import { getDiklatAction } from "@/actions/diklat-action";
import { getAllMetodeDiklatAction } from "@/actions/metode-diklat";
import prisma from "@/lib/prisma";
import KelolaDiklatEditView from "./view";

export default async function KelolaDiklatEditPage({
    params
}: {
    params: Promise<{ id: string }>
}) {
    const _params = await params

    const isMateriDiklatExist = await prisma.materiDiklat.count({
        where: {
            diklatId: _params.id
        }
    }) > 0;

    return (
        <KelolaDiklatEditView
            daftarMetodeDiklat={await getAllMetodeDiklatAction()}
            diklat={await getDiklatAction(_params.id)}
            isMateriDiklatExist={isMateriDiklatExist} />
    )
}
