"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useTransition } from 'react';
import { deleteDiklat } from '@/actions/dashboard-action';
import {
    BiArrowBack,
    BiBookOpen,
    BiCalendar,
    BiChevronLeft,
    BiChevronRight,
    BiEdit,
    BiFilter,
    BiGroup,
    BiPlus,
    BiSearch,
    BiTrash,
    BiX
} from 'react-icons/bi';

interface DiklatItem {
    id: string;
    nama: string;
    deskripsi: string | null;
    metode: string;
    tanggalMulai: Date;
    tanggalSelesai: Date;
    batasPendaftaran: Date;
    kuota: number;
    isActive: boolean;
    _count: {
        pendaftaranDiklat: number;
    };
}

interface Pagination {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

export default function DiklatListView({
    user,
    diklatList,
    pagination,
    currentSearch,
    currentStatus
}: {
    user: any;
    diklatList: DiklatItem[];
    pagination: Pagination;
    currentSearch: string;
    currentStatus: string;
}) {
    const router = useRouter();
    const [search, setSearch] = useState(currentSearch);
    const [isPending, startTransition] = useTransition();

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const params = new URLSearchParams();
        if (search) params.set('search', search);
        if (currentStatus !== 'all') params.set('status', currentStatus);
        router.push(`/dashboard/admin/diklat?${params.toString()}`);
    };

    const handleStatusFilter = (status: string) => {
        const params = new URLSearchParams();
        if (search) params.set('search', search);
        if (status !== 'all') params.set('status', status);
        router.push(`/dashboard/admin/diklat?${params.toString()}`);
    };

    const handleDelete = (id: string, nama: string) => {
        if (confirm(`Yakin ingin menghapus diklat "${nama}"?`)) {
            startTransition(async () => {
                await deleteDiklat(id, user?.id);
                router.refresh();
            });
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
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-50 to-gray-100">
            <div className="max-w-7xl mx-auto p-4 lg:p-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                    <div>
                        <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                            <Link href="/dashboard/admin" className="hover:text-primary">Dashboard</Link>
                            <span>/</span>
                            <span className="text-gray-900">Kelola Diklat</span>
                        </div>
                        <h1 className="text-2xl lg:text-3xl font-bold">Kelola Diklat</h1>
                        <p className="text-gray-500 mt-1">Kelola semua program diklat dan pelatihan</p>
                    </div>
                    <Link href="/dashboard/admin/diklat/tambah">
                        <Button className="bg-gradient-to-r from-primary to-primary/90 shadow-lg shadow-primary/20">
                            <BiPlus /> Tambah Diklat
                        </Button>
                    </Link>
                </div>

                {/* Filters */}
                <Card className="mb-6 border-0 shadow-md">
                    <CardContent className="p-4">
                        <div className="flex flex-col sm:flex-row gap-4">
                            <form onSubmit={handleSearch} className="flex-1 flex gap-2">
                                <div className="relative flex-1">
                                    <BiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <Input
                                        placeholder="Cari diklat..."
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        className="pl-10"
                                    />
                                </div>
                                <Button type="submit" variant="outline">Cari</Button>
                            </form>
                            <div className="flex gap-2">
                                <Button
                                    variant={currentStatus === 'all' ? 'default' : 'outline'}
                                    size="sm"
                                    onClick={() => handleStatusFilter('all')}
                                >
                                    Semua
                                </Button>
                                <Button
                                    variant={currentStatus === 'active' ? 'default' : 'outline'}
                                    size="sm"
                                    onClick={() => handleStatusFilter('active')}
                                >
                                    Aktif
                                </Button>
                                <Button
                                    variant={currentStatus === 'inactive' ? 'default' : 'outline'}
                                    size="sm"
                                    onClick={() => handleStatusFilter('inactive')}
                                >
                                    Nonaktif
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Diklat List */}
                <Card className="border-0 shadow-md">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <BiBookOpen className="text-primary" />
                            Daftar Diklat
                        </CardTitle>
                        <CardDescription>
                            Total {pagination.total} diklat ditemukan
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {diklatList.length === 0 ? (
                            <div className="text-center py-12 text-gray-500">
                                <BiBookOpen className="mx-auto text-5xl mb-4 text-gray-300" />
                                <p className="text-lg font-medium">Belum ada diklat</p>
                                <p className="text-sm mt-1">Mulai dengan menambahkan diklat pertama</p>
                                <Link href="/dashboard/admin/diklat/tambah">
                                    <Button className="mt-4">
                                        <BiPlus /> Tambah Diklat
                                    </Button>
                                </Link>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {diklatList.map((diklat) => {
                                    const pesertaCount = diklat._count.pendaftaranDiklat;
                                    const progress = Math.round((pesertaCount / diklat.kuota) * 100);

                                    return (
                                        <div
                                            key={diklat.id}
                                            className="group flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl bg-gray-50 hover:bg-white hover:shadow-md transition-all duration-300 border border-transparent hover:border-gray-200 gap-4"
                                        >
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <p className="font-semibold truncate">{diklat.nama}</p>
                                                    <span className={cn(
                                                        "px-2 py-0.5 rounded text-xs font-medium",
                                                        diklat.metode === "ONLINE" ? "bg-blue-100 text-blue-700" :
                                                            diklat.metode === "OFFLINE" ? "bg-green-100 text-green-700" :
                                                                "bg-violet-100 text-violet-700"
                                                    )}>
                                                        {diklat.metode}
                                                    </span>
                                                    <span className={cn(
                                                        "px-2 py-0.5 rounded text-xs font-medium",
                                                        diklat.isActive ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-700"
                                                    )}>
                                                        {diklat.isActive ? 'Aktif' : 'Nonaktif'}
                                                    </span>
                                                </div>
                                                {diklat.deskripsi && (
                                                    <p className="text-sm text-gray-500 mt-1 line-clamp-1">{diklat.deskripsi}</p>
                                                )}
                                                <div className="flex items-center gap-4 mt-2 text-sm text-gray-500 flex-wrap">
                                                    <span className="flex items-center gap-1">
                                                        <BiCalendar /> {formatDate(diklat.tanggalMulai)} - {formatDate(diklat.tanggalSelesai)}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <BiGroup /> {pesertaCount}/{diklat.kuota} peserta ({progress}%)
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Link href={`/dashboard/admin/diklat/${diklat.id}`}>
                                                    <Button variant="outline" size="sm">
                                                        <BiEdit /> Edit
                                                    </Button>
                                                </Link>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="text-red-500 hover:text-red-600 hover:bg-red-50"
                                                    onClick={() => handleDelete(diklat.id, diklat.nama)}
                                                    disabled={isPending}
                                                >
                                                    <BiTrash />
                                                </Button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}

                        {/* Pagination */}
                        {pagination.totalPages > 1 && (
                            <div className="flex items-center justify-between mt-6 pt-6 border-t">
                                <p className="text-sm text-gray-500">
                                    Halaman {pagination.page} dari {pagination.totalPages}
                                </p>
                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        disabled={pagination.page <= 1}
                                        onClick={() => {
                                            const params = new URLSearchParams();
                                            params.set('page', String(pagination.page - 1));
                                            if (search) params.set('search', search);
                                            if (currentStatus !== 'all') params.set('status', currentStatus);
                                            router.push(`/dashboard/admin/diklat?${params.toString()}`);
                                        }}
                                    >
                                        <BiChevronLeft /> Sebelumnya
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        disabled={pagination.page >= pagination.totalPages}
                                        onClick={() => {
                                            const params = new URLSearchParams();
                                            params.set('page', String(pagination.page + 1));
                                            if (search) params.set('search', search);
                                            if (currentStatus !== 'all') params.set('status', currentStatus);
                                            router.push(`/dashboard/admin/diklat?${params.toString()}`);
                                        }}
                                    >
                                        Selanjutnya <BiChevronRight />
                                    </Button>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Back Button */}
                <div className="mt-6">
                    <Link href="/dashboard/admin">
                        <Button variant="ghost">
                            <BiArrowBack /> Kembali ke Dashboard
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
