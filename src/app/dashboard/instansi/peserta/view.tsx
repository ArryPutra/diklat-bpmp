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
    BiSearch,
    BiUser,
    BiFilter
} from "react-icons/bi";
import { logoutAction } from "@/actions/auth-action";

interface PesertaItem {
    id: string;
    namaPeserta: string;
    email: string;
    nomorTelepon: string;
    jabatan: string | null;
    status: string;
    createdAt: Date;
    diklat: {
        id: string;
        nama: string;
        metode: string;
        tanggalMulai: Date;
        tanggalSelesai: Date;
    };
}

interface PesertaViewProps {
    instansiId: string;
    instansiNama: string;
    pesertaList: PesertaItem[];
}

export default function PesertaView({ instansiId, instansiNama, pesertaList }: PesertaViewProps) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("");

    const menuItems = [
        { icon: BiHomeAlt, label: "Dashboard", href: "/dashboard/instansi" },
        { icon: BiCalendar, label: "Diklat Tersedia", href: "/dashboard/instansi/diklat" },
        { icon: BiGroup, label: "Peserta", href: "/dashboard/instansi/peserta", active: true },
        { icon: BiHistory, label: "Riwayat", href: "/dashboard/instansi/riwayat" },
        { icon: BiCertification, label: "Sertifikat", href: "/dashboard/instansi/sertifikat" },
        { icon: BiBuildings, label: "Profil Instansi", href: "/dashboard/instansi/profil" },
        { icon: BiCog, label: "Pengaturan", href: "/dashboard/instansi/pengaturan" },
        { icon: BiHelpCircle, label: "Bantuan", href: "/dashboard/instansi/bantuan" },
    ];

    const formatDate = (date: Date) => {
        return new Date(date).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

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

    const filteredPeserta = pesertaList.filter(peserta => {
        const matchSearch = peserta.namaPeserta.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           peserta.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           peserta.diklat.nama.toLowerCase().includes(searchQuery.toLowerCase());
        const matchStatus = statusFilter === "" || peserta.status === statusFilter;
        return matchSearch && matchStatus;
    });

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
                                <h1 className="text-lg font-semibold text-gray-800">Daftar Peserta</h1>
                                <p className="text-sm text-gray-500">{pesertaList.length} peserta terdaftar</p>
                            </div>
                        </div>
                        <Link 
                            href="/dashboard/instansi/diklat"
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                        >
                            Daftarkan Peserta
                        </Link>
                    </div>
                </header>

                <main className="p-4 lg:p-6">
                    {/* Filters */}
                    <div className="mb-6 flex flex-col md:flex-row gap-4">
                        <div className="relative flex-1">
                            <BiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Cari nama, email, atau diklat..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                            />
                        </div>
                        <div className="relative">
                            <BiFilter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="pl-10 pr-8 py-2.5 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 appearance-none bg-white"
                            >
                                <option value="">Semua Status</option>
                                <option value="MENUNGGU">Menunggu</option>
                                <option value="DITERIMA">Diterima</option>
                                <option value="DITOLAK">Ditolak</option>
                                <option value="HADIR">Hadir</option>
                            </select>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Peserta</th>
                                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Diklat</th>
                                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Tanggal</th>
                                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {filteredPeserta.length > 0 ? (
                                        filteredPeserta.map((peserta) => (
                                            <tr key={peserta.id} className="hover:bg-gray-50">
                                                <td className="px-4 py-3">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                                                            <BiUser className="w-5 h-5 text-gray-600" />
                                                        </div>
                                                        <div>
                                                            <p className="font-medium text-gray-800">{peserta.namaPeserta}</p>
                                                            <p className="text-sm text-gray-500">{peserta.email}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <p className="font-medium text-gray-800">{peserta.diklat.nama}</p>
                                                    <span className={`text-xs font-medium px-2 py-0.5 rounded ${
                                                        peserta.diklat.metode === 'ONLINE' 
                                                            ? 'bg-blue-100 text-blue-700' 
                                                            : 'bg-orange-100 text-orange-700'
                                                    }`}>
                                                        {peserta.diklat.metode}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 text-sm text-gray-600">
                                                    {formatDate(peserta.diklat.tanggalMulai)}
                                                </td>
                                                <td className="px-4 py-3">
                                                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(peserta.status)}`}>
                                                        {getStatusLabel(peserta.status)}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={4} className="px-4 py-12 text-center text-gray-500">
                                                <BiGroup className="w-12 h-12 mx-auto text-gray-300 mb-2" />
                                                <p>Tidak ada peserta ditemukan</p>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
