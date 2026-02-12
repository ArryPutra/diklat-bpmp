"use client"

import { Footer, Header } from "@/app/view";
import GuestLayout from "@/components/layouts/guest-layout";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DaftarPesertaTabsContent from "./components/daftar-peserta-tabs-content";
import DetailDiklatTabsContent from "./components/detail-diklat-tabs-content";

export default function DiklatView({
    diklat,
    isInstansi,
    daftarPesertaDariInstansi,
    daftarPesertaDiklat
}: {
    diklat: any
    isInstansi: boolean
    daftarPesertaDariInstansi: any[]
    daftarPesertaDiklat: any[]
}) {

    return (
        <div className="min-h-screen flex flex-col">
            <Header activeMenuLabel="Diklat" />
            <GuestLayout className="pt-40 max-md:pt-36">
                <Badge className={`mb-2 ${diklat.statusPendaftaranDiklat.backgroundColor}`}>
                    {diklat.statusPendaftaranDiklat.nama}
                </Badge>
                <h1 className="text-2xl font-bold text-primary mb-2">{diklat.judul}</h1>
                <p className="text-sm mb-4">{diklat.deskripsi}</p>
                <div className="flex gap-3 flex-wrap mb-6">
                    <Badge variant='outline'>Metode: {diklat.metodeDiklat.nama}</Badge>
                    <Badge variant='outline'>Target: {diklat.targetSasaran}</Badge>
                </div>

                <Tabs defaultValue="detail">
                    <TabsList variant="line" className="mb-8">
                        <TabsTrigger value="detail">Detail</TabsTrigger>
                        <TabsTrigger value="daftarPeserta">Daftar Peserta</TabsTrigger>
                    </TabsList>

                    <DetailDiklatTabsContent
                        daftarPesertaDariInstansi={daftarPesertaDariInstansi}
                        diklat={diklat}
                        isInstansi={isInstansi} />
                    <DaftarPesertaTabsContent
                        daftarPesertaDiklat={daftarPesertaDiklat} />
                </Tabs>

            </GuestLayout>
            <div className="mt-auto">
                <Footer />
            </div>
        </div>
    )
}

