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
    BiUser,
    BiCheck
} from "react-icons/bi";
import { logoutAction } from "@/actions/auth-action";

interface RiwayatItem {
    id: string;
    namaPeserta: string;
    email: string;
    status: string;
    diklat: {
        id: string;
        nama: string;
        metode: string;
        tanggalMulai: Date;
        tanggalSelesai: Date;
    };
}

interface RiwayatViewProps {
    instansiNama: string;
    riwayatList: RiwayatItem[];
}

export default function RiwayatView({ instansiNama, riwayatList }: RiwayatViewProps) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const menuItems = [
        { icon: BiHomeAlt, label: "Dashboard", href: "/dashboard/instansi" },
        { icon: BiCalendar, label: "Diklat Tersedia", href: "/dashboard/instansi/diklat" },
        { icon: BiGroup, label: "Peserta", href: "/dashboard/instansi/peserta" },
        { icon: BiHistory, label: "Riwayat", href: "/dashboard/instansi/riwayat", active: true },
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

    // Group by diklat
    const groupedByDiklat = riwayatList.reduce((acc, item) => {
        const diklatId = item.diklat.id;
        if (!acc[diklatId]) {
            acc[diklatId] = {
                diklat: item.diklat,
                peserta: []
            };
        }
        acc[diklatId].peserta.push(item);
        return acc;
    }, {} as Record<string, { diklat: RiwayatItem['diklat']; peserta: RiwayatItem[] }>);

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
                                <h1 className="text-lg font-semibold text-gray-800">Riwayat Diklat</h1>
                                <p className="text-sm text-gray-500">Diklat yang telah selesai diikuti</p>
                            </div>
                        </div>
                    </div>
                </header>

                <main className="p-4 lg:p-6">
                    {Object.keys(groupedByDiklat).length > 0 ? (
                        <div className="space-y-6">
                            {Object.values(groupedByDiklat).map(({ diklat, peserta }) => (
                                <div key={diklat.id} className="bg-white rounded-xl shadow-sm border overflow-hidden">
                                    <div className="p-4 border-b bg-gray-50">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <h3 className="font-semibold text-gray-800">{diklat.nama}</h3>
                                                <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                                                    <span className="flex items-center gap-1">
                                                        <BiTime className="w-4 h-4" />
                                                        {formatDate(diklat.tanggalMulai)} - {formatDate(diklat.tanggalSelesai)}
                                                    </span>
                                                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                                                        diklat.metode === 'ONLINE' 
                                                            ? 'bg-blue-100 text-blue-700' 
                                                            : 'bg-orange-100 text-orange-700'
                                                    }`}>
                                                        {diklat.metode}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2 text-green-600">
                                                <BiCheck className="w-5 h-5" />
                                                <span className="text-sm font-medium">Selesai</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="divide-y">
                                        {peserta.map((p) => (
                                            <div key={p.id} className="p-4 flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                                                        <BiUser className="w-5 h-5 text-gray-600" />
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-gray-800">{p.namaPeserta}</p>
                                                        <p className="text-sm text-gray-500">{p.email}</p>
                                                    </div>
                                                </div>
                                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                                    p.status === 'HADIR' 
                                                        ? 'bg-green-100 text-green-700'
                                                        : 'bg-gray-100 text-gray-700'
                                                }`}>
                                                    {p.status === 'HADIR' ? 'Hadir' : p.status}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white rounded-xl p-12 text-center">
                            <BiHistory className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                            <h3 className="text-lg font-medium text-gray-800 mb-2">Belum Ada Riwayat</h3>
                            <p className="text-gray-500 mb-4">Peserta yang telah mengikuti diklat akan muncul di sini</p>
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
