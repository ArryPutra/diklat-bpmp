"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { updateStatusPendaftaranDiklat } from '@/actions/dashboard-action';
import { StatusPendaftaranDiklat } from '@/generated/prisma/enums';
import {
    BiArrowBack,
    BiBookOpen,
    BiBuilding,
    BiCheck,
    BiEnvelope,
    BiFilter,
    BiPhone,
    BiSearch,
    BiTime,
    BiUser,
    BiUserCheck,
    BiX
} from 'react-icons/bi';

interface PesertaData {
    id: string;
    status: string;
    createdAt: Date;
    diklat: {
        id: string;
        nama: string;
    };
    instansi: {
        id: string;
        namaInstansi: string;
    };
    picInstansi: {
        id: string;
        nama: string;
        email: string;
        nomorHp: string;
    };
}

interface PesertaViewProps {
    user: any;
    pesertaList: {
        data: PesertaData[];
        total: number;
        page: number;
        pageSize: number;
        totalPages: number;
    };
    currentPage: number;
    search: string;
    statusFilter: string;
    diklatFilter: string;
}

export default function PesertaView({ user, pesertaList, currentPage, search, statusFilter, diklatFilter }: PesertaViewProps) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [searchValue, setSearchValue] = useState(search);

    const handleSearch = () => {
        const params = new URLSearchParams();
        if (searchValue) params.set('search', searchValue);
        if (statusFilter) params.set('status', statusFilter);
        if (diklatFilter) params.set('diklatId', diklatFilter);
        router.push(`/dashboard/admin/peserta?${params.toString()}`);
    };

    const handleStatusFilter = (status: string) => {
        const params = new URLSearchParams();
        if (searchValue) params.set('search', searchValue);
        if (status && status !== 'ALL') params.set('status', status);
        if (diklatFilter) params.set('diklatId', diklatFilter);
        router.push(`/dashboard/admin/peserta?${params.toString()}`);
    };

    const handleUpdateStatus = (id: string, status: StatusPendaftaranDiklat) => {
        startTransition(async () => {
            const result = await updateStatusPendaftaranDiklat(id, status);
            if (result.success) {
                router.refresh();
            } else {
                alert(result.message);
            }
        });
    };

    const handlePageChange = (newPage: number) => {
        const params = new URLSearchParams();
        params.set('page', newPage.toString());
        if (searchValue) params.set('search', searchValue);
        if (statusFilter) params.set('status', statusFilter);
        if (diklatFilter) params.set('diklatId', diklatFilter);
        router.push(`/dashboard/admin/peserta?${params.toString()}`);
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'MENUNGGU':
                return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">Menunggu</span>;
            case 'DITERIMA':
                return <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Diterima</span>;
            case 'DITOLAK':
                return <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">Ditolak</span>;
            case 'HADIR':
                return <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">Hadir</span>;
            case 'SELESAI':
                return <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">Selesai</span>;
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
                        <span className="text-gray-900">Kelola Peserta</span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <h1 className="text-2xl lg:text-3xl font-bold">Kelola Peserta</h1>
                            <p className="text-gray-500 mt-1">Verifikasi pendaftaran peserta diklat</p>
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
                                    placeholder="Cari peserta..."
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
                                    <SelectItem value="DITERIMA">Diterima</SelectItem>
                                    <SelectItem value="DITOLAK">Ditolak</SelectItem>
                                    <SelectItem value="HADIR">Hadir</SelectItem>
                                    <SelectItem value="SELESAI">Selesai</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>

                {/* Statistics */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-6">
                    <Card className="border-0 shadow-md">
                        <CardContent className="p-4 text-center">
                            <p className="text-2xl font-bold text-primary">{pesertaList.total}</p>
                            <p className="text-sm text-gray-500">Total</p>
                        </CardContent>
                    </Card>
                    <Card className="border-0 shadow-md">
                        <CardContent className="p-4 text-center">
                            <p className="text-2xl font-bold text-yellow-600">
                                {pesertaList.data.filter(p => p.status === 'MENUNGGU').length}
                            </p>
                            <p className="text-sm text-gray-500">Menunggu</p>
                        </CardContent>
                    </Card>
                    <Card className="border-0 shadow-md">
                        <CardContent className="p-4 text-center">
                            <p className="text-2xl font-bold text-green-600">
                                {pesertaList.data.filter(p => p.status === 'DITERIMA').length}
                            </p>
                            <p className="text-sm text-gray-500">Diterima</p>
                        </CardContent>
                    </Card>
                    <Card className="border-0 shadow-md">
                        <CardContent className="p-4 text-center">
                            <p className="text-2xl font-bold text-blue-600">
                                {pesertaList.data.filter(p => p.status === 'HADIR').length}
                            </p>
                            <p className="text-sm text-gray-500">Hadir</p>
                        </CardContent>
                    </Card>
                    <Card className="border-0 shadow-md">
                        <CardContent className="p-4 text-center">
                            <p className="text-2xl font-bold text-purple-600">
                                {pesertaList.data.filter(p => p.status === 'SELESAI').length}
                            </p>
                            <p className="text-sm text-gray-500">Selesai</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Peserta List */}
                {pesertaList.data.length === 0 ? (
                    <Card className="border-0 shadow-md">
                        <CardContent className="p-12 text-center">
                            <BiUserCheck className="mx-auto text-6xl text-gray-300 mb-4" />
                            <h3 className="text-lg font-semibold text-gray-500">Belum ada pendaftaran peserta</h3>
                            <p className="text-sm text-gray-400 mt-1">Pendaftaran peserta diklat akan muncul di sini</p>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="space-y-4">
                        {pesertaList.data.map((peserta) => (
                            <Card key={peserta.id} className="border-0 shadow-md hover:shadow-lg transition-shadow">
                                <CardContent className="p-4 sm:p-6">
                                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                                        <div className="flex-1 space-y-3">
                                            <div className="flex items-start justify-between">
                                                <div>
                                                    <h3 className="font-semibold text-lg">{peserta.picInstansi.nama}</h3>
                                                    <p className="text-sm text-gray-500">{peserta.instansi.namaInstansi}</p>
                                                </div>
                                                {getStatusBadge(peserta.status)}
                                            </div>

                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                                                <div className="flex items-center gap-2 text-gray-600">
                                                    <BiBookOpen className="text-primary" />
                                                    <span>{peserta.diklat.nama}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-gray-600">
                                                    <BiEnvelope className="text-primary" />
                                                    <span>{peserta.picInstansi.email}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-gray-600">
                                                    <BiPhone className="text-primary" />
                                                    <span>{peserta.picInstansi.nomorHp}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-gray-600">
                                                    <BiTime className="text-primary" />
                                                    <span>{formatDate(peserta.createdAt)}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap gap-2">
                                            {peserta.status === 'MENUNGGU' && (
                                                <>
                                                    <Button
                                                        size="sm"
                                                        disabled={isPending}
                                                        onClick={() => handleUpdateStatus(peserta.id, StatusPendaftaranDiklat.DITERIMA)}
                                                        className="bg-green-600 hover:bg-green-700"
                                                    >
                                                        <BiCheck /> Terima
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="destructive"
                                                        disabled={isPending}
                                                        onClick={() => handleUpdateStatus(peserta.id, StatusPendaftaranDiklat.DITOLAK)}
                                                    >
                                                        <BiX /> Tolak
                                                    </Button>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}

                {/* Pagination */}
                {pesertaList.totalPages > 1 && (
                    <div className="flex justify-center gap-2 mt-8">
                        <Button
                            variant="outline"
                            disabled={currentPage <= 1}
                            onClick={() => handlePageChange(currentPage - 1)}
                        >
                            Previous
                        </Button>
                        <div className="flex items-center gap-2">
                            {Array.from({ length: pesertaList.totalPages }, (_, i) => i + 1).map((page) => (
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
                            disabled={currentPage >= pesertaList.totalPages}
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
