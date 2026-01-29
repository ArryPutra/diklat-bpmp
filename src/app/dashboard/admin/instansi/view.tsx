"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useTransition } from 'react';
import { updateStatusRegistrasiInstansi } from '@/actions/dashboard-action';
import {
    BiArrowBack,
    BiBuilding,
    BiCheck,
    BiDetail,
    BiEnvelope,
    BiFilter,
    BiPhone,
    BiRefresh,
    BiSearch,
    BiTime,
    BiUser,
    BiX
} from 'react-icons/bi';

interface InstansiData {
    id: string;
    namaInstansi: string;
    alamat: string;
    email: string;
    nomorTelepon?: string | null;
    status: string;
    createdAt: Date;
    RegistrasiPicInstansi?: {
        id: string;
        nama: string;
        nip?: string | null;
        email: string;
        nomorHp: string;
        jabatan?: string | null;
    }[];
}

interface InstansiViewProps {
    user: any;
    instansiList: {
        data: InstansiData[];
        total: number;
        page: number;
        pageSize: number;
        totalPages: number;
    };
    currentPage: number;
    search: string;
    statusFilter: string;
}

export default function InstansiView({ user, instansiList, currentPage, search, statusFilter }: InstansiViewProps) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [searchValue, setSearchValue] = useState(search);
    const [selectedInstansi, setSelectedInstansi] = useState<InstansiData | null>(null);

    const handleSearch = () => {
        const params = new URLSearchParams();
        if (searchValue) params.set('search', searchValue);
        if (statusFilter) params.set('status', statusFilter);
        router.push(`/dashboard/admin/instansi?${params.toString()}`);
    };

    const handleStatusFilter = (status: string) => {
        const params = new URLSearchParams();
        if (searchValue) params.set('search', searchValue);
        if (status && status !== 'ALL') params.set('status', status);
        router.push(`/dashboard/admin/instansi?${params.toString()}`);
    };

    const handleUpdateStatus = (id: string, statusId: number) => {
        startTransition(async () => {
            const result = await updateStatusRegistrasiInstansi(id, statusId);
            if (result.success) {
                router.refresh();
                setSelectedInstansi(null);
                // Show success message
                if (result.message) {
                    alert(result.message);
                }
            } else {
                alert(result.message || 'Terjadi kesalahan');
            }
        });
    };

    const handlePageChange = (newPage: number) => {
        const params = new URLSearchParams();
        params.set('page', newPage.toString());
        if (searchValue) params.set('search', searchValue);
        if (statusFilter) params.set('status', statusFilter);
        router.push(`/dashboard/admin/instansi?${params.toString()}`);
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'MENUNGGU':
                return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">Menunggu</span>;
            case 'DISETUJUI':
                return <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Disetujui</span>;
            case 'DITOLAK':
                return <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">Ditolak</span>;
            default:
                return <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">{status}</span>;
        }
    };

    const formatDate = (date: Date) => {
        return new Date(date).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-50 to-gray-100">
            <div className="max-w-7xl mx-auto p-4 lg:p-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                        <Link href="/dashboard/admin" className="hover:text-primary">Dashboard</Link>
                        <span>/</span>
                        <span className="text-gray-900">Kelola Instansi</span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <h1 className="text-2xl lg:text-3xl font-bold">Kelola Instansi</h1>
                            <p className="text-gray-500 mt-1">Verifikasi dan kelola pendaftaran instansi</p>
                        </div>
                        <Link href="/dashboard/admin">
                            <Button variant="ghost" size="sm">
                                <BiArrowBack /> Kembali
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Search & Filter */}
                <Card className="border-0 shadow-md mb-6">
                    <CardContent className="p-4">
                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="flex-1 flex gap-2">
                                <Input
                                    placeholder="Cari nama instansi..."
                                    value={searchValue}
                                    onChange={(e) => setSearchValue(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                />
                                <Button onClick={handleSearch}>
                                    <BiSearch />
                                </Button>
                            </div>
                            <Select value={statusFilter || 'ALL'} onValueChange={handleStatusFilter}>
                                <SelectTrigger className="w-full sm:w-[180px]">
                                    <BiFilter className="mr-2" />
                                    <SelectValue placeholder="Filter Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="ALL">Semua Status</SelectItem>
                                    <SelectItem value="MENUNGGU">Menunggu</SelectItem>
                                    <SelectItem value="DISETUJUI">Disetujui</SelectItem>
                                    <SelectItem value="DITOLAK">Ditolak</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>

                {/* Statistics */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                    <Card className="border-0 shadow-md">
                        <CardContent className="p-4 text-center">
                            <p className="text-2xl font-bold text-primary">{instansiList.total}</p>
                            <p className="text-sm text-gray-500">Total Instansi</p>
                        </CardContent>
                    </Card>
                    <Card className="border-0 shadow-md">
                        <CardContent className="p-4 text-center">
                            <p className="text-2xl font-bold text-yellow-600">
                                {instansiList.data.filter(i => i.status === 'MENUNGGU').length}
                            </p>
                            <p className="text-sm text-gray-500">Menunggu</p>
                        </CardContent>
                    </Card>
                    <Card className="border-0 shadow-md">
                        <CardContent className="p-4 text-center">
                            <p className="text-2xl font-bold text-green-600">
                                {instansiList.data.filter(i => i.status === 'DISETUJUI').length}
                            </p>
                            <p className="text-sm text-gray-500">Disetujui</p>
                        </CardContent>
                    </Card>
                    <Card className="border-0 shadow-md">
                        <CardContent className="p-4 text-center">
                            <p className="text-2xl font-bold text-red-600">
                                {instansiList.data.filter(i => i.status === 'DITOLAK').length}
                            </p>
                            <p className="text-sm text-gray-500">Ditolak</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Instansi List */}
                {instansiList.data.length === 0 ? (
                    <Card className="border-0 shadow-md">
                        <CardContent className="p-12 text-center">
                            <BiBuilding className="mx-auto text-6xl text-gray-300 mb-4" />
                            <h3 className="text-lg font-semibold text-gray-500">Belum ada pendaftaran instansi</h3>
                            <p className="text-sm text-gray-400 mt-1">Pendaftaran instansi akan muncul di sini</p>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="space-y-4">
                        {instansiList.data.map((instansi) => (
                            <Card key={instansi.id} className="border-0 shadow-md hover:shadow-lg transition-shadow">
                                <CardContent className="p-4 sm:p-6">
                                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                                        <div className="flex-1 space-y-3">
                                            <div className="flex items-start justify-between">
                                                <div>
                                                    <h3 className="font-semibold text-lg">{instansi.namaInstansi}</h3>
                                                    <p className="text-sm text-gray-500">{instansi.alamat}</p>
                                                </div>
                                                {getStatusBadge(instansi.status)}
                                            </div>

                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                                                <div className="flex items-center gap-2 text-gray-600">
                                                    <BiEnvelope className="text-primary" />
                                                    <span>{instansi.email}</span>
                                                </div>
                                                {instansi.nomorTelepon && (
                                                    <div className="flex items-center gap-2 text-gray-600">
                                                        <BiPhone className="text-primary" />
                                                        <span>{instansi.nomorTelepon}</span>
                                                    </div>
                                                )}
                                                <div className="flex items-center gap-2 text-gray-600">
                                                    <BiTime className="text-primary" />
                                                    <span>{formatDate(instansi.createdAt)}</span>
                                                </div>
                                                {instansi.RegistrasiPicInstansi && instansi.RegistrasiPicInstansi.length > 0 && (
                                                    <div className="flex items-center gap-2 text-gray-600">
                                                        <BiUser className="text-primary" />
                                                        <span>PIC: {instansi.RegistrasiPicInstansi[0].nama}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => setSelectedInstansi(selectedInstansi?.id === instansi.id ? null : instansi)}
                                            >
                                                <BiDetail /> Detail
                                            </Button>
                                            {instansi.status === 'MENUNGGU' && (
                                                <>
                                                    <Button
                                                        size="sm"
                                                        disabled={isPending}
                                                        onClick={() => handleUpdateStatus(instansi.id, 3)}
                                                        className="bg-green-600 hover:bg-green-700"
                                                    >
                                                        <BiCheck /> Setujui
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="destructive"
                                                        disabled={isPending}
                                                        onClick={() => handleUpdateStatus(instansi.id, 4)}
                                                    >
                                                        <BiX /> Tolak
                                                    </Button>
                                                </>
                                            )}
                                        </div>
                                    </div>

                                    {/* Detail Panel */}
                                    {selectedInstansi?.id === instansi.id && instansi.RegistrasiPicInstansi && instansi.RegistrasiPicInstansi.length > 0 && (
                                        <div className="mt-4 pt-4 border-t">
                                            <h4 className="font-semibold mb-3">Data PIC (Person In Charge)</h4>
                                            {instansi.RegistrasiPicInstansi.map((pic) => (
                                                <div key={pic.id} className="bg-gray-50 p-4 rounded-lg">
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                                                        <div>
                                                            <span className="text-gray-500">Nama:</span>
                                                            <p className="font-medium">{pic.nama}</p>
                                                        </div>
                                                        <div>
                                                            <span className="text-gray-500">NIP:</span>
                                                            <p className="font-medium">{pic.nip || '-'}</p>
                                                        </div>
                                                        <div>
                                                            <span className="text-gray-500">Email:</span>
                                                            <p className="font-medium">{pic.email}</p>
                                                        </div>
                                                        <div>
                                                            <span className="text-gray-500">No. HP:</span>
                                                            <p className="font-medium">{pic.nomorHp}</p>
                                                        </div>
                                                        <div className="sm:col-span-2">
                                                            <span className="text-gray-500">Jabatan:</span>
                                                            <p className="font-medium">{pic.jabatan || '-'}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}

                {/* Pagination */}
                {instansiList.totalPages > 1 && (
                    <div className="flex justify-center gap-2 mt-8">
                        <Button
                            variant="outline"
                            disabled={currentPage <= 1}
                            onClick={() => handlePageChange(currentPage - 1)}
                        >
                            Previous
                        </Button>
                        <div className="flex items-center gap-2">
                            {Array.from({ length: instansiList.totalPages }, (_, i) => i + 1).map((page) => (
                                <Button
                                    key={page}
                                    variant={currentPage === page ? 'default' : 'outline'}
                                    size="sm"
                                    onClick={() => handlePageChange(page)}
                                >
                                    {page}
                                </Button>
                            ))}
                        </div>
                        <Button
                            variant="outline"
                            disabled={currentPage >= instansiList.totalPages}
                            onClick={() => handlePageChange(currentPage + 1)}
                        >
                            Next
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}
