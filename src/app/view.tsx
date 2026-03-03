"use client"

import GuestLayout from "@/components/layouts/guest-layout";
import { DiklatCard } from "@/components/shared/cards/diklat-card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";
import { useRouter } from "@bprogress/next/app";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { useEffect, useState, useTransition } from "react";
import { BiAward, BiBookOpen, BiCheckCircle, BiChevronDown, BiFileBlank, BiMenu, BiRightArrowAlt, BiSolidLandmark, BiX } from "react-icons/bi";

export default function View({
    daftarDiklat,
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
            <Bantuan />
            <Diklat
                daftarDiklat={daftarDiklat}
            />
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

    const [isPending, startTransition] = useTransition();

    return (
        <header className="fixed z-50 w-full px-5 backdrop-blur-sm">
            <div className="mx-auto mt-6 flex h-20 w-full max-w-6xl items-center justify-between rounded-2xl border border-primary/10 bg-white/90 px-6 shadow-lg
        max-md:relative">
                <Image src="/images/logo/logo.png" alt="Logo Diklat" width={150} height={150} priority />

                <div className={`flex items-center
          max-md:absolute max-md:left-0 max-md:top-0 max-md:mt-28 max-md:w-full max-md:flex-col max-md:items-start max-md:gap-4 max-md:overflow-hidden max-md:rounded-xl max-md:bg-white max-md:p-4 max-md:duration-500
          ${menuOpen ? 'max-md:h-46 max-md:py-4 max-md:shadow max-md:border-primary/15 max-md:border' : 'max-md:h-0 max-md:py-0 max-md:shadow-none max-md:border-transparent max-md:border-0'}`}>
                    <ul className={`absolute left-1/2 flex -translate-x-1/2 gap-3 font-semibold
            max-md:flex-col max-md:static max-md:translate-0`}>
                        <li className="text-slate-700 transition hover:text-primary"><a href="/#beranda">Beranda</a></li>
                        <li className={`text-slate-700 transition hover:text-primary ${activeMenuLabel === "Diklat" && "text-primary!"}`}><a href="/#diklat">Diklat</a></li>
                        <li className="text-slate-700 transition hover:text-primary"><a href="/#faq">FAQ</a></li>
                    </ul>
                    <Button onClick={() => {
                        startTransition(() => {
                            router.push('/login')
                        })
                    }}>
                        Masuk {isPending && <Spinner />}
                    </Button>
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
            parentClassName="bg-linear-to-b from-white via-primary/5 to-white"
            className="relative min-h-screen flex items-center justify-between gap-16 py-28
      max-md:flex-col max-md:justify-start max-md:pt-36"
            id="beranda">
            <div className="w-1/2 max-md:w-full">
                <div className="mb-4 inline-flex rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-sm font-medium text-primary">
                    Platform Diklat Pendidikan
                </div>
                <h1 className="text-4xl leading-tight font-bold text-slate-900 max-lg:text-3xl">
                    Sistem Informasi Diklat & Pelatihan Pendidikan
                </h1>
                <p className="mt-4 max-w-xl text-slate-600">
                    Program pendidikan dan pelatihan (diklat) yang dirancang untuk mendukung pengembangan kompetensi tenaga kependidikan secara terstruktur dan berkelanjutan.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">

                    <Link href='/diklat'>
                        <Button size='lg'>Cari Diklat <BiRightArrowAlt /></Button>
                    </Link>
                    <Button size='lg' variant='outline' onClick={() => router.push('/registrasi-instansi')}>
                        Daftarkan Instansi
                    </Button>
                </div>
            </div>

            <div className="relative w-1/2 max-md:w-full flex justify-center">
                <div className="absolute -z-10 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
                <Image
                    src='/images/illustrations/diklat-illustration.png'
                    alt="Ilustrasi Gambar Diklat"
                    width={390}
                    height={390}
                    priority
                    className="drop-shadow-xl" />
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
        <GuestLayout id="diklat" parentClassName="scroll-mt-24 bg-white">
            <h1 className="text-center text-3xl font-bold">Daftar Diklat</h1>
            <p className="mx-auto mt-2 max-w-2xl text-center text-slate-600">Lihat berbagai kegiatan pelatihan dan pengembangan kompetensi pendidikan yang kami selenggarakan.</p>

            <div className="mt-12 mb-8 grid grid-cols-3 gap-8 max-lg:grid-cols-2 max-md:grid-cols-1">
                {
                    daftarDiklat.length !== 0
                        ?
                        daftarDiklat.map((diklat: any) => (
                            <DiklatCard
                                key={diklat.id}
                                diklat={diklat} />
                        ))
                        :
                        <div className="col-span-3 rounded-2xl border border-dashed border-primary/30 bg-primary/5 px-6 py-14 text-center">
                            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-white text-primary shadow-sm">
                                <BiBookOpen size={28} />
                            </div>
                            <h3 className="text-lg font-semibold text-slate-800">Belum Ada Diklat Tersedia</h3>
                            <p className="mx-auto mt-2 max-w-md text-sm text-slate-600">
                                Saat ini belum ada program diklat yang ditampilkan. Silakan cek kembali dalam beberapa waktu.
                            </p>
                        </div>
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

function Bantuan() {
    const bantuanList = [
        {
            icon: <BiSolidLandmark size={32} />,
            title: "Daftarkan Instansi",
            description: "Daftarkan instansi Anda dan mulai proses pendaftaran peserta untuk mengikuti diklat.",
            link: "/registrasi-instansi",
            buttonLabel: "Daftar"
        },
        {
            icon: <BiAward size={32} />,
            title: "Cek Sertifikasi",
            description: "Lihat dan unduh sertifikat diklat Anda setelah berhasil menyelesaikan program pelatihan.",
            link: "/cek-sertifikasi",
            buttonLabel: "Lihat Sertifikat"
        },
        {
            icon: <BiCheckCircle size={32} />,
            title: "Cek Status Pendaftaran",
            description: "Periksa status pendaftaran instansi Anda secara real-time dan lihat detail verifikasi admin.",
            link: "/registrasi-instansi/cek-status",
            buttonLabel: "Cek Status"
        }
    ];

    return (
        <GuestLayout parentClassName="bg-white">
            <div className="text-center mb-12">
                <h1 className="font-bold text-3xl">Pusat Bantuan</h1>
                <p className="mt-2 text-slate-600">Akses cepat ke fitur penting sistem diklat kami</p>
            </div>

            <div className="grid grid-cols-3 gap-6 max-lg:grid-cols-2 max-md:grid-cols-1">
                {
                    bantuanList.map((item, index) => (
                        <div key={index} className="group rounded-2xl border border-slate-200 bg-linear-to-br from-white to-slate-50 p-8 hover:border-primary/40 hover:bg-primary/5 transition duration-300">
                            <div className="mb-4 text-primary">{item.icon}</div>
                            <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                            <p className="text-sm text-slate-600 mb-6">{item.description}</p>
                            <Link href={item.link}>
                                <Button size='sm' variant='outline' className="w-full">
                                    {item.buttonLabel} <BiRightArrowAlt />
                                </Button>
                            </Link>
                        </div>
                    ))
                }
            </div>
        </GuestLayout>
    )
}

function Faq() {
    const [questionIndexSelected, setQuestionIndexSelected] = useState<number | null>(null);

    const faqList: Array<{ question: string; answer: ReactNode }> = [
        {
            question: "Bagaimana alur pendaftaran instansi?",
            answer: (
                <>
                    Instansi mendaftar melalui{" "}
                    <a
                        href="https://diklat.bpmpkalsel.web.id/registrasi-instansi"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-primary underline"
                    >
                        /registrasi-instansi
                    </a>
                    . Setelah mengisi formulir, data instansi akan diverifikasi oleh admin. Setelah diverifikasi, instansi dapat mulai mendaftarkan peserta untuk mengikuti diklat.
                </>
            )
        },
    ];

    return (
        <GuestLayout parentClassName="bg-primary/5"
            className="flex gap-12 max-md:flex-col" id="faq">
            <div className="flex flex-col w-full">
                <h1 className="font-bold text-3xl">Daftar Pertanyaan Umum</h1>
                <p className="mt-2 text-slate-600">Temukan jawaban cepat mengenai proses pendaftaran dan pelaksanaan diklat.</p>

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
                                className={`mb-3 w-full rounded-xl border bg-white transition hover:border-primary/40 
                ${questionIndexSelected === index ? 'border-primary/40 bg-primary/5' : ''}`}>
                                <div className="p-4 md:p-5">
                                    <div className="flex items-center justify-between w-full">
                                        <h1 className="font-medium">{faq.question}</h1>
                                        <BiChevronDown size={28}
                                            className={`duration-300 min-h-7 min-w-7 ${questionIndexSelected === index ? 'rotate-180' : ''}`} />
                                    </div>
                                    <p className={`text-sm mt-1 opacity-70
                    ${questionIndexSelected === index ? '' : 'hidden'}`}>{faq.answer}</p>
                                </div>
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
            parentClassName="bg-slate-950"
            className="text-white pb-6!
      max-md:pt-12!">
            <footer className="grid grid-cols-3 gap-8
      max-md:flex max-md:flex-col max-md:gap-4">
                <div className="space-y-4 max-w-sm">
                    <Image src='/images/logo/logo-white-text.png' alt="Logo Diklat" width={200} height={200} priority />
                    <p className="text-sm opacity-80 leading-relaxed">Jl. Gotong Royong No.85, Loktabat Utara, Kec. Banjarbaru Utara, Kota Banjar Baru, Kalimantan Selatan 70714</p>
                </div>
                <div>
                    <h4 className="font-semibold">Menu</h4>
                    <ul className="mt-5 space-y-2 text-sm opacity-70
          max-md:mt-1.5">
                        <li className="hover:underline"><a href="/#beranda">Beranda</a></li>
                        <li className="hover:underline"><a href="/#diklat">Diklat</a></li>
                        <li className="hover:underline"><a href="/#faq">FAQ</a></li>
                    </ul>
                </div>
                <div>
                    <h4 className="font-semibold">Kontak</h4>
                    <ul className="mt-5 space-y-2 text-sm opacity-70
          max-md:mt-1.5">
                        <li className="hover:underline wrap-break-word"><a href="#">bpmpkalsel@kemendikdasmen.go.id</a></li>
                        <li className="hover:underline"><a href="#">+62 8123456789</a></li>
                    </ul>
                </div>

                <div className="col-span-3 mt-2 flex flex-col items-center gap-6
        max-md:mt-6">
                    <Separator className="opacity-20" />
                    <p className="text-center text-sm opacity-70">© 2026 BPMP Provinsi Kalimantan Selatan. All rights reserved</p>
                </div>
            </footer>
        </GuestLayout>
    )
}