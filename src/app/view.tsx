"use client"

import GuestLayout from "@/components/layouts/guest-layout";
import { DiklatCard } from "@/components/shared/cards/diklat-card";
import StatsCard from "@/components/shared/cards/stats-card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { BiBuilding, BiChevronDown, BiMenu, BiRightArrowAlt, BiUser, BiX } from "react-icons/bi";

export default function View({
    daftarDiklat
}: {
    daftarDiklat: any[]
}) {
    useEffect(() => {
        document.documentElement.classList.add("scroll-smooth");

        return () => {
            document.documentElement.classList.remove("scroll-smooth");
        };
    }, []);

    return (
        <>
            <Header />

            <Beranda />
            <Statistik />
            <Diklat daftarDiklat={daftarDiklat} />
            <Faq />

            <Footer />
        </>
    );
}

export function Header({
    activeMenuLabel
}: {
    activeMenuLabel?: string
}) {
    const [menuOpen, setMenuOpen] = useState(false)

    const router = useRouter();

    return (
        <header className="fixed w-full px-5 backdrop-blur-sm z-50">
            <div className="flex items-center justify-between w-full max-w-6xl mx-auto border mt-6 px-6 h-20 rounded-md bg-white shadow
        max-md:relative">
                <Image src="/images/logo/logo.png" alt="Logo Diklat" width={160} height={160} priority />

                <div className={`flex items-center
          max-md:absolute max-md:bg-white max-md:left-0 max-md:top-0 max-md:mt-28 max-md:w-full max-md:p-4 max-md:flex-col max-md:items-start max-md:rounded-md max-md:gap-4 max-md:duration-500 max-md:overflow-hidden
          ${menuOpen ? 'max-md:h-46 max-md:py-4 max-md:shadow max-md:border-primary/15 max-md:border' : 'max-md:h-0 max-md:py-0 max-md:shadow-none max-md:border-transparent max-md:border-0'}`}>
                    <ul className={`flex gap-3 font-semibold absolute left-1/2 -translate-x-1/2
            max-md:flex-col max-md:static max-md:translate-0`}>
                        <li className="hover:text-primary"><a href="/#beranda">Beranda</a></li>
                        <li className={`hover:text-primary ${activeMenuLabel === "Diklat" && "text-primary"}`}><a href="/#diklat">Diklat</a></li>
                        <li className="hover:text-primary"><a href="/#faq">FAQ</a></li>
                    </ul>
                    <Button onClick={() => router.push('/login')}>Masuk</Button>
                </div>

                <div className="hidden 
        max-md:block">
                    {
                        menuOpen
                            ?
                            <BiX size={36} onClick={() => setMenuOpen(false)} />
                            :
                            <BiMenu size={36} onClick={() => setMenuOpen(true)} />
                    }
                </div>
            </div>
        </header>
    )
}

function Beranda() {

    const router = useRouter();

    return (
        <GuestLayout
            parentClassName="bg-linear-to-b to-primary/5"
            className="h-screen flex items-center justify-between gap-16
      max-md:flex-col max-md:justify-start max-md:pt-36"
            id="beranda">
            <div className="w-1/2 max-md:w-full">
                <h1 className="text-2xl font-bold">Sistem Informasi Diklat & Pelatihan Pendidikan</h1>
                <p>Program pendidikan dan pelatihan (diklat) yang dirancang untuk mendukung pengembangan kompetensi.</p>
                <div className="mt-4 flex gap-3 flex-wrap">

                    <Link href='/diklat'>
                        <Button>Cari Diklat <BiRightArrowAlt /></Button>
                    </Link>
                    <Button variant='outline' onClick={() => router.push('/registrasi-instansi')}>
                        Daftarkan Instansi
                    </Button>
                </div>
            </div>

            <Image
                src='/images/illustrations/diklat-illustration.png'
                alt="Ilustrasi Gambar Diklat"
                width={350}
                height={350}
                priority />
        </GuestLayout>
    )
}

function Statistik() {
    return (
        <GuestLayout parentClassName="bg-linear-to-b from-primary/5">
            <h1 className="font-bold text-2xl">Data Statistik Terkini</h1>

            <div className="grid gap-6 grid-cols-2 mt-6
      max-md:grid-cols-1">
                <StatsCard
                    icon={<BiUser />}
                    label="Total Peserta"
                    value="100"
                />
                <StatsCard
                    icon={<BiBuilding />}
                    label="Total Instansi"
                    value="10"
                />
            </div>
        </GuestLayout>
    )
}

function Diklat({
    daftarDiklat
}: {
    daftarDiklat: any[]
}) {
    return (
        <GuestLayout id="diklat" parentClassName="scroll-mt-24">
            <h1 className="text-center text-2xl font-bold">Daftar Diklat</h1>
            <p className="text-center">Lihat berbagai kegiatan pelatihan dan pengembangan kompetensi pendidikan yang kami selenggarakan.</p>

            <div className="mt-16 grid gap-8 grid-cols-3 mb-8 max-lg:grid-cols-2 max-md:grid-cols-1">
                {
                    daftarDiklat.length !== 0
                        ?
                        daftarDiklat.map((diklat: any) => (
                            <DiklatCard
                                key={diklat.id}
                                diklat={diklat} />
                        ))
                        :
                        <p className="text-gray-500 text-center col-span-3">Belum ada diklat</p>
                }
            </div>
            <div className="flex justify-end">
                <Link href='/diklat'>
                    <Button variant='outline'>
                        Lihat Lainnya <BiRightArrowAlt />
                    </Button>
                </Link>
            </div>
        </GuestLayout>
    )
}

function Faq() {
    const [questionIndexSelected, setQuestionIndexSelected] = useState<number | null>(null);

    const faqList = [
        {
            question: "Apakah peserta bisa mendaftar langsung tanpa melalui instansi?",
            answer: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quos, quae."
        },
        {
            question: "Apakah peserta bisa mendaftar langsung tanpa melalui instansi?",
            answer: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quos, quae."
        }
    ];

    return (
        <GuestLayout parentClassName="bg-primary/5"
            className="flex gap-12 max-md:flex-col" id="faq">
            <div className="flex flex-col w-full">
                <h1 className="font-bold text-2xl">Daftar Pertanyaan Umum</h1>

                <div className="mt-8">
                    {
                        faqList.map((faq, index) => (
                            <div key={index}
                                onClick={() => {
                                    if (questionIndexSelected === index) {
                                        return setQuestionIndexSelected(null)
                                    }
                                    setQuestionIndexSelected(index)
                                }}
                                className={`w-full hover:bg-primary/5 
                ${questionIndexSelected === index ? 'bg-primary/5' : ''}`}>
                                <div className="p-4">
                                    <div className="flex items-center justify-between w-full">
                                        <h1 className="font-medium">{faq.question}</h1>
                                        <BiChevronDown size={28}
                                            className={`duration-300 min-h-7 min-w-7 ${questionIndexSelected === index ? 'rotate-180' : ''}`} />
                                    </div>
                                    <p className={`text-sm mt-1 opacity-70
                    ${questionIndexSelected === index ? '' : 'hidden'}`}>{faq.answer}</p>
                                </div>
                                <Separator />
                            </div>
                        ))
                    }
                </div>

            </div>
        </GuestLayout>
    )
}

export function Footer() {
    return (
        <GuestLayout
            parentClassName="bg-slate-900"
            className="text-white pb-6!
      max-md:pt-12!">
            <footer className="grid grid-cols-3 gap-8
      max-md:flex max-md:flex-col max-md:gap-4">
                <div className="space-y-4">
                    <Image src='/images/logo/logo-white-text.png' alt="Logo Diklat" width={200} height={200} priority />
                    <p className="text-sm opacity-90">Jl. Gotong Royong No.85, Loktabat Utara, Kec. Banjarbaru Utara, Kota Banjar Baru, Kalimantan Selatan 70714</p>
                </div>
                <div>
                    <h4 className="font-semibold">Menu</h4>
                    <ul className="text-sm opacity-70 mt-6 space-y-1
          max-md:mt-1.5">
                        <li className="hover:underline"><a href="/#beranda">Beranda</a></li>
                        <li className="hover:underline"><a href="/#diklat">Diklat</a></li>
                        <li className="hover:underline"><a href="/#faq">FAQ</a></li>
                    </ul>
                </div>
                <div>
                    <h4 className="font-semibold">Kontak</h4>
                    <ul className="text-sm opacity-70 mt-6 space-y-1
          max-md:mt-1.5">
                        <li className="hover:underline wrap-break-word"><a href="#">bpmpkalsel@kemendikdasmen.go.id</a></li>
                        <li className="hover:underline"><a href="#">+62 8123456789</a></li>
                    </ul>
                </div>

                <div className="col-span-3 mt-2 flex flex-col items-center gap-6
        max-md:mt-6">
                    <Separator className="opacity-20" />
                    <p className="opacity-70 text-sm text-center">© 2026 BPMP Provinsi Kalimantan Selatan. All rights reserved</p>
                </div>
            </footer>
        </GuestLayout>
    )
}