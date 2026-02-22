"use server"

import { ContentCanvas } from "@/components/layouts/auth-layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CardDescription, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import prisma from "@/lib/prisma";
import { dateRangeFormatted } from "@/utils/dateFormatted";
import Link from "next/link";
import { BiCalendar, BiLocationPlus, BiNetworkChart, BiRightArrowAlt, BiSolidGraduation } from "react-icons/bi";

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

            <div className="space-y-4">
                <div>
                    <Badge className={`${diklat.statusPelaksanaanAcaraDiklat.backgroundColor}`}>{diklat.statusPelaksanaanAcaraDiklat.nama}</Badge>
                    <CardTitle className="mt-3">{diklat.judul}</CardTitle>
                    <CardDescription className='flex items-center gap-1 flex-wrap mt-1'><BiCalendar /> Pelaksanaan: {dateRangeFormatted(diklat.tanggalMulaiAcara, diklat.tanggalSelesaiAcara)}</CardDescription>
                </div>
                <div className='grid grid-cols-2 max-md:grid-cols-1 gap-4'>
                    <div className='text-sm'>
                        <h1 className='flex gap-1 items-center text-gray-500 flex-wrap'><BiLocationPlus /> Lokasi:</h1>
                        <h1 className='font-semibold'>{diklat.lokasi}</h1>
                    </div>
                    <div className='text-sm'>
                        <h1 className='flex gap-1 items-center text-gray-500 flex-wrap'><BiNetworkChart /> Metode:</h1>
                        <Badge className={`${diklat.metodeDiklat.backgroundColor}`}>{diklat.metodeDiklat.nama}</Badge>
                    </div>
                    <div className='text-sm'>
                        <h1 className='flex gap-1 items-center text-gray-500 flex-wrap'><BiSolidGraduation /> Syarat Kelulusan:</h1>
                        <h1 className="font-semibold">Kehadiran {diklat.minimalKehadiranPersen.toString()}%
                            atau {Math.ceil(
                                diklat.materiDiklat.length * (diklat.minimalKehadiranPersen / 100)
                            )} kehadiran
                        </h1>
                    </div>
                </div>
                <div>
                    <Link href={`/diklat/${diklat.id}`} target='_blank'>
                        <Button size='sm' variant='outline'>Postingan <BiRightArrowAlt /></Button>
                    </Link>
                </div>
            </div>

            <Separator />

            {children}
        </ContentCanvas>
    )
}
