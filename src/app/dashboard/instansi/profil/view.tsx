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
    BiUser,
    BiPhone,
    BiMap,
    BiEnvelope,
    BiEdit,
    BiCheck
} from "react-icons/bi";
import { logoutAction } from "@/actions/auth-action";
import { useRouter } from "next/navigation";
import { updateProfilInstansi } from "@/actions/instansi-action";

interface InstansiData {
    id: string;
    nama: string;
    alamat: string;
    nomorTelepon: string;
    statusRegistrasiInstansi: {
        nama: string;
    };
    registrasiPicInstansi: {
        nama: string;
        email: string;
        nomorTelepon: string;
        jabatan: string | null;
    };
}

interface ProfilViewProps {
    instansi: InstansiData;
}

export default function ProfilView({ instansi }: ProfilViewProps) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    const [formData, setFormData] = useState({
        nama: instansi.nama,
        alamat: instansi.alamat,
        nomorTelepon: instansi.nomorTelepon
    });
    const router = useRouter();

    const menuItems = [
        { icon: BiHomeAlt, label: "Dashboard", href: "/dashboard/instansi" },
        { icon: BiCalendar, label: "Diklat Tersedia", href: "/dashboard/instansi/diklat" },
        { icon: BiGroup, label: "Peserta", href: "/dashboard/instansi/peserta" },
        { icon: BiHistory, label: "Riwayat", href: "/dashboard/instansi/riwayat" },
        { icon: BiCertification, label: "Sertifikat", href: "/dashboard/instansi/sertifikat" },
        { icon: BiBuildings, label: "Profil Instansi", href: "/dashboard/instansi/profil", active: true },
        { icon: BiCog, label: "Pengaturan", href: "/dashboard/instansi/pengaturan" },
        { icon: BiHelpCircle, label: "Bantuan", href: "/dashboard/instansi/bantuan" },
    ];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        const result = await updateProfilInstansi(instansi.id, formData);
        
        setLoading(false);
        
        if (result.success) {
            setMessage({ type: 'success', text: 'Profil berhasil diperbarui' });
            setIsEditing(false);
            router.refresh();
        } else {
            setMessage({ type: 'error', text: result.message || 'Gagal memperbarui profil' });
        }
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
                            <p className="text-sm font-medium text-gray-800 truncate">{instansi.nama}</p>
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
                                <h1 className="text-lg font-semibold text-gray-800">Profil Instansi</h1>
                                <p className="text-sm text-gray-500">Informasi detail instansi Anda</p>
                            </div>
                        </div>
                    </div>
                </header>

                <main className="p-4 lg:p-6 max-w-4xl">
                    {message && (
                        <div className={`mb-4 p-4 rounded-lg flex items-center justify-between ${
                            message.type === 'success' 
                                ? 'bg-green-50 border border-green-200 text-green-700'
                                : 'bg-red-50 border border-red-200 text-red-700'
                        }`}>
                            <span>{message.text}</span>
                            <button onClick={() => setMessage(null)}>
                                <BiX className="w-5 h-5" />
                            </button>
                        </div>
                    )}

                    {/* Instansi Info Card */}
                    <div className="bg-white rounded-xl shadow-sm border overflow-hidden mb-6">
                        <div className="p-4 border-b flex items-center justify-between bg-gray-50">
                            <h2 className="font-semibold text-gray-800">Informasi Instansi</h2>
                            {!isEditing && (
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="flex items-center gap-2 px-3 py-1.5 text-sm text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                >
                                    <BiEdit className="w-4 h-4" />
                                    <span>Edit</span>
                                </button>
                            )}
                        </div>

                        {isEditing ? (
                            <form onSubmit={handleSubmit} className="p-4 space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Nama Instansi
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.nama}
                                        onChange={(e) => setFormData(prev => ({ ...prev, nama: e.target.value }))}
                                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Alamat
                                    </label>
                                    <textarea
                                        value={formData.alamat}
                                        onChange={(e) => setFormData(prev => ({ ...prev, alamat: e.target.value }))}
                                        rows={3}
                                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Nomor Telepon
                                    </label>
                                    <input
                                        type="tel"
                                        value={formData.nomorTelepon}
                                        onChange={(e) => setFormData(prev => ({ ...prev, nomorTelepon: e.target.value }))}
                                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                    />
                                </div>
                                <div className="flex justify-end gap-3 pt-2">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setIsEditing(false);
                                            setFormData({
                                                nama: instansi.nama,
                                                alamat: instansi.alamat,
                                                nomorTelepon: instansi.nomorTelepon
                                            });
                                        }}
                                        className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                                    >
                                        <BiCheck className="w-5 h-5" />
                                        <span>{loading ? "Menyimpan..." : "Simpan"}</span>
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <div className="p-4 space-y-4">
                                <div className="flex items-start gap-3">
                                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center shrink-0">
                                        <BiBuildings className="w-5 h-5 text-green-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Nama Instansi</p>
                                        <p className="font-medium text-gray-800">{instansi.nama}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
                                        <BiMap className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Alamat</p>
                                        <p className="font-medium text-gray-800">{instansi.alamat}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center shrink-0">
                                        <BiPhone className="w-5 h-5 text-purple-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Nomor Telepon</p>
                                        <p className="font-medium text-gray-800">{instansi.nomorTelepon}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center shrink-0">
                                        <BiCheck className="w-5 h-5 text-orange-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Status</p>
                                        <span className="inline-block px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700">
                                            {instansi.statusRegistrasiInstansi.nama}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* PIC Info Card */}
                    <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                        <div className="p-4 border-b bg-gray-50">
                            <h2 className="font-semibold text-gray-800">Informasi PIC</h2>
                        </div>
                        <div className="p-4 space-y-4">
                            <div className="flex items-start gap-3">
                                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center shrink-0">
                                    <BiUser className="w-5 h-5 text-gray-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Nama PIC</p>
                                    <p className="font-medium text-gray-800">{instansi.registrasiPicInstansi.nama}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center shrink-0">
                                    <BiEnvelope className="w-5 h-5 text-gray-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Email</p>
                                    <p className="font-medium text-gray-800">{instansi.registrasiPicInstansi.email}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center shrink-0">
                                    <BiPhone className="w-5 h-5 text-gray-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Nomor Telepon PIC</p>
                                    <p className="font-medium text-gray-800">{instansi.registrasiPicInstansi.nomorTelepon}</p>
                                </div>
                            </div>
                            {instansi.registrasiPicInstansi.jabatan && (
                                <div className="flex items-start gap-3">
                                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center shrink-0">
                                        <BiBuildings className="w-5 h-5 text-gray-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Jabatan</p>
                                        <p className="font-medium text-gray-800">{instansi.registrasiPicInstansi.jabatan}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
