"use server"

import { ContentCanvas } from "@/components/layouts/auth-layout";
import InfoDiklatCard from "@/components/shared/cards/info-diklat-card";
import { Separator } from "@/components/ui/separator";
import prisma from "@/lib/prisma";

export default async function Peserta_Diklat_Layout({
    params,
    children
}: {
    params: Promise<{
        diklatId: string,
    }>
    children: React.ReactNode
}) {

    const _params = await params

    const diklat: any = await prisma.diklat.findUnique({
        where: {
            id: _params.diklatId
        },
        include: {
            metodeDiklat: true,
            materiDiklat: true,
            statusPelaksanaanAcaraDiklat: true
        }
    })

    return (
        <ContentCanvas>
            <div>
                <h1 className='font-bold'>Detail Diklat</h1>
                <h1 className='text-sm text-gray-500'>Ringkasan informasi diklat, agenda materi, serta rekap hasil akhir Anda.</h1>
            </div>

            <InfoDiklatCard diklat={diklat} />

            <Separator />

            {children}
        </ContentCanvas>
    )
}
