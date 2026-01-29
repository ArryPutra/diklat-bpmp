"use client"

import { useState } from "react";
import Link from "next/link";
import { 
    BiHomeAlt, 
    BiCalendar, 
    BiGroup, 
    BiHistory, 
    BiCertification, 
    BiCog, 
    BiHelpCircle,
    BiMenu,
    BiX,
    BiLogOut,
    BiUser,
    BiBuildings,
    BiBookOpen,
    BiTime,
    BiCheck,
    BiLoader
} from "react-icons/bi";
import { logoutAction } from "@/actions/auth-action";

interface DashboardInstansiViewProps {
    user: {
        id: string;
        name: string;
        email: string;
    };
    instansi: {
        id: string;
        nama: string;
        alamat: string;
        nomorTelepon: string;
        registrasiPicInstansi: {
            nama: string;
            email: string;
        };
    };
    stats: {
        totalPeserta: number;
        pesertaDiterima: number;
        pesertaMenunggu: number;
        pesertaHadir: number;
        diklatDiikuti: number;
    } | null;
    recentPendaftaran: Array<{
        id: string;
        namaPeserta: string;
        status: string;
        createdAt: Date;
        diklat: {
            id: string;
            nama: string;
            metode: string;
            tanggalMulai: Date;
        };
    }>;
    upcomingDiklat: Array<{
        id: string;
        nama: string;
        metode: string;
        tanggalMulai: Date;
        tanggalSelesai: Date;
        kuota: number;
        _count: {
            pendaftaranDiklat: number;
        };
    }>;
}

export default function DashboardInstansiView({
    user,
    instansi,
    stats,
    recentPendaftaran,
    upcomingDiklat
}: DashboardInstansiViewProps) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const menuItems = [
        { icon: BiHomeAlt, label: "Dashboard", href: "/dashboard/instansi", active: true },
        { icon: BiCalendar, label: "Diklat Tersedia", href: "/dashboard/instansi/diklat" },
        { icon: BiGroup, label: "Peserta", href: "/dashboard/instansi/peserta" },
        { icon: BiHistory, label: "Riwayat", href: "/dashboard/instansi/riwayat" },
        { icon: BiCertification, label: "Sertifikat", href: "/dashboard/instansi/sertifikat" },
        { icon: BiBuildings, label: "Profil Instansi", href: "/dashboard/instansi/profil" },
        { icon: BiCog, label: "Pengaturan", href: "/dashboard/instansi/pengaturan" },
        { icon: BiHelpCircle, label: "Bantuan", href: "/dashboard/instansi/bantuan" },
    ];

    const getStatusColor = (status: string) => {
        switch (status) {
            case "DITERIMA": return "bg-green-100 text-green-700";
            case "MENUNGGU": return "bg-yellow-100 text-yellow-700";
            case "DITOLAK": return "bg-red-100 text-red-700";
            case "HADIR": return "bg-blue-100 text-blue-700";
            default: return "bg-gray-100 text-gray-700";
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case "DITERIMA": return "Diterima";
            case "MENUNGGU": return "Menunggu";
            case "DITOLAK": return "Ditolak";
            case "HADIR": return "Hadir";
            default: return status;
        }
    };

    const formatDate = (date: Date) => {
        return new Date(date).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Sidebar */}
            <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
                {/* Logo */}
                <div className="flex items-center justify-between h-16 px-6 border-b">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                            <BiBookOpen className="w-5 h-5 text-white" />
                        </div>
                        <span className="font-bold text-gray-800">DIKLAT BPMP</span>
                    </Link>
                    <button onClick={() => setSidebarOpen(false)} className="lg:hidden">
                        <BiX className="w-6 h-6" />
                    </button>
                </div>

                {/* Instansi Info */}
                <div className="px-4 py-4 border-b bg-green-50">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                            <BiBuildings className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-800 truncate">{instansi.nama}</p>
                            <p className="text-xs text-gray-500">Portal Instansi</p>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="p-4 space-y-1">
                    {menuItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                                item.active 
                                    ? 'bg-green-50 text-green-700 font-medium' 
                                    : 'text-gray-600 hover:bg-gray-100'
                            }`}
                        >
                            <item.icon className="w-5 h-5" />
                            <span>{item.label}</span>
                        </Link>
                    ))}
                </nav>

                {/* Logout Button */}
                <div className="absolute bottom-0 left-0 right-0 p-4 border-t">
                    <form action={logoutAction}>
                        <button 
                            type="submit"
                            className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                        >
                            <BiLogOut className="w-5 h-5" />
                            <span>Keluar</span>
                        </button>
                    </form>
                </div>
            </aside>

            {/* Overlay */}
            {sidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Main Content */}
            <div className="lg:ml-64">
                {/* Header */}
                <header className="sticky top-0 z-30 bg-white border-b">
                    <div className="flex items-center justify-between h-16 px-4 lg:px-6">
                        <div className="flex items-center gap-4">
                            <button 
                                onClick={() => setSidebarOpen(true)}
                                className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
                            >
                                <BiMenu className="w-6 h-6" />
                            </button>
                            <div>
                                <h1 className="text-lg font-semibold text-gray-800">Dashboard Instansi</h1>
                                <p className="text-sm text-gray-500">Selamat datang, {instansi.registrasiPicInstansi.nama}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="hidden md:block text-right">
                                <p className="text-sm font-medium text-gray-800">{user.name}</p>
                                <p className="text-xs text-gray-500">{user.email}</p>
                            </div>
                            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                                <BiUser className="w-5 h-5 text-green-600" />
                            </div>
                        </div>
                    </div>
                </header>

                {/* Content */}
                <main className="p-4 lg:p-6">
                    {/* Stats Cards */}
                    <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
                        <div className="bg-white rounded-xl p-4 shadow-sm border">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                    <BiGroup className="w-5 h-5 text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-gray-800">{stats?.totalPeserta ?? 0}</p>
                                    <p className="text-xs text-gray-500">Total Peserta</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl p-4 shadow-sm border">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                    <BiCheck className="w-5 h-5 text-green-600" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-gray-800">{stats?.pesertaDiterima ?? 0}</p>
                                    <p className="text-xs text-gray-500">Diterima</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl p-4 shadow-sm border">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                                    <BiLoader className="w-5 h-5 text-yellow-600" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-gray-800">{stats?.pesertaMenunggu ?? 0}</p>
                                    <p className="text-xs text-gray-500">Menunggu</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl p-4 shadow-sm border">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                                    <BiUser className="w-5 h-5 text-purple-600" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-gray-800">{stats?.pesertaHadir ?? 0}</p>
                                    <p className="text-xs text-gray-500">Hadir</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl p-4 shadow-sm border">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                                    <BiCalendar className="w-5 h-5 text-orange-600" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-gray-800">{stats?.diklatDiikuti ?? 0}</p>
                                    <p className="text-xs text-gray-500">Diklat Diikuti</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid lg:grid-cols-3 gap-6">
                        {/* Recent Pendaftaran */}
                        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border">
                            <div className="p-4 border-b flex items-center justify-between">
                                <h2 className="font-semibold text-gray-800">Pendaftaran Terbaru</h2>
                                <Link href="/dashboard/instansi/peserta" className="text-sm text-green-600 hover:underline">
                                    Lihat Semua
                                </Link>
                            </div>
                            <div className="divide-y">
                                {recentPendaftaran.length > 0 ? (
                                    recentPendaftaran.map((item) => (
                                        <div key={item.id} className="p-4 flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                                                    <BiUser className="w-5 h-5 text-gray-600" />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-800">{item.namaPeserta}</p>
                                                    <p className="text-sm text-gray-500">{item.diklat.nama}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(item.status)}`}>
                                                    {getStatusLabel(item.status)}
                                                </span>
                                                <p className="text-xs text-gray-400 mt-1">{formatDate(item.createdAt)}</p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="p-8 text-center text-gray-500">
                                        <BiGroup className="w-12 h-12 mx-auto text-gray-300 mb-2" />
                                        <p>Belum ada pendaftaran</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Upcoming Diklat */}
                        <div className="bg-white rounded-xl shadow-sm border">
                            <div className="p-4 border-b flex items-center justify-between">
                                <h2 className="font-semibold text-gray-800">Diklat Tersedia</h2>
                                <Link href="/dashboard/instansi/diklat" className="text-sm text-green-600 hover:underline">
                                    Lihat Semua
                                </Link>
                            </div>
                            <div className="divide-y">
                                {upcomingDiklat.length > 0 ? (
                                    upcomingDiklat.map((diklat) => (
                                        <Link 
                                            key={diklat.id} 
                                            href={`/dashboard/instansi/diklat/${diklat.id}`}
                                            className="block p-4 hover:bg-gray-50 transition-colors"
                                        >
                                            <div className="flex items-start justify-between">
                                                <div>
                                                    <p className="font-medium text-gray-800">{diklat.nama}</p>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <BiTime className="w-4 h-4 text-gray-400" />
                                                        <span className="text-sm text-gray-500">{formatDate(diklat.tanggalMulai)}</span>
                                                    </div>
                                                </div>
                                                <span className={`text-xs font-medium px-2 py-1 rounded ${
                                                    diklat.metode === 'ONLINE' 
                                                        ? 'bg-blue-100 text-blue-700' 
                                                        : 'bg-orange-100 text-orange-700'
                                                }`}>
                                                    {diklat.metode}
                                                </span>
                                            </div>
                                            <div className="mt-2">
                                                <div className="flex items-center justify-between text-xs">
                                                    <span className="text-gray-500">Kuota</span>
                                                    <span className="text-gray-700">{diklat._count.pendaftaranDiklat}/{diklat.kuota}</span>
                                                </div>
                                                <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                                                    <div 
                                                        className="bg-green-500 h-1.5 rounded-full"
                                                        style={{ width: `${Math.min(100, (diklat._count.pendaftaranDiklat / diklat.kuota) * 100)}%` }}
                                                    />
                                                </div>
                                            </div>
                                        </Link>
                                    ))
                                ) : (
                                    <div className="p-8 text-center text-gray-500">
                                        <BiCalendar className="w-12 h-12 mx-auto text-gray-300 mb-2" />
                                        <p>Tidak ada diklat tersedia</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="mt-6 bg-white rounded-xl shadow-sm border p-4">
                        <h2 className="font-semibold text-gray-800 mb-4">Aksi Cepat</h2>
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                            <Link 
                                href="/dashboard/instansi/diklat"
                                className="flex items-center gap-3 p-3 rounded-lg border hover:bg-green-50 hover:border-green-200 transition-colors"
                            >
                                <BiCalendar className="w-5 h-5 text-green-600" />
                                <span className="text-sm font-medium text-gray-700">Lihat Diklat</span>
                            </Link>
                            <Link 
                                href="/dashboard/instansi/peserta"
                                className="flex items-center gap-3 p-3 rounded-lg border hover:bg-green-50 hover:border-green-200 transition-colors"
                            >
                                <BiGroup className="w-5 h-5 text-green-600" />
                                <span className="text-sm font-medium text-gray-700">Kelola Peserta</span>
                            </Link>
                            <Link 
                                href="/dashboard/instansi/sertifikat"
                                className="flex items-center gap-3 p-3 rounded-lg border hover:bg-green-50 hover:border-green-200 transition-colors"
                            >
                                <BiCertification className="w-5 h-5 text-green-600" />
                                <span className="text-sm font-medium text-gray-700">Unduh Sertifikat</span>
                            </Link>
                            <Link 
                                href="/dashboard/instansi/profil"
                                className="flex items-center gap-3 p-3 rounded-lg border hover:bg-green-50 hover:border-green-200 transition-colors"
                            >
                                <BiBuildings className="w-5 h-5 text-green-600" />
                                <span className="text-sm font-medium text-gray-700">Profil Instansi</span>
                            </Link>
                        </div>
                    </div>
                </main>

                {/* Footer */}
                <footer className="border-t bg-white p-4 text-center text-sm text-gray-500">
                    <p>© 2025 BPMP Sulawesi Selatan. All rights reserved.</p>
                </footer>
            </div>
        </div>
    );
}
