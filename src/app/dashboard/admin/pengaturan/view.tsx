"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { useState, useTransition, useActionState, useEffect } from 'react';
import { changePasswordAction } from '@/actions/auth-action';
import {
    BiArrowBack,
    BiBell,
    BiCog,
    BiEnvelope,
    BiKey,
    BiLock,
    BiMoon,
    BiPalette,
    BiSave,
    BiShield,
    BiSun,
    BiUser,
    BiCheck,
    BiError
} from 'react-icons/bi';

interface PengaturanViewProps {
    user: any;
}

export default function PengaturanView({ user }: PengaturanViewProps) {
    const [isPending, startTransition] = useTransition();
    const [activeTab, setActiveTab] = useState('profil');
    const [theme, setTheme] = useState('light');
    const [passwordState, passwordAction, isPasswordPending] = useActionState(changePasswordAction, null);

    const [profileData, setProfileData] = useState({
        name: user?.name || '',
        email: user?.email || ''
    });

    const [notificationSettings, setNotificationSettings] = useState({
        emailNotif: true,
        pendaftaranBaru: true,
        diklatReminder: true,
        laporan: false
    });

    const handleSaveProfile = () => {
        startTransition(async () => {
            // TODO: Implement profile update
            alert('Fitur ini akan segera tersedia');
        });
    };

    const handleSaveNotifications = () => {
        startTransition(async () => {
            // TODO: Implement notification settings
            alert('Fitur ini akan segera tersedia');
        });
    };

    const tabs = [
        { id: 'profil', label: 'Profil', icon: BiUser },
        { id: 'keamanan', label: 'Keamanan', icon: BiShield },
        { id: 'notifikasi', label: 'Notifikasi', icon: BiBell },
        { id: 'tampilan', label: 'Tampilan', icon: BiPalette }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-50 to-gray-100">
            <div className="max-w-5xl mx-auto p-4 lg:p-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                        <Link href="/dashboard/admin" className="hover:text-primary">Dashboard</Link>
                        <span>/</span>
                        <span className="text-gray-900">Pengaturan</span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <h1 className="text-2xl lg:text-3xl font-bold">Pengaturan</h1>
                            <p className="text-gray-500 mt-1">Kelola pengaturan akun dan sistem</p>
                        </div>
                        <Link href="/dashboard/admin">
                            <Button variant="ghost" size="sm">
                                <BiArrowBack /> Kembali
                            </Button>
                        </Link>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Sidebar Tabs */}
                    <div className="lg:w-64 flex-shrink-0">
                        <Card className="border-0 shadow-md">
                            <CardContent className="p-2">
                                <nav className="space-y-1">
                                    {tabs.map((tab) => (
                                        <button
                                            key={tab.id}
                                            onClick={() => setActiveTab(tab.id)}
                                            className={cn(
                                                "w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors",
                                                activeTab === tab.id
                                                    ? "bg-primary text-white"
                                                    : "text-gray-600 hover:bg-gray-100"
                                            )}
                                        >
                                            <tab.icon className="text-lg" />
                                            {tab.label}
                                        </button>
                                    ))}
                                </nav>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                        {/* Profil Tab */}
                        {activeTab === 'profil' && (
                            <Card className="border-0 shadow-md">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <BiUser className="text-primary" />
                                        Profil Pengguna
                                    </CardTitle>
                                    <CardDescription>
                                        Kelola informasi profil Anda
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-20 h-20 bg-gradient-to-br from-primary to-primary/70 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                                            {profileData.name?.charAt(0)?.toUpperCase() || 'A'}
                                        </div>
                                        <div>
                                            <h3 className="font-semibold">{profileData.name}</h3>
                                            <p className="text-sm text-gray-500">{profileData.email}</p>
                                            <p className="text-xs text-gray-400 mt-1">Administrator</p>
                                        </div>
                                    </div>

                                    <Separator />

                                    <div className="space-y-4">
                                        <div>
                                            <Label htmlFor="name">Nama Lengkap</Label>
                                            <Input
                                                id="name"
                                                value={profileData.name}
                                                onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="email">Email</Label>
                                            <Input
                                                id="email"
                                                type="email"
                                                value={profileData.email}
                                                onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                                            />
                                        </div>
                                    </div>

                                    <Button onClick={handleSaveProfile} disabled={isPending}>
                                        <BiSave /> Simpan Perubahan
                                    </Button>
                                </CardContent>
                            </Card>
                        )}

                        {/* Keamanan Tab */}
                        {activeTab === 'keamanan' && (
                            <Card className="border-0 shadow-md">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <BiShield className="text-primary" />
                                        Keamanan Akun
                                    </CardTitle>
                                    <CardDescription>
                                        Kelola password dan keamanan akun
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <form action={passwordAction} className="space-y-4">
                                        {passwordState?.success && (
                                            <div className="p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2 text-green-700">
                                                <BiCheck className="w-5 h-5" />
                                                <span className="text-sm">{passwordState.message}</span>
                                            </div>
                                        )}
                                        {passwordState?.message && !passwordState?.success && (
                                            <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
                                                <BiError className="w-5 h-5" />
                                                <span className="text-sm">{passwordState.message}</span>
                                            </div>
                                        )}
                                        <div>
                                            <Label htmlFor="currentPassword">Password Saat Ini</Label>
                                            <Input
                                                id="currentPassword"
                                                name="currentPassword"
                                                type="password"
                                            />
                                            {passwordState?.errors?.currentPassword && (
                                                <p className="text-sm text-red-500 mt-1">{passwordState.errors.currentPassword}</p>
                                            )}
                                        </div>
                                        <div>
                                            <Label htmlFor="newPassword">Password Baru</Label>
                                            <Input
                                                id="newPassword"
                                                name="newPassword"
                                                type="password"
                                            />
                                            {passwordState?.errors?.newPassword && (
                                                <p className="text-sm text-red-500 mt-1">{passwordState.errors.newPassword}</p>
                                            )}
                                        </div>
                                        <div>
                                            <Label htmlFor="confirmPassword">Konfirmasi Password Baru</Label>
                                            <Input
                                                id="confirmPassword"
                                                name="confirmPassword"
                                                type="password"
                                            />
                                            {passwordState?.errors?.confirmPassword && (
                                                <p className="text-sm text-red-500 mt-1">{passwordState.errors.confirmPassword}</p>
                                            )}
                                        </div>
                                        <Button type="submit" disabled={isPasswordPending}>
                                            <BiKey /> {isPasswordPending ? 'Menyimpan...' : 'Ubah Password'}
                                        </Button>
                                    </form>

                                    <Separator />

                                    <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                                        <div className="flex items-start gap-3">
                                            <BiLock className="text-yellow-600 text-xl flex-shrink-0 mt-0.5" />
                                            <div>
                                                <h4 className="font-medium text-yellow-800">Tips Keamanan</h4>
                                                <ul className="text-sm text-yellow-700 mt-1 space-y-1">
                                                    <li>• Gunakan password minimal 8 karakter</li>
                                                    <li>• Kombinasikan huruf, angka, dan simbol</li>
                                                    <li>• Jangan gunakan password yang sama di situs lain</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Notifikasi Tab */}
                        {activeTab === 'notifikasi' && (
                            <Card className="border-0 shadow-md">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <BiBell className="text-primary" />
                                        Pengaturan Notifikasi
                                    </CardTitle>
                                    <CardDescription>
                                        Atur preferensi notifikasi Anda
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="space-y-4">
                                        {[
                                            { key: 'emailNotif', label: 'Notifikasi Email', desc: 'Terima notifikasi melalui email' },
                                            { key: 'pendaftaranBaru', label: 'Pendaftaran Baru', desc: 'Notifikasi saat ada pendaftaran instansi/peserta baru' },
                                            { key: 'diklatReminder', label: 'Pengingat Diklat', desc: 'Pengingat sebelum diklat dimulai' },
                                            { key: 'laporan', label: 'Laporan Mingguan', desc: 'Terima ringkasan laporan mingguan' }
                                        ].map((item) => (
                                            <div key={item.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                                <div>
                                                    <h4 className="font-medium">{item.label}</h4>
                                                    <p className="text-sm text-gray-500">{item.desc}</p>
                                                </div>
                                                <button
                                                    onClick={() => setNotificationSettings(prev => ({
                                                        ...prev,
                                                        [item.key]: !prev[item.key as keyof typeof notificationSettings]
                                                    }))}
                                                    className={cn(
                                                        "w-12 h-6 rounded-full transition-colors relative",
                                                        notificationSettings[item.key as keyof typeof notificationSettings]
                                                            ? "bg-primary"
                                                            : "bg-gray-300"
                                                    )}
                                                >
                                                    <span
                                                        className={cn(
                                                            "absolute top-1 w-4 h-4 bg-white rounded-full transition-transform",
                                                            notificationSettings[item.key as keyof typeof notificationSettings]
                                                                ? "translate-x-7"
                                                                : "translate-x-1"
                                                        )}
                                                    />
                                                </button>
                                            </div>
                                        ))}
                                    </div>

                                    <Button onClick={handleSaveNotifications} disabled={isPending}>
                                        <BiSave /> Simpan Pengaturan
                                    </Button>
                                </CardContent>
                            </Card>
                        )}

                        {/* Tampilan Tab */}
                        {activeTab === 'tampilan' && (
                            <Card className="border-0 shadow-md">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <BiPalette className="text-primary" />
                                        Pengaturan Tampilan
                                    </CardTitle>
                                    <CardDescription>
                                        Sesuaikan tampilan aplikasi
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div>
                                        <h4 className="font-medium mb-3">Tema</h4>
                                        <div className="grid grid-cols-3 gap-4">
                                            <button
                                                onClick={() => setTheme('light')}
                                                className={cn(
                                                    "p-4 rounded-lg border-2 transition-colors",
                                                    theme === 'light'
                                                        ? "border-primary bg-primary/5"
                                                        : "border-gray-200 hover:border-gray-300"
                                                )}
                                            >
                                                <BiSun className="text-2xl mx-auto mb-2 text-yellow-500" />
                                                <p className="text-sm font-medium">Light</p>
                                            </button>
                                            <button
                                                onClick={() => setTheme('dark')}
                                                className={cn(
                                                    "p-4 rounded-lg border-2 transition-colors",
                                                    theme === 'dark'
                                                        ? "border-primary bg-primary/5"
                                                        : "border-gray-200 hover:border-gray-300"
                                                )}
                                            >
                                                <BiMoon className="text-2xl mx-auto mb-2 text-gray-700" />
                                                <p className="text-sm font-medium">Dark</p>
                                            </button>
                                            <button
                                                onClick={() => setTheme('system')}
                                                className={cn(
                                                    "p-4 rounded-lg border-2 transition-colors",
                                                    theme === 'system'
                                                        ? "border-primary bg-primary/5"
                                                        : "border-gray-200 hover:border-gray-300"
                                                )}
                                            >
                                                <BiCog className="text-2xl mx-auto mb-2 text-gray-500" />
                                                <p className="text-sm font-medium">Sistem</p>
                                            </button>
                                        </div>
                                    </div>

                                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                                        <div className="flex items-start gap-3">
                                            <BiPalette className="text-blue-600 text-xl flex-shrink-0 mt-0.5" />
                                            <div>
                                                <h4 className="font-medium text-blue-800">Fitur Dalam Pengembangan</h4>
                                                <p className="text-sm text-blue-700 mt-1">
                                                    Tema dark mode dan kustomisasi tampilan lainnya akan segera tersedia.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
