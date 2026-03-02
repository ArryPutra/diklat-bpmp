"use client"

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CardDescription, CardTitle } from "@/components/ui/card";
import { dateRangeFormatted } from "@/utils/dateFormatted";
import Link from "next/link";
import { BiCalendar, BiLocationPlus, BiNetworkChart, BiRightArrowAlt, BiSolidGraduation } from "react-icons/bi";

export default function InfoDiklatCard({ diklat }: { diklat: any }) {
    return (
        <div className="space-y-4">
            <div>
                <Badge className={`${diklat.statusPelaksanaanAcaraDiklat.backgroundColor}`}>{diklat.statusPelaksanaanAcaraDiklat.nama}</Badge>
                <CardTitle className="mt-3">{diklat.judul}</CardTitle>
                <CardDescription className='flex items-center gap-1 flex-wrap mt-1'><BiCalendar /> Pelaksanaan: {dateRangeFormatted(diklat.tanggalMulaiAcara, diklat.tanggalSelesaiAcara)}</CardDescription>
            </div>
            <div className='grid grid-cols-3 max-md:grid-cols-1 gap-4'>
                <div className='text-sm'>
                    <h1 className='flex gap-1 items-center text-gray-500 flex-wrap'><BiLocationPlus /> Lokasi:</h1>
                    <h1 className='font-semibold'>{diklat.lokasi}</h1>
                </div>
                <div className='text-sm'>
                    <h1 className='flex gap-1 items-center text-gray-500 flex-wrap'><BiNetworkChart /> Metode:</h1>
                    <Badge className={`${diklat.metodeDiklat.backgroundColor}`}>{diklat.metodeDiklat.nama}</Badge>
                </div>
                <div className="text-sm space-y-1">
                    <div className="flex items-center gap-1 text-gray-500">
                        <BiSolidGraduation />
                        <span>Syarat Kelulusan</span>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-medium">
                            {diklat.minimalKehadiranPersen}%
                        </span>
                        <span className="text-gray-400">•</span>
                        <span className="font-medium">
                            {Math.ceil(
                                diklat.materiDiklat.length *
                                (diklat.minimalKehadiranPersen / 100)
                            )} dari {diklat.materiDiklat.length} materi
                        </span>
                    </div>
                </div>
            </div>
            <div>
                <Link href={`/diklat/${diklat.id}`} target='_blank'>
                    <Button size='sm' variant='outline'>Postingan <BiRightArrowAlt /></Button>
                </Link>
            </div>
        </div>
    )
}
