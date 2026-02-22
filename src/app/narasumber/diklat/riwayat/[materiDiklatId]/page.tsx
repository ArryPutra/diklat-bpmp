"use server"

import { ContentCanvas } from "@/components/layouts/auth-layout";
import BackButton from "@/components/shared/back-button";
import { Badge } from "@/components/ui/badge";
import { notFound } from "next/navigation";
import MateriDiklatNarasumberDetailView from "../../components/materi-diklat-narasumber-detail-view";
import { getNarasumberMateriDetailData } from "../../materi-detail-data";

export default async function Narasumber_KelolaMateriDiklatRiwayat_Page({
    params
}: {
    params: Promise<{
        materiDiklatId: string
    }>
}) {
    const _params = await params
    const materiDiklatId = Number(_params.materiDiklatId)

    if (Number.isNaN(materiDiklatId)) {
        notFound()
    }

    const {
        materiDiklat,
        statusAbsensiPesertaDiklat,
        totalAbsensiStatus,
    } = await getNarasumberMateriDetailData(materiDiklatId)

    const diklat = materiDiklat.diklat ?? notFound()

    if (diklat.statusPelaksanaanAcaraDiklatId !== 3) {
        return (
            <ContentCanvas>
                <BackButton />
                <div className='space-y-4'>
                    <Badge className='w-fit mb-2'>Materi Bukan Riwayat</Badge>
                    <h1 className='text-xl font-semibold'>Materi Diklat Belum Selesai</h1>
                    <p className='text-sm text-slate-500'>
                        Halaman riwayat hanya menampilkan materi dari diklat yang sudah selesai.
                    </p>
                </div>
            </ContentCanvas>
        )
    }

    return (
        <MateriDiklatNarasumberDetailView
            materi={materiDiklat}
            statusAbsensiPesertaDiklat={statusAbsensiPesertaDiklat}
            totalAbsensiStatus={totalAbsensiStatus}
            isReadOnlyAbsensi
            readOnlyMessage='Diklat sudah selesai, absensi tidak dapat diubah lagi.' />
    )
}
