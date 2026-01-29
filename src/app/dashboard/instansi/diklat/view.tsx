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
    BiBuildings,
    BiBookOpen,
    BiTime,
    BiMapPin,
    BiSearch,
    BiArrowBack
} from "react-icons/bi";
import { logoutAction } from "@/actions/auth-action";

interface DiklatItem {
    id: string;
    nama: string;
    deskripsi: string;
    metode: string;
    tanggalMulai: Date;
    tanggalSelesai: Date;
    batasPendaftaran: Date;
    lokasi: string | null;
    kuota: number;
    _count: {
        pendaftaranDiklat: number;
    };
}

interface DiklatListViewProps {
    instansiId: string;
    instansiNama: string;
    diklatList: DiklatItem[];
}

export default function DiklatListView({ instansiId, instansiNama, diklatList }: DiklatListViewProps) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    const menuItems = [
        { icon: BiHomeAlt, label: "Dashboard", href: "/dashboard/instansi" },
        { icon: BiCalendar, label: "Diklat Tersedia", href: "/dashboard/instansi/diklat", active: true },
        { icon: BiGroup, label: "Peserta", href: "/dashboard/instansi/peserta" },
        { icon: BiHistory, label: "Riwayat", href: "/dashboard/instansi/riwayat" },
        { icon: BiCertification, label: "Sertifikat", href: "/dashboard/instansi/sertifikat" },
        { icon: BiBuildings, label: "Profil Instansi", href: "/dashboard/instansi/profil" },
        { icon: BiCog, label: "Pengaturan", href: "/dashboard/instansi/pengaturan" },
        { icon: BiHelpCircle, label: "Bantuan", href: "/dashboard/instansi/bantuan" },
    ];

    const formatDate = (date: Date) => {
        return new Date(date).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    const filteredDiklat = diklatList.filter(diklat => 
        diklat.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
        diklat.deskripsi.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Sidebar */}
            <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
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

                <div className="px-4 py-4 border-b bg-green-50">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                            <BiBuildings className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-800 truncate">{instansiNama}</p>
                            <p className="text-xs text-gray-500">Portal Instansi</p>
                        </div>
                    </div>
                </div>

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

            {sidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Main Content */}
            <div className="lg:ml-64">
                <header className="sticky top-0 z-30 bg-white border-b">
                    <div className="flex items-center justify-between h-16 px-4 lg:px-6">
                        <div className="flex items-center gap-4">
                            <button 
                                onClick={() => setSidebarOpen(true)}
                                className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
                            >
                                <BiMenu className="w-6 h-6" />
                            </button>
                            <div className="flex items-center gap-3">
                                <Link href="/dashboard/instansi" className="p-2 hover:bg-gray-100 rounded-lg">
                                    <BiArrowBack className="w-5 h-5" />
                                </Link>
                                <div>
                                    <h1 className="text-lg font-semibold text-gray-800">Diklat Tersedia</h1>
                                    <p className="text-sm text-gray-500">Pilih diklat untuk mendaftarkan peserta</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                <main className="p-4 lg:p-6">
                    {/* Search */}
                    <div className="mb-6">
                        <div className="relative max-w-md">
                            <BiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Cari diklat..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                            />
                        </div>
                    </div>

                    {/* Diklat Grid */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredDiklat.length > 0 ? (
                            filteredDiklat.map((diklat) => (
                                <div key={diklat.id} className="bg-white rounded-xl shadow-sm border overflow-hidden">
                                    <div className="p-4">
                                        <div className="flex items-start justify-between mb-3">
                                            <h3 className="font-semibold text-gray-800 line-clamp-2">{diklat.nama}</h3>
                                            <span className={`text-xs font-medium px-2 py-1 rounded ${
                                                diklat.metode === 'ONLINE' 
                                                    ? 'bg-blue-100 text-blue-700' 
                                                    : 'bg-orange-100 text-orange-700'
                                            }`}>
                                                {diklat.metode}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-500 line-clamp-2 mb-3">{diklat.deskripsi}</p>
                                        
                                        <div className="space-y-2 text-sm">
                                            <div className="flex items-center gap-2 text-gray-600">
                                                <BiTime className="w-4 h-4" />
                                                <span>{formatDate(diklat.tanggalMulai)} - {formatDate(diklat.tanggalSelesai)}</span>
                                            </div>
                                            {diklat.lokasi && (
                                                <div className="flex items-center gap-2 text-gray-600">
                                                    <BiMapPin className="w-4 h-4" />
                                                    <span className="truncate">{diklat.lokasi}</span>
                                                </div>
                                            )}
                                        </div>

                                        <div className="mt-3">
                                            <div className="flex items-center justify-between text-xs mb-1">
                                                <span className="text-gray-500">Kuota Terisi</span>
                                                <span className="text-gray-700">{diklat._count.pendaftaranDiklat}/{diklat.kuota}</span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2">
                                                <div 
                                                    className={`h-2 rounded-full ${
                                                        diklat._count.pendaftaranDiklat >= diklat.kuota 
                                                            ? 'bg-red-500' 
                                                            : 'bg-green-500'
                                                    }`}
                                                    style={{ width: `${Math.min(100, (diklat._count.pendaftaranDiklat / diklat.kuota) * 100)}%` }}
                                                />
                                            </div>
                                        </div>

                                        <div className="mt-2 text-xs text-gray-500">
                                            Batas pendaftaran: {formatDate(diklat.batasPendaftaran)}
                                        </div>
                                    </div>
                                    <div className="p-4 border-t bg-gray-50">
                                        <Link
                                            href={`/dashboard/instansi/diklat/${diklat.id}`}
                                            className={`block w-full py-2 text-center rounded-lg font-medium transition-colors ${
                                                diklat._count.pendaftaranDiklat >= diklat.kuota
                                                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                                    : 'bg-green-600 text-white hover:bg-green-700'
                                            }`}
                                        >
                                            {diklat._count.pendaftaranDiklat >= diklat.kuota ? 'Kuota Penuh' : 'Daftarkan Peserta'}
                                        </Link>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-full bg-white rounded-xl p-12 text-center">
                                <BiCalendar className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                                <h3 className="text-lg font-medium text-gray-800 mb-2">Tidak ada diklat tersedia</h3>
                                <p className="text-gray-500">Belum ada diklat yang dibuka untuk pendaftaran saat ini</p>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
}
