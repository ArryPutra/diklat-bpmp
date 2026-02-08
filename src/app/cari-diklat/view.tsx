import GuestLayout from "@/components/layouts/guest-layout";
import { DiklatCard } from "@/components/shared/cards/diklat-card";
import Search from "@/components/shared/search";
import { Footer, Header } from "../view";

export default function CariDiklatView({
    daftarDiklat
}: {
    daftarDiklat: any[]
}) {
    return (
        <>
            <Header activeMenuLabel="Diklat" />

            <GuestLayout className="pt-36 max-md:pt-36 flex flex-col min-h-screen">
                <div className="flex flex-col w-full text-center mb-6">
                    <h1 className="font-bold text-2xl">Daftar <span className="text-primary">Diklat</span> Kami</h1>
                    <p className="mb-8">Lihat berbagai kegiatan pelatihan dan pengembangan kompetensi pendidikan yang kami selenggarakan.</p>

                    <Search />
                </div>

                <div className="pt-8 grid grid-cols-3 gap-8 max-lg:grid-cols-2 max-md:grid-cols-1">
                    {
                        daftarDiklat.length !== 0
                            ?
                            daftarDiklat.map((diklat: any) => (
                                <DiklatCard
                                    key={diklat.id}
                                    diklat={diklat} />
                            ))
                            :
                            <p className="text-gray-500 col-span-3 text-center">Belum ada diklat</p>
                    }
                </div>
            </GuestLayout>

            <Footer />
        </>
    )
}
