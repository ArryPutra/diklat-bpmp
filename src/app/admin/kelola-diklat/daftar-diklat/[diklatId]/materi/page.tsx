"use server"

import { getAllMateriDiklatAction } from "@/actions/materi-diklat-action";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import Admin_DaftarDiklatMateri_View from "./view";

export default async function Admin_DaftarDiklatMateri_Page({
    params
}: {
    params: Promise<{ diklatId: string }>
}
) {
    const _params = await params

    const daftarNarasumber = await prisma.narasumber.findMany({
        select: {
            id: true,
            user: {
                select: {
                    name: true
                }
            }
        }
    })

    return (
        <Admin_DaftarDiklatMateri_View
            diklatId={_params.diklatId}
            daftarNarasumber={daftarNarasumber}
            daftarMateriDiklat={await getAllMateriDiklatAction({
                diklatId: _params.diklatId,
            })}
            newMessage={(await cookies()).get("flash")?.value} />
    )
}
