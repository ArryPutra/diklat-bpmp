"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import { 
    BiArrowBack, 
    BiBookOpen, 
    BiBuilding, 
    BiCheck, 
    BiCog, 
    BiGroup, 
    BiLogOut, 
    BiShield, 
    BiUser 
} from 'react-icons/bi';
import { logoutAction } from '@/actions/auth-action';

interface DashboardSelectorViewProps {
    user: any;
    isAdmin: boolean;
    hasInstansi: boolean;
    instansi: any;
}

export default function DashboardSelectorView({ user, isAdmin, hasInstansi, instansi }: DashboardSelectorViewProps) {

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary/5 via-white to-purple-50 flex flex-col">
            {/* Header */}
            <header className="w-full px-5 py-4 border-b bg-white/80 backdrop-blur-md">
                <div className="max-w-6xl mx-auto flex items-center justify-between">
                    <Image
                        src='/images/logo/logo.png'
                        alt="Logo"
                        width={150}
                        height={150}
                        priority
                    />
                    <div className="flex items-center gap-4">
                        <div className="text-right max-md:hidden">
                            <p className="font-medium text-sm">{user?.name}</p>
                            <p className="text-xs text-gray-500">{user?.email}</p>
                        </div>
                        <form action={logoutAction}>
                            <Button variant="ghost" size="sm" type="submit">
                                <BiLogOut /> Keluar
                            </Button>
                        </form>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 flex items-center justify-center p-6">
                <div className="w-full max-w-4xl">
                    <div className="text-center mb-10">
                        <h1 className="text-3xl font-bold mb-2">
                            Selamat Datang, <span className="gradient-text">{user?.name}</span>
                        </h1>
                        <p className="text-gray-500">Pilih dashboard yang ingin Anda akses</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Admin Dashboard Card */}
                        {isAdmin && (
                            <Link href="/dashboard/admin">
                                <Card className="border-2 hover:border-primary/50 hover:shadow-xl transition-all duration-300 cursor-pointer group h-full">
                                    <CardHeader className="pb-4">
                                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform shadow-lg">
                                            <BiShield size={32} />
                                        </div>
                                        <CardTitle className="text-xl group-hover:text-primary transition-colors">
                                            Dashboard Admin
                                        </CardTitle>
                                        <CardDescription>
                                            Kelola seluruh sistem diklat sebagai administrator
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <ul className="space-y-2 text-sm text-gray-600">
                                            <li className="flex items-center gap-2">
                                                <BiCheck className="text-green-500" />
                                                <span>Kelola semua program diklat</span>
                                            </li>
                                            <li className="flex items-center gap-2">
                                                <BiCheck className="text-green-500" />
                                                <span>Verifikasi pendaftaran instansi</span>
                                            </li>
                                            <li className="flex items-center gap-2">
                                                <BiCheck className="text-green-500" />
                                                <span>Kelola peserta & sertifikat</span>
                                            </li>
                                            <li className="flex items-center gap-2">
                                                <BiCheck className="text-green-500" />
                                                <span>Lihat laporan & statistik</span>
                                            </li>
                                        </ul>
                                        <Button className="w-full mt-6 group-hover:bg-primary/90">
                                            Masuk Dashboard Admin
                                        </Button>
                                    </CardContent>
                                </Card>
                            </Link>
                        )}

                        {/* Instansi Dashboard Card */}
                        {hasInstansi ? (
                            <Link href="/dashboard/instansi">
                                <Card className="border-2 hover:border-primary/50 hover:shadow-xl transition-all duration-300 cursor-pointer group h-full">
                                    <CardHeader className="pb-4">
                                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform shadow-lg">
                                            <BiBuilding size={32} />
                                        </div>
                                        <CardTitle className="text-xl group-hover:text-primary transition-colors">
                                            Dashboard Instansi
                                        </CardTitle>
                                        <CardDescription>
                                            {instansi?.nama || 'Kelola instansi Anda'}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <ul className="space-y-2 text-sm text-gray-600">
                                            <li className="flex items-center gap-2">
                                                <BiCheck className="text-green-500" />
                                                <span>Daftarkan peserta ke diklat</span>
                                            </li>
                                            <li className="flex items-center gap-2">
                                                <BiCheck className="text-green-500" />
                                                <span>Kelola data peserta instansi</span>
                                            </li>
                                            <li className="flex items-center gap-2">
                                                <BiCheck className="text-green-500" />
                                                <span>Unduh sertifikat peserta</span>
                                            </li>
                                            <li className="flex items-center gap-2">
                                                <BiCheck className="text-green-500" />
                                                <span>Lihat riwayat diklat</span>
                                            </li>
                                        </ul>
                                        <Button className="w-full mt-6 bg-emerald-600 hover:bg-emerald-700">
                                            Masuk Dashboard Instansi
                                        </Button>
                                    </CardContent>
                                </Card>
                            </Link>
                        ) : (
                            <Card className="border-2 border-dashed border-gray-200 h-full">
                                <CardHeader className="pb-4">
                                    <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center text-gray-400 mb-4">
                                        <BiBuilding size={32} />
                                    </div>
                                    <CardTitle className="text-xl text-gray-400">
                                        Dashboard Instansi
                                    </CardTitle>
                                    <CardDescription>
                                        {instansi ? 
                                            `Status: ${instansi.statusRegistrasiInstansi.nama}` : 
                                            'Anda belum memiliki instansi terdaftar'
                                        }
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="p-4 bg-gray-50 rounded-lg text-center">
                                        <p className="text-sm text-gray-500 mb-4">
                                            {instansi ? 
                                                'Instansi Anda sedang menunggu verifikasi dari admin' :
                                                'Daftarkan instansi Anda terlebih dahulu untuk mengakses dashboard ini'
                                            }
                                        </p>
                                        {!instansi && (
                                            <Link href="/registrasi-instansi">
                                                <Button variant="outline">
                                                    <BiBuilding /> Daftarkan Instansi
                                                </Button>
                                            </Link>
                                        )}
                                        {instansi && instansi.statusRegistrasiInstansi.nama === 'MENUNGGU' && (
                                            <Link href="/registrasi-instansi/cek-status">
                                                <Button variant="outline">
                                                    Cek Status Pendaftaran
                                                </Button>
                                            </Link>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    {/* Quick Links */}
                    <div className="mt-10 text-center">
                        <p className="text-sm text-gray-500 mb-4">Atau akses cepat:</p>
                        <div className="flex justify-center gap-3 flex-wrap">
                            <Link href="/">
                                <Button variant="ghost" size="sm">
                                    <BiArrowBack /> Kembali ke Beranda
                                </Button>
                            </Link>
                            <Link href="/#diklat">
                                <Button variant="ghost" size="sm">
                                    <BiBookOpen /> Lihat Daftar Diklat
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="py-4 px-6 border-t bg-white/50 text-center">
                <p className="text-sm text-gray-500">
                    © 2026 BPMP Provinsi Kalimantan Selatan. All rights reserved.
                </p>
            </footer>
        </div>
    );
}
