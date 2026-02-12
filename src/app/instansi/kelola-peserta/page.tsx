"use server"

import { getCurrentUser } from "@/actions/auth-action";
import { getAllPesertaAction } from "@/actions/peserta-action";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import KelolaPesertaView from "./view";

export default async function InstansiPesertaPage({
    searchParams
}: {
    searchParams: Promise<{
        search?: string
        page?: string
        banned?: "false" | "true"
    }>
}) {

    const currentUser = await getCurrentUser({
        id: true,
    });

    const daftarPeserta = await getAllPesertaAction({
        search: (await searchParams).search,
        page: (await searchParams).page,
        banned: (await searchParams).banned,
        instansiId: await prisma.instansi.findUniqueOrThrow({ where: { userId: currentUser?.id } }).then(res => res.id)
    });

    return (
        <KelolaPesertaView
            daftarPeserta={daftarPeserta.data}
            totalDaftarPeserta={0}
            newMessage={(await cookies()).get("flash")?.value} />
    )
}