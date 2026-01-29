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
    BiDownload,
    BiUser,
    BiSearch
} from "react-icons/bi";
import { logoutAction } from "@/actions/auth-action";

interface SertifikatItem {
    id: string;
    namaPeserta: string;
    email: string;
    diklat: {
        id: string;
        nama: string;
        metode: string;
        tanggalMulai: Date;
        tanggalSelesai: Date;
    };
}

interface SertifikatViewProps {
    instansiNama: string;
    sertifikatList: SertifikatItem[];
}

export default function SertifikatView({ instansiNama, sertifikatList }: SertifikatViewProps) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    const menuItems = [
        { icon: BiHomeAlt, label: "Dashboard", href: "/dashboard/instansi" },
        { icon: BiCalendar, label: "Diklat Tersedia", href: "/dashboard/instansi/diklat" },
        { icon: BiGroup, label: "Peserta", href: "/dashboard/instansi/peserta" },
        { icon: BiHistory, label: "Riwayat", href: "/dashboard/instansi/riwayat" },
        { icon: BiCertification, label: "Sertifikat", href: "/dashboard/instansi/sertifikat", active: true },
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

    const filteredList = sertifikatList.filter(item => 
        item.namaPeserta.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.diklat.nama.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleDownload = (item: SertifikatItem) => {
        // TODO: Implement actual certificate download
        alert(`Fitur unduh sertifikat untuk ${item.namaPeserta} akan segera tersedia`);
    };

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
                            <div>
                                <h1 className="text-lg font-semibold text-gray-800">Sertifikat</h1>
                                <p className="text-sm text-gray-500">Unduh sertifikat kehadiran diklat</p>
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
                                placeholder="Cari nama peserta atau diklat..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                            />
                        </div>
                    </div>

                    {/* Sertifikat Grid */}
                    {filteredList.length > 0 ? (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {filteredList.map((item) => (
                                <div key={item.id} className="bg-white rounded-xl shadow-sm border overflow-hidden">
                                    <div className="p-4 border-b bg-gradient-to-r from-green-500 to-green-600">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                                                <BiCertification className="w-7 h-7 text-white" />
                                            </div>
                                            <div className="text-white">
                                                <p className="font-semibold">Sertifikat</p>
                                                <p className="text-sm opacity-80">Kehadiran Diklat</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-4">
                                        <div className="flex items-center gap-3 mb-3">
                                            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                                                <BiUser className="w-5 h-5 text-gray-600" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-800">{item.namaPeserta}</p>
                                                <p className="text-sm text-gray-500">{item.email}</p>
                                            </div>
                                        </div>
                                        <div className="mb-4">
                                            <p className="text-sm font-medium text-gray-800">{item.diklat.nama}</p>
                                            <p className="text-xs text-gray-500 mt-1">
                                                {formatDate(item.diklat.tanggalMulai)} - {formatDate(item.diklat.tanggalSelesai)}
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => handleDownload(item)}
                                            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                                        >
                                            <BiDownload className="w-5 h-5" />
                                            <span>Unduh Sertifikat</span>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white rounded-xl p-12 text-center">
                            <BiCertification className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                            <h3 className="text-lg font-medium text-gray-800 mb-2">Belum Ada Sertifikat</h3>
                            <p className="text-gray-500 mb-4">Sertifikat akan tersedia setelah peserta mengikuti diklat</p>
                            <Link 
                                href="/dashboard/instansi/diklat"
                                className="inline-block px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                            >
                                Lihat Diklat Tersedia
                            </Link>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}
