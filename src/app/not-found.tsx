"use client"

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function NotFound() {
  const router = useRouter();
  const [loadingBeranda, setLoadingBeranda] = useState(false);
  const [loadingDiklat, setLoadingDiklat] = useState(false);

  const handleKembaliKeBeranda = () => {
    setLoadingBeranda(true);
    setTimeout(() => router.push("/"), 300);
  };

  const handleJelajahiDiklat = () => {
    setLoadingDiklat(true);
    setTimeout(() => router.push("/diklat"), 300);
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-white via-primary/5 to-white flex items-center justify-center px-5 py-12">
      <div className="w-full max-w-4xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Ilustrasi */}
          <div className="relative flex justify-center order-2 lg:order-1">
            <div className="absolute -z-10 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
            <Image
              src="/images/illustrations/undraw_file-search_cbur.svg"
              alt="Halaman Tidak Ditemukan"
              width={400}
              height={400}
              priority
              className="drop-shadow-lg"
            />
          </div>

          {/* Konten */}
          <div className="space-y-6 order-1 lg:order-2">
            <div className="space-y-2">
              <div className="inline-flex rounded-full border border-destructive/20 bg-destructive/5 px-3 py-1 text-sm font-medium text-destructive">
                Error 404
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold text-slate-900">
                Halaman Tidak Ditemukan
              </h1>
              <p className="text-lg text-slate-600 mt-4">
                Maaf, halaman yang Anda cari tidak ada atau mungkin telah dipindahkan. Silakan kembali ke halaman utama atau jelajahi bagian lain dari platform kami.
              </p>
            </div>

            {/* Tombol Aksi */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button
                size="lg"
                className="w-full sm:w-auto"
                onClick={handleKembaliKeBeranda}
                disabled={loadingBeranda || loadingDiklat}
              >
                Kembali ke Beranda {loadingBeranda && <Spinner />}
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto"
                onClick={handleJelajahiDiklat}
                disabled={loadingBeranda || loadingDiklat}
              >
                Jelajahi Diklat {loadingDiklat && <Spinner />}
              </Button>
            </div>

            {/* Info Tambahan */}
            <div className="pt-6 border-t border-slate-200">
              <p className="text-sm text-slate-600 mb-3">
                <strong>Butuh bantuan?</strong>
              </p>
              <ul className="space-y-2 text-sm text-slate-600">
                <li>
                  <a href="mailto:bpmpkalsel@kemendikdasmen.go.id" className="text-primary hover:underline">
                    Hubungi kami via email
                  </a>
                </li>
                <li>
                  <a href="#faq" className="text-primary hover:underline">
                    Lihat FAQ untuk pertanyaan umum
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
