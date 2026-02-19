"use server"

import { getDiklatAction } from "@/actions/diklat-action";
import { getAllMetodeDiklatAction } from "@/actions/metode-diklat";
import prisma from "@/lib/prisma";
import KelolaDiklatEditView from "./view";

export default async function KelolaDiklatEditPage({
    params
}: {
    params: Promise<{ diklatId: string }>
}) {
    const _params = await params

    const isMateriDiklatExist = await prisma.materiDiklat.count({
        where: {
            diklatId: _params.diklatId
        }
    }) > 0;

    return (
        <KelolaDiklatEditView
            daftarMetodeDiklat={await getAllMetodeDiklatAction()}
            diklat={await getDiklatAction(_params.diklatId)}
            isMateriDiklatExist={isMateriDiklatExist} />
    )
}
