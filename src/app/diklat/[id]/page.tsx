"use client"

import Layout from '@/components/layouts/layout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import {
    BiArrowBack,
    BiBookOpen,
    BiBuilding,
    BiCalendar,
    BiCheckCircle,
    BiGroup,
    BiInfoCircle,
    BiLaptop,
    BiMap,
    BiShare,
    BiTime,
    BiUser
} from 'react-icons/bi'

// Data dummy untuk detail diklat
const diklatData = {
    id: "1",
    nama: "Peningkatan Kompetensi Guru dalam Pembelajaran Berbasis Teknologi",
    deskripsi: "Program pelatihan ini dirancang untuk meningkatkan kemampuan guru dalam mengintegrasikan teknologi ke dalam proses pembelajaran. Peserta akan mempelajari berbagai tools dan platform digital yang dapat digunakan untuk membuat pembelajaran lebih interaktif dan menarik bagi siswa.",
    metode: "Online",
    target: "Guru",
    tanggalPelaksanaan: "1 Februari 2026",
    waktuPelaksanaan: "08:00 - 16:00 WITA",
    batasPendaftaran: "31 Desember 2025",
    sisaHari: 2,
    kuotaTerisi: 14,
    kuotaTotal: 30,
    lokasi: "Via Zoom Meeting",
    penyelenggara: "BPMP Provinsi Kalimantan Selatan",
    narahubung: "+62 812 3456 789",
    materi: [
        "Pengenalan Platform Pembelajaran Digital",
        "Membuat Konten Pembelajaran Interaktif",
        "Penggunaan AI dalam Pendidikan",
        "Evaluasi Pembelajaran Berbasis Teknologi",
        "Praktik Pengembangan Materi Digital"
    ],
    persyaratan: [
        "Guru aktif di satuan pendidikan",
        "Memiliki akses internet yang stabil",
        "Memiliki laptop/komputer",
        "Bersedia mengikuti seluruh rangkaian kegiatan"
    ],
    fasilitas: [
        "Sertifikat Elektronik",
        "Materi Pelatihan Digital",
        "Akses Rekaman Pelatihan",
        "Konsultasi dengan Narasumber"
    ]
}

export default function DetailDiklat({ params }: { params: { id: string } }) {
    const [mounted, setMounted] = useState(false);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const shareLink = () => {
        navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }

    const kuotaPercentage = (diklatData.kuotaTerisi / diklatData.kuotaTotal) * 100;

    return (
        <>
            {/* Header */}
            <header className="fixed w-full px-5 z-50 backdrop-blur-md">
                <div className="flex items-center justify-between w-full max-w-6xl mx-auto border mt-3 px-6 h-16 rounded-md bg-white/90 shadow-lg">
                    <Link href="/#diklat" className="flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors">
                        <BiArrowBack /> Kembali
                    </Link>
                    <Image
                        src='/images/logo/logo.png'
                        alt="Logo"
                        width={120}
                        height={120}
                        priority
                        className="hover-scale"
                    />
                    <Button variant="outline" size="sm" onClick={shareLink} className="hover-lift">
                        {copied ? <BiCheckCircle className="text-green-500" /> : <BiShare />}
                        {copied ? "Tersalin!" : "Bagikan"}
                    </Button>
                </div>
            </header>

            {/* Hero Section */}
            <section className="pt-28 pb-12 bg-linear-to-b from-primary/5 to-white relative overflow-hidden">
                <div className="absolute w-72 h-72 bg-primary/10 top-10 -right-20 rounded-full blur-[80px] opacity-50 animate-float pointer-events-none" />

                <Layout>
                    <div className={cn(
                        "transition-all duration-700",
                        mounted ? "animate-fade-in-up opacity-100" : "opacity-0"
                    )}>
                        <div className="flex gap-3 flex-wrap mb-4">
                            <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium flex items-center gap-1">
                                <BiLaptop /> {diklatData.metode}
                            </span>
                            <span className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm font-medium flex items-center gap-1">
                                <BiUser /> {diklatData.target}
                            </span>
                        </div>

                        <h1 className="text-3xl font-bold mb-4 max-md:text-2xl">
                            <span className="gradient-text">{diklatData.nama}</span>
                        </h1>

                        <p className="text-muted-foreground max-w-3xl">
                            {diklatData.deskripsi}
                        </p>
                    </div>
                </Layout>
            </section>

            {/* Content Section */}
            <Layout className="pb-24!">
                <div className="grid grid-cols-3 gap-8 max-lg:grid-cols-1">
                    {/* Main Content */}
                    <div className="col-span-2 space-y-6 max-lg:col-span-1">
                        {/* Info Cards */}
                        <div className={cn(
                            "grid grid-cols-2 gap-4 max-sm:grid-cols-1 transition-all duration-700 delay-100",
                            mounted ? "animate-fade-in-up opacity-100" : "opacity-0"
                        )}>
                            <Card className="hover-lift">
                                <CardContent className="p-4 flex items-center gap-3">
                                    <div className="p-3 bg-primary/10 rounded-lg">
                                        <BiCalendar className="text-2xl text-primary" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground">Tanggal Pelaksanaan</p>
                                        <p className="font-semibold">{diklatData.tanggalPelaksanaan}</p>
                                    </div>
                                </CardContent>
                            </Card>
                            <Card className="hover-lift">
                                <CardContent className="p-4 flex items-center gap-3">
                                    <div className="p-3 bg-primary/10 rounded-lg">
                                        <BiTime className="text-2xl text-primary" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground">Waktu Pelaksanaan</p>
                                        <p className="font-semibold">{diklatData.waktuPelaksanaan}</p>
                                    </div>
                                </CardContent>
                            </Card>
                            <Card className="hover-lift">
                                <CardContent className="p-4 flex items-center gap-3">
                                    <div className="p-3 bg-primary/10 rounded-lg">
                                        <BiMap className="text-2xl text-primary" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground">Lokasi</p>
                                        <p className="font-semibold">{diklatData.lokasi}</p>
                                    </div>
                                </CardContent>
                            </Card>
                            <Card className="hover-lift">
                                <CardContent className="p-4 flex items-center gap-3">
                                    <div className="p-3 bg-primary/10 rounded-lg">
                                        <BiBuilding className="text-2xl text-primary" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground">Penyelenggara</p>
                                        <p className="font-semibold text-sm">{diklatData.penyelenggara}</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Materi Pelatihan */}
                        <Card className={cn(
                            "hover-lift transition-all duration-700 delay-200",
                            mounted ? "animate-fade-in-up opacity-100" : "opacity-0"
                        )}>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <BiBookOpen className="text-primary" />
                                    Materi Pelatihan
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-3">
                                    {diklatData.materi.map((item, index) => (
                                        <li key={index} className="flex items-start gap-3 animate-fade-in-left" style={{ animationDelay: `${index * 100}ms` }}>
                                            <BiCheckCircle className="text-green-500 mt-0.5 flex-shrink-0" />
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>

                        {/* Persyaratan */}
                        <Card className={cn(
                            "hover-lift transition-all duration-700 delay-300",
                            mounted ? "animate-fade-in-up opacity-100" : "opacity-0"
                        )}>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <BiInfoCircle className="text-primary" />
                                    Persyaratan Peserta
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-3">
                                    {diklatData.persyaratan.map((item, index) => (
                                        <li key={index} className="flex items-start gap-3">
                                            <span className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center text-xs font-semibold text-primary flex-shrink-0">
                                                {index + 1}
                                            </span>
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>

                        {/* Fasilitas */}
                        <Card className={cn(
                            "hover-lift transition-all duration-700 delay-400",
                            mounted ? "animate-fade-in-up opacity-100" : "opacity-0"
                        )}>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <BiGroup className="text-primary" />
                                    Fasilitas
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-2 gap-3 max-sm:grid-cols-1">
                                    {diklatData.fasilitas.map((item, index) => (
                                        <div key={index} className="flex items-center gap-2 p-3 bg-primary/5 rounded-lg">
                                            <BiCheckCircle className="text-green-500" />
                                            <span className="text-sm">{item}</span>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6 max-lg:col-span-1">
                        {/* Registration Card */}
                        <Card className={cn(
                            "sticky top-24 hover-lift border-primary/20 transition-all duration-700 delay-200",
                            mounted ? "animate-fade-in-right opacity-100" : "opacity-0"
                        )}>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-lg">Informasi Pendaftaran</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {/* Kuota Progress */}
                                <div>
                                    <div className="flex justify-between text-sm mb-2">
                                        <span className="text-muted-foreground">Kuota Terisi</span>
                                        <span className="font-semibold">{diklatData.kuotaTerisi}/{diklatData.kuotaTotal}</span>
                                    </div>
                                    <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-primary rounded-full transition-all duration-1000"
                                            style={{ width: `${kuotaPercentage}%` }}
                                        />
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        Sisa {diklatData.kuotaTotal - diklatData.kuotaTerisi} slot tersedia
                                    </p>
                                </div>

                                <Separator />

                                {/* Deadline */}
                                <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                                    <p className="text-xs text-amber-700">Batas Pendaftaran</p>
                                    <p className="font-semibold text-amber-900">{diklatData.batasPendaftaran}</p>
                                    <p className="text-xs text-amber-600 mt-1">
                                        ⏰ {diklatData.sisaHari} hari lagi
                                    </p>
                                </div>

                                <Separator />

                                {/* Narahubung */}
                                <div>
                                    <p className="text-xs text-muted-foreground mb-1">Narahubung</p>
                                    <p className="font-medium">{diklatData.narahubung}</p>
                                </div>

                                <Button className="w-full hover-lift animate-pulse-glow" size="lg">
                                    Daftar Sekarang
                                </Button>

                                <p className="text-xs text-center text-muted-foreground">
                                    Pendaftaran melalui instansi yang terdaftar
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </Layout>

            {/* Footer Mini */}
            <footer className="bg-slate-900 text-white py-6">
                <Layout className="py-0!">
                    <div className="flex items-center justify-between max-md:flex-col max-md:gap-4">
                        <Image
                            src='/images/logo/logo-white-text.png'
                            alt="Logo Diklat"
                            width={150}
                            height={150}
                            priority
                        />
                        <p className="text-sm opacity-70">© 2026 BPMP Provinsi Kalimantan Selatan</p>
                    </div>
                </Layout>
            </footer>
        </>
    )
}
