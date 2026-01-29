"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState, useTransition } from 'react';
import { updateStatusRegistrasiInstansi } from '@/actions/dashboard-action';
import { logoutAction } from '@/actions/auth-action';
import {
    BiBarChart,
    BiBell,
    BiBookOpen,
    BiBuilding,
    BiCalendar,
    BiCheck,
    BiCheckCircle,
    BiChevronDown,
    BiChevronRight,
    BiCog,
    BiDotsVerticalRounded,
    BiDownload,
    BiEdit,
    BiEnvelope,
    BiErrorCircle,
    BiExport,
    BiFilter,
    BiGroup,
    BiHelpCircle,
    BiHome,
    BiInfoCircle,
    BiLineChart,
    BiLogOut,
    BiMenu,
    BiMoon,
    BiPlus,
    BiRefresh,
    BiSearch,
    BiSun,
    BiTime,
    BiTimeFive,
    BiTrash,
    BiTrendingDown,
    BiTrendingUp,
    BiUser,
    BiX
} from 'react-icons/bi';
import { TipeAktivitas } from '@/generated/prisma/enums';

// Data dummy untuk notifikasi (tetap dummy untuk sekarang)
const notifications = [
    { id: 1, title: "Pendaftaran Baru", message: "Ada instansi baru mengajukan pendaftaran", time: "2 jam lalu", read: false },
    { id: 2, title: "Kuota Hampir Penuh", message: "Workshop hampir mencapai kuota maksimal", time: "5 jam lalu", read: false },
    { id: 3, title: "Diklat Akan Dimulai", message: "Pelatihan akan dimulai dalam 3 hari", time: "1 hari lalu", read: true },
];

// Data dummy untuk quick actions
const quickActions = [
    { icon: BiPlus, label: "Tambah Diklat", color: "bg-blue-500 hover:bg-blue-600", href: "/dashboard/admin/diklat/tambah" },
    { icon: BiBuilding, label: "Verifikasi Instansi", color: "bg-emerald-500 hover:bg-emerald-600", href: "/dashboard/admin/instansi" },
    { icon: BiDownload, label: "Export Laporan", color: "bg-violet-500 hover:bg-violet-600", href: "/dashboard/admin/laporan" },
    { icon: BiEnvelope, label: "Kelola Peserta", color: "bg-amber-500 hover:bg-amber-600", href: "/dashboard/admin/peserta" },
];

// Data untuk jadwal mendatang
const upcomingSchedule = [
    { id: 1, nama: "Pembukaan Diklat Teknologi", waktu: "09:00", tanggal: "1 Feb 2026", type: "event" },
    { id: 2, nama: "Rapat Evaluasi Bulanan", waktu: "14:00", tanggal: "2 Feb 2026", type: "meeting" },
    { id: 3, nama: "Deadline Pendaftaran Workshop", waktu: "23:59", tanggal: "5 Feb 2026", type: "deadline" },
];

const menuItems = [
    { icon: BiHome, label: "Dashboard", href: "/dashboard/admin", active: true },
    { icon: BiBookOpen, label: "Kelola Diklat", href: "/dashboard/admin/diklat", badge: 0 },
    { icon: BiBuilding, label: "Instansi", href: "/dashboard/admin/instansi", badge: 0 },
    { icon: BiGroup, label: "Peserta", href: "/dashboard/admin/peserta" },
    { icon: BiBarChart, label: "Laporan", href: "/dashboard/admin/laporan" },
    { icon: BiCog, label: "Pengaturan", href: "/dashboard/admin/pengaturan" },
    { icon: BiHelpCircle, label: "Bantuan", href: "/dashboard/admin/bantuan" },
];

// Types for props
interface DashboardStats {
    totalDiklat: number;
    diklatAktif: number;
    totalInstansi: number;
    instansiMenunggu: number;
    totalPeserta: number;
    pesertaBulanIni: number;
}

interface DiklatItem {
    id: string;
    nama: string;
    metode: string;
    tanggalMulai: Date;
    tanggalSelesai: Date;
    kuota: number;
    isActive: boolean;
    _count: {
        pendaftaranDiklat: number;
    };
}

interface InstansiItem {
    id: string;
    nama: string;
    email: string;
    nomorTelepon: string;
    createdAt: Date;
    statusRegistrasiInstansi: {
        id: number;
        nama: string;
    };
    registrasiPicInstansi: {
        nama: string;
        email: string;
        nomorTelepon: string;
    } | null;
}

interface AktivitasItem {
    id: string;
    aksi: string;
    detail: string | null;
    tipe: TipeAktivitas;
    createdAt: Date;
}

interface WeeklyDataItem {
    day: string;
    peserta: number;
    diklat: number;
}

// Simple bar chart component
function MiniBarChart({ data }: { data: WeeklyDataItem[] }) {
    const maxValue = Math.max(...data.map(d => d.peserta), 1);

    return (
        <div className="flex items-end justify-between gap-2 h-32 px-2">
            {data.map((item, index) => (
                <div key={index} className="flex flex-col items-center gap-2 flex-1">
                    <div className="w-full flex flex-col items-center gap-1">
                        <span className="text-xs text-gray-500">{item.peserta}</span>
                        <div
                            className="w-full bg-gradient-to-t from-primary to-primary/70 rounded-t-md transition-all duration-500 hover:from-primary/90 hover:to-primary/60"
                            style={{ height: `${Math.max((item.peserta / maxValue) * 80, 4)}px` }}
                        />
                    </div>
                    <span className="text-xs text-gray-400">{item.day}</span>
                </div>
            ))}
        </div>
    );
}

// Progress bar component
function ProgressBar({ value, className }: { value: number; className?: string }) {
    return (
        <div className={cn("w-full bg-gray-200 rounded-full h-2", className)}>
            <div
                className={cn(
                    "h-2 rounded-full transition-all duration-500",
                    value >= 90 ? "bg-red-500" : value >= 70 ? "bg-yellow-500" : "bg-green-500"
                )}
                style={{ width: `${value}%` }}
            />
        </div>
    );
}

export default function DashboardView({
    user,
    stats,
    diklatList,
    instansiList,
    aktivitasList,
    weeklyData
}: {
    user: any;
    stats: DashboardStats | null;
    diklatList: DiklatItem[];
    instansiList: InstansiItem[];
    aktivitasList: AktivitasItem[];
    weeklyData: WeeklyDataItem[];
}) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [currentTime, setCurrentTime] = useState(new Date());
    const [selectedPeriod, setSelectedPeriod] = useState("Minggu Ini");
    const [isPending, startTransition] = useTransition();

    // Build stats data from real data
    const statsData = [
        { label: "Total Diklat", value: stats?.totalDiklat || 0, icon: BiBookOpen, change: `+${stats?.diklatAktif || 0} aktif`, trend: "up", color: "bg-gradient-to-br from-blue-500 to-blue-600" },
        { label: "Peserta Aktif", value: stats?.totalPeserta || 0, icon: BiGroup, change: `+${stats?.pesertaBulanIni || 0} bulan ini`, trend: "up", color: "bg-gradient-to-br from-emerald-500 to-emerald-600" },
        { label: "Instansi Terdaftar", value: stats?.totalInstansi || 0, icon: BiBuilding, change: `${stats?.instansiMenunggu || 0} menunggu`, trend: "up", color: "bg-gradient-to-br from-violet-500 to-violet-600" },
        { label: "Diklat Aktif", value: stats?.diklatAktif || 0, icon: BiCalendar, change: "sedang berjalan", trend: "up", color: "bg-gradient-to-br from-amber-500 to-amber-600" },
    ];

    // Format relative time
    const formatRelativeTime = (date: Date) => {
        const now = new Date();
        const diffMs = now.getTime() - new Date(date).getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return "Baru saja";
        if (diffMins < 60) return `${diffMins} menit lalu`;
        if (diffHours < 24) return `${diffHours} jam lalu`;
        return `${diffDays} hari lalu`;
    };

    // Get activity icon based on type
    const getActivityIcon = (tipe: TipeAktivitas) => {
        switch (tipe) {
            case 'CREATE': return BiPlus;
            case 'APPROVE': return BiCheckCircle;
            case 'REJECT': return BiErrorCircle;
            case 'REGISTER': return BiUser;
            case 'UPDATE': return BiEdit;
            case 'DELETE': return BiTrash;
            default: return BiInfoCircle;
        }
    };

    // Handle approve/reject instansi
    const handleUpdateStatus = (id: string, statusId: number) => {
        startTransition(async () => {
            await updateStatusRegistrasiInstansi(id, statusId, user?.id);
        });
    };

    useEffect(() => {
        setMounted(true);
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const formatDate = (date: Date) => {
        return date.toLocaleDateString('id-ID', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString('id-ID', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const unreadNotifications = notifications.filter(n => !n.read).length;

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-50 to-gray-100">
            {/* Sidebar */}
            <aside className={cn(
                "fixed left-0 top-0 z-40 h-screen w-64 bg-white border-r shadow-xl transition-transform duration-300",
                "max-lg:w-full max-lg:max-w-xs",
                sidebarOpen ? "translate-x-0" : "max-lg:-translate-x-full"
            )}>
                <div className="flex flex-col h-full">
                    {/* Logo */}
                    <div className="flex items-center justify-between h-16 px-4 border-b bg-gradient-to-r from-primary/5 to-transparent">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg shadow-primary/20">
                                <BiBookOpen className="text-white" size={20} />
                            </div>
                            <div>
                                <p className="font-bold text-sm">DIKLAT</p>
                                <p className="text-xs text-gray-500">BPMP Kalsel</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setSidebarOpen(false)}
                            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                            <BiX size={24} />
                        </button>
                    </div>

                    {/* Menu */}
                    <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
                        <p className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">Menu Utama</p>
                        {menuItems.map((item, index) => (
                            <Link
                                key={index}
                                href={item.href}
                                className={cn(
                                    "flex items-center justify-between gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
                                    item.active
                                        ? "bg-gradient-to-r from-primary to-primary/90 text-white shadow-lg shadow-primary/30"
                                        : "text-gray-600 hover:bg-gray-100 hover:text-primary hover:translate-x-1"
                                )}
                            >
                                <div className="flex items-center gap-3">
                                    <item.icon size={20} className={item.active ? "" : "group-hover:scale-110 transition-transform"} />
                                    <span className="font-medium">{item.label}</span>
                                </div>
                                {item.badge && (
                                    <span className={cn(
                                        "px-2 py-0.5 text-xs font-bold rounded-full",
                                        item.active ? "bg-white/20 text-white" : "bg-red-100 text-red-600"
                                    )}>
                                        {item.badge}
                                    </span>
                                )}
                            </Link>
                        ))}
                    </nav>

                    {/* User Profile */}
                    <div className="p-4 border-t">
                        <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-150 transition-all cursor-pointer group">
                            <div className="relative">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center text-white font-bold shadow-lg">
                                    {user?.name?.charAt(0) || "A"}
                                </div>
                                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-semibold text-sm truncate">{user?.name || "Admin"}</p>
                                <p className="text-xs text-gray-500 truncate">{user?.email || "admin@bpmp.go.id"}</p>
                            </div>
                            <BiChevronRight className="text-gray-400 group-hover:translate-x-1 transition-transform" />
                        </div>
                    </div>
                </div>
            </aside>

            {/* Overlay for mobile */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Main Content */}
            <div className="lg:ml-64">
                {/* Header */}
                <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-xl border-b shadow-sm">
                    <div className="flex items-center justify-between h-16 px-4 lg:px-8">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setSidebarOpen(true)}
                                className="lg:hidden p-2 rounded-xl hover:bg-gray-100 transition-colors"
                            >
                                <BiMenu size={24} />
                            </button>
                            <div className="relative max-md:hidden">
                                <BiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Cari diklat, instansi, peserta..."
                                    className="pl-10 pr-4 py-2.5 w-80 rounded-xl border bg-gray-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all"
                                />
                                <kbd className="absolute right-3 top-1/2 -translate-y-1/2 px-2 py-0.5 text-xs bg-gray-100 rounded border text-gray-500">⌘K</kbd>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            {/* Time Display */}
                            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-50 text-sm">
                                <BiTimeFive className="text-gray-400" />
                                <span className="text-gray-600 font-medium">{formatTime(currentTime)}</span>
                            </div>

                            {/* Notifications */}
                            <div className="relative">
                                <button
                                    onClick={() => setShowNotifications(!showNotifications)}
                                    className="relative p-2.5 rounded-xl hover:bg-gray-100 transition-colors"
                                >
                                    <BiBell size={22} />
                                    {unreadNotifications > 0 && (
                                        <span className="absolute top-1.5 right-1.5 w-5 h-5 bg-red-500 rounded-full text-white text-xs flex items-center justify-center font-bold animate-pulse">
                                            {unreadNotifications}
                                        </span>
                                    )}
                                </button>

                                {/* Notifications Dropdown */}
                                {showNotifications && (
                                    <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border overflow-hidden z-50">
                                        <div className="p-4 border-b bg-gray-50">
                                            <div className="flex items-center justify-between">
                                                <h3 className="font-semibold">Notifikasi</h3>
                                                <button className="text-xs text-primary hover:underline">Tandai semua dibaca</button>
                                            </div>
                                        </div>
                                        <div className="max-h-80 overflow-y-auto">
                                            {notifications.map((notif) => (
                                                <div key={notif.id} className={cn(
                                                    "p-4 border-b hover:bg-gray-50 cursor-pointer transition-colors",
                                                    !notif.read && "bg-primary/5"
                                                )}>
                                                    <div className="flex gap-3">
                                                        <div className={cn(
                                                            "w-2 h-2 rounded-full mt-2 flex-shrink-0",
                                                            notif.read ? "bg-gray-300" : "bg-primary"
                                                        )} />
                                                        <div>
                                                            <p className="font-medium text-sm">{notif.title}</p>
                                                            <p className="text-xs text-gray-500 mt-1">{notif.message}</p>
                                                            <p className="text-xs text-gray-400 mt-1">{notif.time}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="p-3 border-t bg-gray-50">
                                            <button className="w-full text-sm text-primary hover:underline">Lihat semua notifikasi</button>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <Separator orientation="vertical" className="h-8 mx-1" />

                            {/* User Menu */}
                            <div className="relative">
                                <button
                                    onClick={() => setShowUserMenu(!showUserMenu)}
                                    className="flex items-center gap-2 p-1.5 pr-3 rounded-xl hover:bg-gray-100 transition-colors"
                                >
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center text-white font-bold text-sm">
                                        {user?.name?.charAt(0) || "A"}
                                    </div>
                                    <span className="font-medium text-sm max-sm:hidden">{user?.name?.split(' ')[0] || "Admin"}</span>
                                    <BiChevronDown className="text-gray-400 max-sm:hidden" />
                                </button>

                                {/* User Dropdown */}
                                {showUserMenu && (
                                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border overflow-hidden z-50">
                                        <div className="p-4 border-b bg-gray-50">
                                            <p className="font-semibold">{user?.name || "Admin"}</p>
                                            <p className="text-xs text-gray-500">{user?.email || "admin@bpmp.go.id"}</p>
                                        </div>
                                        <div className="py-2">
                                            <Link 
                                                href="/dashboard/admin/pengaturan"
                                                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-3"
                                            >
                                                <BiUser /> Profil Saya
                                            </Link>
                                            <Link 
                                                href="/dashboard/admin/pengaturan"
                                                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-3"
                                            >
                                                <BiCog /> Pengaturan
                                            </Link>
                                        </div>
                                        <div className="border-t py-2">
                                            <form action={logoutAction}>
                                                <button 
                                                    type="submit"
                                                    className="w-full px-4 py-2 text-left text-sm text-red-500 hover:bg-red-50 flex items-center gap-3"
                                                >
                                                    <BiLogOut /> Keluar
                                                </button>
                                            </form>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="p-4 lg:p-8">
                    {/* Welcome Section */}
                    <div className={cn(
                        "flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8 transition-all duration-700",
                        mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                    )}>
                        <div>
                            <h1 className="text-2xl lg:text-3xl font-bold">
                                Selamat Datang, <span className="gradient-text">{user?.name || "Admin"}</span>! 👋
                            </h1>
                            <p className="text-gray-500 mt-1 flex items-center gap-2">
                                <BiCalendar className="text-gray-400" />
                                {formatDate(currentTime)}
                            </p>
                        </div>

                        {/* Quick Actions */}
                        <div className="flex flex-wrap gap-2">
                            {quickActions.map((action, index) => (
                                <Button
                                    key={index}
                                    className={cn(
                                        "text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300",
                                        action.color
                                    )}
                                    size="sm"
                                >
                                    <action.icon size={16} />
                                    <span className="max-sm:hidden">{action.label}</span>
                                </Button>
                            ))}
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className={cn(
                        "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 transition-all duration-700 delay-100",
                        mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                    )}>
                        {statsData.map((stat, index) => (
                            <Card key={index} className="group hover-lift border-0 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden">
                                <CardContent className="p-6 relative">
                                    {/* Background decoration */}
                                    <div className={cn(
                                        "absolute -right-4 -top-4 w-24 h-24 rounded-full opacity-10 group-hover:opacity-20 transition-opacity",
                                        stat.color
                                    )} />

                                    <div className="flex items-start justify-between relative">
                                        <div>
                                            <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
                                            <p className="text-3xl font-bold mt-2">{stat.value.toLocaleString()}</p>
                                            <p className={cn(
                                                "text-sm mt-3 flex items-center gap-1 font-medium",
                                                stat.trend === "up" ? "text-emerald-600" : stat.trend === "down" ? "text-red-500" : "text-gray-500"
                                            )}>
                                                {stat.trend === "up" ? <BiTrendingUp /> : stat.trend === "down" ? <BiTrendingDown /> : null}
                                                {stat.change}
                                                <span className="text-gray-400 font-normal ml-1">dari bulan lalu</span>
                                            </p>
                                        </div>
                                        <div className={cn(
                                            "p-4 rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300",
                                            stat.color
                                        )}>
                                            <stat.icon className="text-white" size={24} />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {/* Main Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Chart Section */}
                        <Card className={cn(
                            "lg:col-span-2 border-0 shadow-md transition-all duration-700 delay-150",
                            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                        )}>
                            <CardHeader className="flex flex-row items-center justify-between">
                                <div>
                                    <CardTitle className="flex items-center gap-2">
                                        <BiLineChart className="text-primary" />
                                        Statistik Pendaftaran
                                    </CardTitle>
                                    <CardDescription>Jumlah peserta yang mendaftar per hari</CardDescription>
                                </div>
                                <div className="flex items-center gap-2">
                                    <select
                                        value={selectedPeriod}
                                        onChange={(e) => setSelectedPeriod(e.target.value)}
                                        className="px-3 py-1.5 text-sm border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/20"
                                    >
                                        <option>Minggu Ini</option>
                                        <option>Bulan Ini</option>
                                        <option>Tahun Ini</option>
                                    </select>
                                    <Button variant="ghost" size="sm" className="p-2">
                                        <BiRefresh size={18} />
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <MiniBarChart data={weeklyData} />
                                <div className="flex items-center justify-center gap-6 mt-4 pt-4 border-t">
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full bg-primary" />
                                        <span className="text-sm text-gray-500">Peserta Baru</span>
                                    </div>
                                    <div className="text-sm">
                                        <span className="font-semibold text-emerald-600">+15%</span>
                                        <span className="text-gray-400 ml-1">dari minggu lalu</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Jadwal Mendatang */}
                        <Card className={cn(
                            "border-0 shadow-md transition-all duration-700 delay-200",
                            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                        )}>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <BiCalendar className="text-primary" />
                                    Jadwal Mendatang
                                </CardTitle>
                                <CardDescription>Kegiatan yang akan datang</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {upcomingSchedule.map((schedule) => (
                                        <div key={schedule.id} className="flex gap-3 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                                            <div className={cn(
                                                "w-12 h-12 rounded-xl flex flex-col items-center justify-center text-white text-xs font-bold",
                                                schedule.type === "event" ? "bg-blue-500" :
                                                    schedule.type === "meeting" ? "bg-violet-500" : "bg-red-500"
                                            )}>
                                                <span>{schedule.tanggal.split(' ')[0]}</span>
                                                <span className="text-[10px] opacity-80">{schedule.tanggal.split(' ')[1]}</span>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium text-sm truncate">{schedule.nama}</p>
                                                <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                                                    <BiTime /> {schedule.waktu} WITA
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Diklat Terbaru */}
                        <Card className={cn(
                            "lg:col-span-2 border-0 shadow-md transition-all duration-700 delay-250",
                            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                        )}>
                            <CardHeader className="flex flex-row items-center justify-between">
                                <div>
                                    <CardTitle className="flex items-center gap-2">
                                        <BiBookOpen className="text-primary" />
                                        Diklat Terbaru
                                    </CardTitle>
                                    <CardDescription>Daftar diklat yang sedang berjalan</CardDescription>
                                </div>
                                <div className="flex gap-2">
                                    <Button variant="outline" size="sm" className="hover-lift">
                                        <BiFilter /> Filter
                                    </Button>
                                    <Button size="sm" className="hover-lift bg-gradient-to-r from-primary to-primary/90 shadow-lg shadow-primary/20">
                                        <BiPlus /> Tambah
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {diklatList.length === 0 ? (
                                        <div className="text-center py-8 text-gray-500">
                                            <BiBookOpen className="mx-auto text-4xl mb-2 text-gray-300" />
                                            <p>Belum ada diklat</p>
                                            <Link href="/dashboard/admin/diklat/tambah">
                                                <Button size="sm" className="mt-2">
                                                    <BiPlus /> Tambah Diklat Pertama
                                                </Button>
                                            </Link>
                                        </div>
                                    ) : diklatList.map((diklat) => {
                                        const pesertaCount = diklat._count.pendaftaranDiklat;
                                        const progress = Math.round((pesertaCount / diklat.kuota) * 100);
                                        const status = progress >= 100 ? "full" : progress >= 80 ? "almost-full" : "active";
                                        const tanggalFormatted = new Date(diklat.tanggalMulai).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });

                                        return (
                                            <div
                                                key={diklat.id}
                                                className="group flex items-center justify-between p-4 rounded-xl bg-gray-50 hover:bg-white hover:shadow-md transition-all duration-300 border border-transparent hover:border-gray-200"
                                            >
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2">
                                                        <p className="font-semibold truncate">{diklat.nama}</p>
                                                        <span className={cn(
                                                            "px-2 py-0.5 rounded text-xs font-medium",
                                                            diklat.metode === "ONLINE" ? "bg-blue-100 text-blue-700" :
                                                                diklat.metode === "OFFLINE" ? "bg-green-100 text-green-700" :
                                                                    "bg-violet-100 text-violet-700"
                                                        )}>
                                                            {diklat.metode}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                                                        <span className="flex items-center gap-1">
                                                            <BiCalendar /> {tanggalFormatted}
                                                        </span>
                                                        <span className="flex items-center gap-1">
                                                            <BiGroup /> {pesertaCount}/{diklat.kuota} peserta
                                                        </span>
                                                    </div>
                                                    <div className="mt-3">
                                                        <ProgressBar value={progress} />
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3 ml-4">
                                                    <span className={cn(
                                                        "px-3 py-1.5 rounded-full text-xs font-semibold",
                                                        status === "active" && "bg-emerald-100 text-emerald-700",
                                                        status === "almost-full" && "bg-amber-100 text-amber-700",
                                                        status === "full" && "bg-red-100 text-red-700"
                                                    )}>
                                                        {status === "active" && "Aktif"}
                                                        {status === "almost-full" && "Hampir Penuh"}
                                                        {status === "full" && "Penuh"}
                                                    </span>
                                                    <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <BiDotsVerticalRounded />
                                                    </Button>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Aktivitas Terbaru */}
                        <Card className={cn(
                            "border-0 shadow-md transition-all duration-700 delay-300",
                            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                        )}>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <BiTime className="text-primary" />
                                    Aktivitas Terbaru
                                </CardTitle>
                                <CardDescription>Log aktivitas sistem</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {aktivitasList.length === 0 ? (
                                        <div className="text-center py-4 text-gray-500 text-sm">
                                            Belum ada aktivitas
                                        </div>
                                    ) : aktivitasList.map((activity) => {
                                        const ActivityIcon = getActivityIcon(activity.tipe);
                                        return (
                                            <div key={activity.id} className="flex gap-3 group">
                                                <div className={cn(
                                                    "w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110",
                                                    activity.tipe === "CREATE" && "bg-blue-100 text-blue-600",
                                                    activity.tipe === "APPROVE" && "bg-emerald-100 text-emerald-600",
                                                    activity.tipe === "REGISTER" && "bg-violet-100 text-violet-600",
                                                    activity.tipe === "UPDATE" && "bg-amber-100 text-amber-600",
                                                    activity.tipe === "REJECT" && "bg-red-100 text-red-600",
                                                    activity.tipe === "DELETE" && "bg-red-100 text-red-600",
                                                    activity.tipe === "INFO" && "bg-gray-100 text-gray-600"
                                                )}>
                                                    <ActivityIcon size={16} />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium">{activity.aksi}</p>
                                                    <p className="text-xs text-gray-500 truncate">{activity.detail}</p>
                                                    <p className="text-xs text-gray-400 mt-1">{formatRelativeTime(activity.createdAt)}</p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                                <Button variant="ghost" className="w-full mt-4 text-primary hover:text-primary/80">
                                    Lihat Semua Aktivitas
                                </Button>
                            </CardContent>
                        </Card>

                        {/* Pendaftaran Instansi */}
                        <Card className={cn(
                            "lg:col-span-3 border-0 shadow-md transition-all duration-700 delay-400",
                            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                        )}>
                            <CardHeader className="flex flex-row items-center justify-between">
                                <div>
                                    <CardTitle className="flex items-center gap-2">
                                        <BiBuilding className="text-primary" />
                                        Pendaftaran Instansi Terbaru
                                    </CardTitle>
                                    <CardDescription>Permintaan pendaftaran instansi yang perlu ditinjau</CardDescription>
                                </div>
                                <div className="flex gap-2">
                                    <Button variant="outline" size="sm" className="hover-lift">
                                        <BiExport /> Export
                                    </Button>
                                    <Button variant="outline" size="sm" className="hover-lift">
                                        Lihat Semua
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="overflow-x-auto">
                                    {instansiList.length === 0 ? (
                                        <div className="text-center py-8 text-gray-500">
                                            <BiBuilding className="mx-auto text-4xl mb-2 text-gray-300" />
                                            <p>Belum ada pendaftaran instansi</p>
                                        </div>
                                    ) : (
                                        <table className="w-full">
                                            <thead>
                                                <tr className="text-left text-sm text-gray-500 border-b">
                                                    <th className="pb-4 font-semibold">Instansi</th>
                                                    <th className="pb-4 font-semibold">PIC</th>
                                                    <th className="pb-4 font-semibold max-md:hidden">Kontak</th>
                                                    <th className="pb-4 font-semibold">Status</th>
                                                    <th className="pb-4 font-semibold max-sm:hidden">Waktu</th>
                                                    <th className="pb-4 font-semibold text-right">Aksi</th>
                                                </tr>
                                            </thead>
                                            <tbody className="text-sm">
                                                {instansiList.map((reg) => {
                                                    const avatar = reg.nama.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase();
                                                    const statusId = reg.statusRegistrasiInstansi.id;
                                                    const statusNama = reg.statusRegistrasiInstansi.nama;

                                                    return (
                                                        <tr key={reg.id} className="border-b last:border-0 hover:bg-gray-50 group transition-colors">
                                                            <td className="py-4">
                                                                <div className="flex items-center gap-3">
                                                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center font-bold text-primary text-sm">
                                                                        {avatar}
                                                                    </div>
                                                                    <span className="font-medium">{reg.nama}</span>
                                                                </div>
                                                            </td>
                                                            <td className="py-4 text-gray-600">{reg.registrasiPicInstansi?.nama || '-'}</td>
                                                            <td className="py-4 text-gray-600 max-md:hidden">
                                                                <div>
                                                                    <p className="text-xs">{reg.email}</p>
                                                                    <p className="text-xs text-gray-400">{reg.nomorTelepon}</p>
                                                                </div>
                                                            </td>
                                                            <td className="py-4">
                                                                <span className={cn(
                                                                    "px-3 py-1.5 rounded-full text-xs font-semibold",
                                                                    statusId === 1 && "bg-amber-100 text-amber-700",
                                                                    statusId === 2 && "bg-blue-100 text-blue-700",
                                                                    statusId === 3 && "bg-emerald-100 text-emerald-700",
                                                                    statusId === 4 && "bg-red-100 text-red-700"
                                                                )}>
                                                                    {statusNama}
                                                                </span>
                                                            </td>
                                                            <td className="py-4 text-gray-500 max-sm:hidden">{formatRelativeTime(reg.createdAt)}</td>
                                                            <td className="py-4">
                                                                <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                                    {statusId === 1 && (
                                                                        <>
                                                                            <Button 
                                                                                variant="ghost" 
                                                                                size="sm" 
                                                                                className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 p-2"
                                                                                onClick={() => handleUpdateStatus(reg.id, 3)}
                                                                                disabled={isPending}
                                                                            >
                                                                                <BiCheck size={18} />
                                                                            </Button>
                                                                            <Button 
                                                                                variant="ghost" 
                                                                                size="sm" 
                                                                                className="text-red-500 hover:text-red-600 hover:bg-red-50 p-2"
                                                                                onClick={() => handleUpdateStatus(reg.id, 4)}
                                                                                disabled={isPending}
                                                                            >
                                                                                <BiX size={18} />
                                                                            </Button>
                                                                        </>
                                                                    )}
                                                                    <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80 p-2">
                                                                        <BiInfoCircle size={18} />
                                                                    </Button>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </table>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </main>

                {/* Footer */}
                <footer className="p-4 lg:p-8 border-t bg-white/50">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-500">
                        <p>© 2026 BPMP Provinsi Kalimantan Selatan. All rights reserved.</p>
                        <div className="flex items-center gap-4">
                            <Link href="/dashboard/admin/bantuan" className="hover:text-primary transition-colors">Bantuan</Link>
                            <Link href="/dashboard/admin/pengaturan" className="hover:text-primary transition-colors">Kebijakan Privasi</Link>
                            <Link href="/dashboard/admin/pengaturan" className="hover:text-primary transition-colors">Syarat & Ketentuan</Link>
                        </div>
                    </div>
                </footer>
            </div>

            {/* Click outside to close dropdowns */}
            {(showNotifications || showUserMenu) && (
                <div
                    className="fixed inset-0 z-10"
                    onClick={() => {
                        setShowNotifications(false);
                        setShowUserMenu(false);
                    }}
                />
            )}
        </div>
    );
}
