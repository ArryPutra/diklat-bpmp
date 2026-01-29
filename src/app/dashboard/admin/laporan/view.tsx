"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import {
    BiArrowBack,
    BiBarChartAlt2,
    BiBookOpen,
    BiBuilding,
    BiCalendarCheck,
    BiDownload,
    BiFile,
    BiPieChartAlt,
    BiTrendingUp,
    BiUser,
    BiUserCheck
} from 'react-icons/bi';

interface LaporanViewProps {
    user: any;
    stats: {
        totalDiklat: number;
        totalInstansi: number;
        totalPeserta: number;
        diklatAktif: number;
    };
    weeklyData: {
        labels: string[];
        peserta: number[];
        instansi: number[];
    };
}

export default function LaporanView({ user, stats, weeklyData }: LaporanViewProps) {
    const totalPesertaMingguan = weeklyData.peserta.reduce((a, b) => a + b, 0);
    const totalInstansiMingguan = weeklyData.instansi.reduce((a, b) => a + b, 0);
    const maxPeserta = Math.max(...weeklyData.peserta, 1);
    const maxInstansi = Math.max(...weeklyData.instansi, 1);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-50 to-gray-100">
            <div className="max-w-7xl mx-auto p-4 lg:p-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                        <Link href="/dashboard/admin" className="hover:text-primary">Dashboard</Link>
                        <span>/</span>
                        <span className="text-gray-900">Laporan</span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <h1 className="text-2xl lg:text-3xl font-bold">Laporan & Statistik</h1>
                            <p className="text-gray-500 mt-1">Pantau perkembangan dan statistik diklat</p>
                        </div>
                        <div className="flex gap-2">
                            <Link href="/dashboard/admin">
                                <Button variant="ghost" size="sm">
                                    <BiArrowBack /> Kembali
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Summary Statistics */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <Card className="border-0 shadow-md bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm opacity-80">Total Diklat</p>
                                    <p className="text-3xl font-bold">{stats.totalDiklat}</p>
                                </div>
                                <BiBookOpen className="text-4xl opacity-80" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-0 shadow-md bg-gradient-to-br from-green-500 to-green-600 text-white">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm opacity-80">Diklat Aktif</p>
                                    <p className="text-3xl font-bold">{stats.diklatAktif}</p>
                                </div>
                                <BiCalendarCheck className="text-4xl opacity-80" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-0 shadow-md bg-gradient-to-br from-purple-500 to-purple-600 text-white">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm opacity-80">Total Instansi</p>
                                    <p className="text-3xl font-bold">{stats.totalInstansi}</p>
                                </div>
                                <BiBuilding className="text-4xl opacity-80" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-0 shadow-md bg-gradient-to-br from-orange-500 to-orange-600 text-white">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm opacity-80">Total Peserta</p>
                                    <p className="text-3xl font-bold">{stats.totalPeserta}</p>
                                </div>
                                <BiUserCheck className="text-4xl opacity-80" />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    {/* Weekly Peserta Chart */}
                    <Card className="border-0 shadow-md">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <BiBarChartAlt2 className="text-primary" />
                                Pendaftaran Peserta (7 Hari Terakhir)
                            </CardTitle>
                            <CardDescription>
                                Total: {totalPesertaMingguan} pendaftaran
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-end justify-between gap-2 h-48">
                                {weeklyData.labels.map((label, index) => (
                                    <div key={label} className="flex-1 flex flex-col items-center gap-2">
                                        <div className="w-full flex justify-center">
                                            <div
                                                className="w-8 bg-gradient-to-t from-primary to-primary/70 rounded-t transition-all duration-300"
                                                style={{
                                                    height: `${(weeklyData.peserta[index] / maxPeserta) * 150}px`,
                                                    minHeight: weeklyData.peserta[index] > 0 ? '10px' : '2px'
                                                }}
                                            />
                                        </div>
                                        <span className="text-xs text-gray-500">{label}</span>
                                        <span className="text-xs font-medium">{weeklyData.peserta[index]}</span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Weekly Instansi Chart */}
                    <Card className="border-0 shadow-md">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <BiTrendingUp className="text-purple-600" />
                                Pendaftaran Instansi (7 Hari Terakhir)
                            </CardTitle>
                            <CardDescription>
                                Total: {totalInstansiMingguan} pendaftaran
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-end justify-between gap-2 h-48">
                                {weeklyData.labels.map((label, index) => (
                                    <div key={label} className="flex-1 flex flex-col items-center gap-2">
                                        <div className="w-full flex justify-center">
                                            <div
                                                className="w-8 bg-gradient-to-t from-purple-600 to-purple-400 rounded-t transition-all duration-300"
                                                style={{
                                                    height: `${(weeklyData.instansi[index] / maxInstansi) * 150}px`,
                                                    minHeight: weeklyData.instansi[index] > 0 ? '10px' : '2px'
                                                }}
                                            />
                                        </div>
                                        <span className="text-xs text-gray-500">{label}</span>
                                        <span className="text-xs font-medium">{weeklyData.instansi[index]}</span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Performance Metrics */}
                <Card className="border-0 shadow-md mb-8">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <BiPieChartAlt className="text-primary" />
                            Metrik Performa
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                            <div className="text-center p-4 bg-blue-50 rounded-xl">
                                <p className="text-4xl font-bold text-blue-600">
                                    {stats.totalDiklat > 0 ? Math.round((stats.diklatAktif / stats.totalDiklat) * 100) : 0}%
                                </p>
                                <p className="text-sm text-gray-600 mt-1">Tingkat Diklat Aktif</p>
                            </div>
                            <div className="text-center p-4 bg-green-50 rounded-xl">
                                <p className="text-4xl font-bold text-green-600">
                                    {stats.totalInstansi > 0 ? Math.round(stats.totalPeserta / stats.totalInstansi) : 0}
                                </p>
                                <p className="text-sm text-gray-600 mt-1">Rata-rata Peserta/Instansi</p>
                            </div>
                            <div className="text-center p-4 bg-purple-50 rounded-xl">
                                <p className="text-4xl font-bold text-purple-600">
                                    {stats.diklatAktif > 0 ? Math.round(stats.totalPeserta / stats.diklatAktif) : 0}
                                </p>
                                <p className="text-sm text-gray-600 mt-1">Rata-rata Peserta/Diklat</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Quick Reports */}
                <Card className="border-0 shadow-md">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <BiFile className="text-primary" />
                            Ekspor Laporan
                        </CardTitle>
                        <CardDescription>
                            Download laporan dalam berbagai format
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            <Button variant="outline" className="h-auto py-4 flex-col gap-2" disabled>
                                <BiDownload className="text-2xl" />
                                <span>Laporan Diklat</span>
                                <span className="text-xs text-gray-400">(Segera Hadir)</span>
                            </Button>
                            <Button variant="outline" className="h-auto py-4 flex-col gap-2" disabled>
                                <BiDownload className="text-2xl" />
                                <span>Laporan Instansi</span>
                                <span className="text-xs text-gray-400">(Segera Hadir)</span>
                            </Button>
                            <Button variant="outline" className="h-auto py-4 flex-col gap-2" disabled>
                                <BiDownload className="text-2xl" />
                                <span>Laporan Peserta</span>
                                <span className="text-xs text-gray-400">(Segera Hadir)</span>
                            </Button>
                            <Button variant="outline" className="h-auto py-4 flex-col gap-2" disabled>
                                <BiDownload className="text-2xl" />
                                <span>Laporan Lengkap</span>
                                <span className="text-xs text-gray-400">(Segera Hadir)</span>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
