import GuestLayout from "@/components/layouts/guest-layout";
import Search from "@/components/shared/search";
import { Header } from "../page";

export default function CariDiklatPage() {
    return (
        <>
            <Header activeMenuLabel="Diklat" />

            <GuestLayout className="pt-36 max-md:pt-36 flex justify-center">
                <div className="flex flex-col w-full text-center">
                    <h1 className="font-bold text-2xl">Daftar <span className="text-primary">Diklat</span> Kami</h1>
                    <p className="mb-6">Lihat berbagai kegiatan pelatihan dan pengembangan kompetensi pendidikan yang kami selenggarakan.</p>

                    <Search />
                </div>
            </GuestLayout>
        </>
    )
}
