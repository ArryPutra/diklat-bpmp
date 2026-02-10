"use server"

import { getCurrentUser } from "@/actions/auth-action";
import { getDiklatByIdAction } from "@/actions/diklat-action";
import prisma from "@/lib/prisma";
import DiklatView from "./view";

export default async function DiklatPage({
    params
}: {
    params: Promise<{ id: string }>
}) {

    const _params = await params

    const diklat = await getDiklatByIdAction(_params.id)
    const user = await getCurrentUser()

    const isInstansi = user?.peranId === 2

    let daftarPeserta: any[] = []

    if (isInstansi) {
        const instansi = await prisma.instansi.findUniqueOrThrow({ where: { userId: user.id } })
        daftarPeserta = await prisma.peserta.findMany({
            where: {
                instansiId: instansi.id
            },
            include: {
                user: true
            }
        })
    }

    console.log(daftarPeserta)

    return (
        <DiklatView
            diklat={diklat}
            isInstansi={isInstansi}
            daftarPeserta={daftarPeserta} />
    )
}
