"use client"

import { useState, useActionState, useEffect } from "react";
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
    BiLock,
    BiBell,
    BiShield,
    BiCheck,
    BiError
} from "react-icons/bi";
import { logoutAction, changePasswordAction } from "@/actions/auth-action";

interface PengaturanViewProps {
    user: {
        id: string;
        name: string;
        email: string;
    };
    instansiNama: string;
}

export default function PengaturanView({ user, instansiNama }: PengaturanViewProps) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [notifications, setNotifications] = useState({
        email: true,
        pendaftaran: true,
        pengumuman: false
    });
    const [state, formAction, isPending] = useActionState(changePasswordAction, null);

    useEffect(() => {
        if (state?.success) {
            setTimeout(() => {
                setShowPasswordModal(false);
            }, 2000);
        }
    }, [state]);

    const menuItems = [
        { icon: BiHomeAlt, label: "Dashboard", href: "/dashboard/instansi" },
        { icon: BiCalendar, label: "Diklat Tersedia", href: "/dashboard/instansi/diklat" },
        { icon: BiGroup, label: "Peserta", href: "/dashboard/instansi/peserta" },
        { icon: BiHistory, label: "Riwayat", href: "/dashboard/instansi/riwayat" },
        { icon: BiCertification, label: "Sertifikat", href: "/dashboard/instansi/sertifikat" },
        { icon: BiBuildings, label: "Profil Instansi", href: "/dashboard/instansi/profil" },
        { icon: BiCog, label: "Pengaturan", href: "/dashboard/instansi/pengaturan", active: true },
        { icon: BiHelpCircle, label: "Bantuan", href: "/dashboard/instansi/bantuan" },
    ];

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
                                <h1 className="text-lg font-semibold text-gray-800">Pengaturan</h1>
                                <p className="text-sm text-gray-500">Kelola preferensi akun Anda</p>
                            </div>
                        </div>
                    </div>
                </header>

                <main className="p-4 lg:p-6 max-w-4xl">
                    {/* Account Section */}
                    <div className="bg-white rounded-xl shadow-sm border overflow-hidden mb-6">
                        <div className="p-4 border-b bg-gray-50">
                            <div className="flex items-center gap-3">
                                <BiShield className="w-5 h-5 text-gray-600" />
                                <h2 className="font-semibold text-gray-800">Akun</h2>
                            </div>
                        </div>
                        <div className="p-4 space-y-4">
                            <div className="flex items-center justify-between py-2">
                                <div>
                                    <p className="font-medium text-gray-800">Email</p>
                                    <p className="text-sm text-gray-500">{user.email}</p>
                                </div>
                            </div>
                            <div className="flex items-center justify-between py-2">
                                <div>
                                    <p className="font-medium text-gray-800">Nama</p>
                                    <p className="text-sm text-gray-500">{user.name}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Security Section */}
                    <div className="bg-white rounded-xl shadow-sm border overflow-hidden mb-6">
                        <div className="p-4 border-b bg-gray-50">
                            <div className="flex items-center gap-3">
                                <BiLock className="w-5 h-5 text-gray-600" />
                                <h2 className="font-semibold text-gray-800">Keamanan</h2>
                            </div>
                        </div>
                        <div className="p-4">
                            <div className="flex items-center justify-between py-2">
                                <div>
                                    <p className="font-medium text-gray-800">Ubah Password</p>
                                    <p className="text-sm text-gray-500">Ganti password akun Anda</p>
                                </div>
                                <button 
                                    onClick={() => setShowPasswordModal(true)}
                                    className="px-4 py-2 text-sm text-green-600 border border-green-600 rounded-lg hover:bg-green-50 transition-colors"
                                >
                                    Ubah
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Notification Section */}
                    <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                        <div className="p-4 border-b bg-gray-50">
                            <div className="flex items-center gap-3">
                                <BiBell className="w-5 h-5 text-gray-600" />
                                <h2 className="font-semibold text-gray-800">Notifikasi</h2>
                            </div>
                        </div>
                        <div className="p-4 space-y-4">
                            <div className="flex items-center justify-between py-2">
                                <div>
                                    <p className="font-medium text-gray-800">Email Notifikasi</p>
                                    <p className="text-sm text-gray-500">Terima notifikasi via email</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input 
                                        type="checkbox" 
                                        checked={notifications.email}
                                        onChange={(e) => setNotifications(prev => ({ ...prev, email: e.target.checked }))}
                                        className="sr-only peer" 
                                    />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                                </label>
                            </div>
                            <div className="flex items-center justify-between py-2">
                                <div>
                                    <p className="font-medium text-gray-800">Update Pendaftaran</p>
                                    <p className="text-sm text-gray-500">Notifikasi status pendaftaran peserta</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input 
                                        type="checkbox" 
                                        checked={notifications.pendaftaran}
                                        onChange={(e) => setNotifications(prev => ({ ...prev, pendaftaran: e.target.checked }))}
                                        className="sr-only peer" 
                                    />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                                </label>
                            </div>
                            <div className="flex items-center justify-between py-2">
                                <div>
                                    <p className="font-medium text-gray-800">Pengumuman</p>
                                    <p className="text-sm text-gray-500">Info diklat baru dan pengumuman</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input 
                                        type="checkbox" 
                                        checked={notifications.pengumuman}
                                        onChange={(e) => setNotifications(prev => ({ ...prev, pengumuman: e.target.checked }))}
                                        className="sr-only peer" 
                                    />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                                </label>
                            </div>
                        </div>
                    </div>
                </main>
            </div>

            {/* Password Change Modal */}
            {showPasswordModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
                        <div className="p-4 border-b flex items-center justify-between">
                            <h3 className="font-semibold text-gray-800">Ubah Password</h3>
                            <button 
                                onClick={() => setShowPasswordModal(false)}
                                className="p-1 hover:bg-gray-100 rounded-lg"
                            >
                                <BiX className="w-5 h-5" />
                            </button>
                        </div>
                        <form action={formAction} className="p-4 space-y-4">
                            {state?.success && (
                                <div className="p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2 text-green-700">
                                    <BiCheck className="w-5 h-5" />
                                    <span className="text-sm">{state.message}</span>
                                </div>
                            )}
                            {state?.message && !state?.success && (
                                <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
                                    <BiError className="w-5 h-5" />
                                    <span className="text-sm">{state.message}</span>
                                </div>
                            )}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Password Saat Ini
                                </label>
                                <input
                                    type="password"
                                    name="currentPassword"
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                    placeholder="Masukkan password saat ini"
                                />
                                {state?.errors?.currentPassword && (
                                    <p className="text-sm text-red-500 mt-1">{state.errors.currentPassword}</p>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Password Baru
                                </label>
                                <input
                                    type="password"
                                    name="newPassword"
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                    placeholder="Minimal 8 karakter"
                                />
                                {state?.errors?.newPassword && (
                                    <p className="text-sm text-red-500 mt-1">{state.errors.newPassword}</p>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Konfirmasi Password Baru
                                </label>
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                    placeholder="Ulangi password baru"
                                />
                                {state?.errors?.confirmPassword && (
                                    <p className="text-sm text-red-500 mt-1">{state.errors.confirmPassword}</p>
                                )}
                            </div>
                            <div className="flex gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setShowPasswordModal(false)}
                                    className="flex-1 px-4 py-2 text-gray-700 border rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={isPending}
                                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                                >
                                    {isPending ? "Menyimpan..." : "Simpan"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
