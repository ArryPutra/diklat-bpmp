"use client"

import Layout from "@/components/layouts/layout";
import StatsCard from "@/components/shared/stats-card";
import WhatsAppFloating from "@/components/shared/whatsapp-floating";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { BiBuilding, BiCalendar, BiChevronDown, BiMenu, BiRightArrowAlt, BiUser, BiX } from "react-icons/bi";

// Hook untuk animasi saat scroll
function useScrollAnimation() {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return { ref, isVisible };
}

// Hook untuk counter animasi
function useCountUp(end: number, duration: number = 2000, startOnVisible: boolean = false) {
  const [count, setCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasStarted) {
          setHasStarted(true);
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [hasStarted]);

  useEffect(() => {
    if (!hasStarted) return;

    let startTime: number;
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      setCount(Math.floor(progress * end));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [hasStarted, end, duration]);

  return { count, ref };
}

export default function Home() {
  return (
    <>
      <Header />

      <Beranda />
      <Statistik />
      <Diklat />
      <Faq />

      <Footer />

      {/* WhatsApp Floating Button */}
      <WhatsAppFloating
        phoneNumber="6281234567890"
        message="Halo, saya ingin bertanya tentang Diklat BPMP Kalsel"
      />
    </>
  );
}

function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header className={cn(
      "fixed w-full px-5 z-50 transition-all duration-300",
      scrolled ? "backdrop-blur-md" : "backdrop-blur-sm"
    )}>
      <div className={cn(
        "flex items-center justify-between w-full max-w-6xl mx-auto border px-6 h-20 rounded-md bg-white/90 transition-all duration-300",
        scrolled ? "mt-3 shadow-lg" : "mt-6 shadow",
        "max-md:relative"
      )}>
        <Image
          src='/images/logo/logo.png'
          alt="Logo"
          width={160}
          height={160}
          priority
          className="hover-scale"
        />

        <div className={`flex items-center
          max-md:absolute max-md:bg-white max-md:left-0 max-md:top-0 max-md:mt-28 max-md:w-full max-md:p-4 max-md:flex-col max-md:items-start max-md:rounded-md max-md:gap-4 max-md:duration-500 max-md:overflow-hidden
          ${menuOpen ? 'max-md:h-46 max-md:py-4 max-md:shadow max-md:border-primary/15 max-md:border' : 'max-md:h-0 max-md:py-0 max-md:shadow-none max-md:border-transparent max-md:border-0'}`}>
          <ul className={`flex gap-3 font-semibold absolute left-1/2 -translate-x-1/2
            max-md:flex-col max-md:static max-md:translate-0`}>
            <li className="animated-underline hover:text-primary transition-colors"><a href="#beranda">Beranda</a></li>
            <li className="animated-underline hover:text-primary transition-colors"><a href="#diklat">Diklat</a></li>
            <li className="animated-underline hover:text-primary transition-colors"><a href="#faq">FAQ</a></li>
          </ul>
          <Link href='/login'>
            <Button>Masuk</Button>
          </Link>
        </div>

        <div className="hidden 
        max-md:block">
          {
            menuOpen
              ?
              <BiX size={36} onClick={() => setMenuOpen(false)} className="cursor-pointer hover:text-primary transition-colors" />
              :
              <BiMenu size={36} onClick={() => setMenuOpen(true)} className="cursor-pointer hover:text-primary transition-colors" />
          }
        </div>
      </div>
    </header>
  )
}

function Beranda() {
  const { ref: textRef, isVisible: textVisible } = useScrollAnimation();

  return (
    <section className="w-full px-5 bg-linear-to-b from-white to-primary/5 relative overflow-hidden dots-pattern" id="beranda">
      {/* Animated Background Blobs */}
      <div className="absolute w-72 h-72 bg-primary/20 top-20 -left-20 rounded-full blur-[60px] opacity-50 animate-float pointer-events-none" />
      <div className="absolute w-96 h-96 bg-purple-300/20 bottom-20 right-10 rounded-full blur-[60px] opacity-50 animate-float-slow pointer-events-none" />

      <div className="w-full max-w-6xl mx-auto py-12 max-md:py-6 h-screen flex items-center justify-between gap-16 relative z-10 max-md:flex-col max-md:justify-start max-md:pt-36">
        <div ref={textRef} className="w-1/2 max-md:w-full relative z-10">
          <h1 className={cn(
            "text-2xl font-bold transition-all duration-700",
            textVisible ? "animate-fade-in-left" : "opacity-0"
          )}>
            <span className="gradient-text">Sistem Informasi Diklat</span>
            <br />& Pelatihan Pendidikan
          </h1>
          <p className={cn(
            "mt-3 text-muted-foreground transition-all duration-700 delay-200",
            textVisible ? "animate-fade-in-left delay-200" : "opacity-0"
          )}>
            Program pendidikan dan pelatihan (diklat) yang dirancang untuk mendukung pengembangan kompetensi.
          </p>
          <div className={cn(
            "mt-6 flex gap-3 flex-wrap transition-all duration-700",
            textVisible ? "animate-fade-in-up delay-400" : "opacity-0"
          )}>
            <a href="#diklat">
              <Button className="hover-lift group">
                Cari Diklat
                <BiRightArrowAlt className="group-hover:translate-x-1 transition-transform" />
              </Button>
            </a>
            <Link href='/registrasi-instansi'>
              <Button variant='outline' className="hover-lift">Daftarkan Instansi</Button>
            </Link>
          </div>
        </div>

        <div className={cn(
          "relative transition-all duration-1000",
          textVisible ? "animate-fade-in-right" : "opacity-0"
        )}>
          <div className="absolute inset-0 bg-primary/10 rounded-full blur-3xl animate-pulse-glow" />
          <Image
            src='/images/illustrations/diklat-illustration.png'
            alt="Ilustrasi Gambar Diklat"
            width={350}
            height={350}
            priority
            className="relative z-10 animate-float drop-shadow-2xl"
          />
        </div>
      </div>
    </section>
  )
}

function Statistik() {
  const { ref, isVisible } = useScrollAnimation();
  const pesertaCounter = useCountUp(100, 2000);
  const instansiCounter = useCountUp(10, 1500);

  return (
    <Layout parentClassName="bg-linear-to-b from-primary/5 to-white">
      <div ref={ref}>
        <h1 className={cn(
          "font-bold text-2xl transition-all duration-700",
          isVisible ? "animate-fade-in-up" : "opacity-0"
        )}>
          Data Statistik <span className="gradient-text">Terkini</span>
        </h1>

        <div className="grid gap-6 grid-cols-2 mt-6 max-md:grid-cols-1">
          <div
            ref={pesertaCounter.ref}
            className={cn(
              "hover-lift card-glow transition-all duration-700",
              isVisible ? "animate-fade-in-left" : "opacity-0"
            )}
          >
            <StatsCard
              icon={<BiUser className="text-2xl" />}
              label="Total Peserta"
              value={pesertaCounter.count.toString()}
            />
          </div>
          <div
            ref={instansiCounter.ref}
            className={cn(
              "hover-lift card-glow transition-all duration-700 delay-200",
              isVisible ? "animate-fade-in-right delay-200" : "opacity-0"
            )}
          >
            <StatsCard
              icon={<BiBuilding className="text-2xl" />}
              label="Total Instansi"
              value={instansiCounter.count.toString()}
            />
          </div>
        </div>
      </div>
    </Layout>
  )
}

function Diklat() {
  return (
    <Layout id="diklat" parentClassName="scroll-mt-24">
      <h1 className="text-center text-2xl font-bold">Daftar Diklat</h1>
      <p className="text-center">Lihat berbagai kegiatan pelatihan dan pengembangan kompetensi pendidikan yang kami selenggarakan.</p>

      <div className="mt-16">
        <section className="flex gap-6
        max-md:flex-col max-md:gap-4">
          <div className="w-80 flex
          max-md:w-full max-md:h-52">
            <Image
              src='/images/illustrations/pelatihan-illustration.jpg'
              alt="Gambar Pelatihan"
              width={1920} height={1080} priority
              className="rounded-xl object-cover w-full h-full"
            />
          </div>

          <div className="flex flex-col gap-4 w-full justify-between">
            <h1 className="text-lg font-semibold">Peningkatan Kompetensi Guru dalam Pembelajaran Berbasis Teknologi</h1>
            <p className="text-sm md:hidden">
              Batas Pendaftaran: <span className="font-medium">31 Desember 2025 / 2 Hari Lagi</span>
            </p>

            <div className="flex gap-3 flex-wrap">
              <div className="border w-fit px-3 py-1 rounded-full">
                <p className="text-sm">Metode: <span className="font-semibold">Online</span></p>
              </div>
              <div className="border w-fit px-3 py-1 rounded-full">
                <p className="text-sm">Target: <span className="font-semibold">Guru</span></p>
              </div>
            </div>

            <div className="text-sm flex gap-3
            max-md:p-4 max-md:border max-md:flex-wrap max-md:rounded-lg">
              <p className="flex gap-1.5  
              max-md:flex-col max-md:gap-1">
                <span className="flex items-center gap-1"><BiCalendar size={14} /> Tanggal Pelaksanaan:</span>
                <span className="font-semibold">1 Februari 2026</span>
              </p>
              <Separator orientation="vertical" className="max-md:hidden" />
              <p className="flex gap-1.5 
              max-md:flex-col max-md:gap-1">
                <span className="flex items-center gap-1"><BiUser size={14} /> Kuota Terisi:</span>
                <span className="font-semibold">14/30</span>
              </p>
            </div>

            <div className="flex items-center justify-between
            max-md:flex-col-reverse max-md:items-start max-md:gap-2">
              <Link href="/diklat/1">
                <Button className="w-fit hover-lift group">
                  Lihat Detail
                  <BiRightArrowAlt className="group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <p className="text-sm max-md:hidden">
                Batas Pendaftaran: <span className="font-medium text-destructive">31 Desember 2025 / 2 Hari Lagi</span>
              </p>
            </div>

          </div>
        </section>
      </div>
    </Layout>
  )
}

function Faq() {
  const [questionIndexSelected, setQuestionIndexSelected] = useState<number | null>(null);
  const { ref, isVisible } = useScrollAnimation();

  const faqList = [
    {
      question: "Apakah peserta bisa mendaftar langsung tanpa melalui instansi?",
      answer: "Tidak, peserta harus mendaftar melalui instansi yang telah terdaftar di sistem kami. Silahkan hubungi instansi Anda untuk proses pendaftaran."
    },
    {
      question: "Bagaimana cara mendaftarkan instansi baru?",
      answer: "Anda dapat mendaftarkan instansi melalui menu 'Daftarkan Instansi' di halaman utama. Setelah mengisi formulir, tunggu verifikasi dari admin."
    },
    {
      question: "Berapa lama proses verifikasi instansi?",
      answer: "Proses verifikasi instansi biasanya memakan waktu 1-3 hari kerja setelah dokumen lengkap diterima."
    }
  ];

  return (
    <Layout parentClassName="bg-primary/5 relative overflow-hidden"
      className="flex gap-12 max-md:flex-col" id="faq">

      {/* Decorative background */}
      <div className="absolute top-0 left-0 w-full h-full dots-pattern opacity-50" />

      <div ref={ref} className={cn(
        "relative transition-all duration-700",
        isVisible ? "animate-fade-in-left" : "opacity-0"
      )}>
        <div className="absolute inset-0 bg-primary/10 rounded-full blur-2xl animate-pulse-glow" />

      </div>

      <div className="flex flex-col w-full relative z-10">
        <h1 className={cn(
          "font-bold text-2xl transition-all duration-700",
          isVisible ? "animate-fade-in-up" : "opacity-0"
        )}>
          Daftar <span className="gradient-text">Pertanyaan Umum</span>
        </h1>

        <div className={cn(
          "mt-8 rounded-xl overflow-hidden border bg-white/80 backdrop-blur-sm transition-all duration-700 delay-200",
          isVisible ? "animate-fade-in-up delay-200" : "opacity-0"
        )}>
          {
            faqList.map((faq, index) => (
              <div key={index}
                onClick={() => {
                  if (questionIndexSelected === index) {
                    return setQuestionIndexSelected(null)
                  }
                  setQuestionIndexSelected(index)
                }}
                className={cn(
                  "w-full cursor-pointer transition-all duration-300",
                  questionIndexSelected === index ? 'bg-primary/5' : 'hover:bg-primary/5'
                )}>
                <div className="p-4">
                  <div className="flex items-center justify-between w-full">
                    <h1 className={cn(
                      "font-medium transition-colors duration-300",
                      questionIndexSelected === index && "text-primary"
                    )}>
                      {faq.question}
                    </h1>
                    <BiChevronDown
                      size={28}
                      className={cn(
                        "duration-300 min-h-7 min-w-7 transition-all",
                        questionIndexSelected === index ? 'rotate-180 text-primary' : ''
                      )}
                    />
                  </div>
                  <div className={cn(
                    "overflow-hidden transition-all duration-300",
                    questionIndexSelected === index ? 'max-h-40 opacity-100 mt-2' : 'max-h-0 opacity-0'
                  )}>
                    <p className="text-sm text-muted-foreground">{faq.answer}</p>
                  </div>
                </div>
                {index < faqList.length - 1 && <Separator />}
              </div>
            ))
          }
        </div>

      </div>
    </Layout>
  )
}

function Footer() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <Layout
      parentClassName="bg-slate-900 relative overflow-hidden"
      className="text-white pb-6!
      max-md:pt-12!">

      {/* Decorative gradient */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[200px] bg-primary/20 rounded-full blur-[100px]" />

      <footer ref={ref} className="grid grid-cols-3 gap-8 relative z-10
      max-md:flex max-md:flex-col max-md:gap-4">
        <div className={cn(
          "space-y-4 transition-all duration-700",
          isVisible ? "animate-fade-in-up" : "opacity-0"
        )}>
          <Image
            src='/images/logo/logo-white-text.png'
            alt="Logo Diklat"
            width={200}
            height={200}
            priority
            className="hover-scale"
          />
          <p className="text-sm opacity-90">Jl. Gotong Royong No.85, Loktabat Utara, Kec. Banjarbaru Utara, Kota Banjar Baru, Kalimantan Selatan 70714</p>
        </div>
        <div className={cn(
          "transition-all duration-700 delay-100",
          isVisible ? "animate-fade-in-up delay-100" : "opacity-0"
        )}>
          <h4 className="font-semibold">Menu</h4>
          <ul className="text-sm opacity-70 mt-6 space-y-1
          max-md:mt-1.5">
            <li><a href="#beranda" className="animated-underline hover:opacity-100 transition-opacity">Beranda</a></li>
            <li><a href="#diklat" className="animated-underline hover:opacity-100 transition-opacity">Diklat</a></li>
            <li><a href="#faq" className="animated-underline hover:opacity-100 transition-opacity">FAQ</a></li>
          </ul>
        </div>
        <div className={cn(
          "transition-all duration-700 delay-200",
          isVisible ? "animate-fade-in-up delay-200" : "opacity-0"
        )}>
          <h4 className="font-semibold">Kontak</h4>
          <ul className="text-sm opacity-70 mt-6 space-y-1
          max-md:mt-1.5">
            <li className="wrap-break-word"><a href="mailto:bpmpkalsel@kemendikdasmen.go.id" className="animated-underline hover:opacity-100 transition-opacity">bpmpkalsel@kemendikdasmen.go.id</a></li>
            <li><a href="https://wa.me/628123456789" target="_blank" rel="noopener noreferrer" className="animated-underline hover:opacity-100 transition-opacity">+62 8123456789</a></li>
          </ul>
        </div>

        <div className={cn(
          "col-span-3 mt-2 flex flex-col items-center gap-6 max-md:mt-6 transition-all duration-700 delay-300",
          isVisible ? "animate-fade-in-up delay-300" : "opacity-0"
        )}>
          <Separator className="opacity-20" />
          <p className="opacity-70 text-sm text-center">© 2026 BPMP Provinsi Kalimantan Selatan. All rights reserved</p>
        </div>
      </footer>
    </Layout>
  )
}