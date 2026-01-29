"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { useState } from 'react';
import {
    BiArrowBack,
    BiBook,
    BiBookOpen,
    BiBuilding,
    BiChat,
    BiChevronDown,
    BiChevronUp,
    BiEnvelope,
    BiHelpCircle,
    BiPhone,
    BiSearch,
    BiSupport,
    BiUser,
    BiVideo
} from 'react-icons/bi';

interface BantuanViewProps {
    user: any;
}

interface FAQItem {
    id: string;
    question: string;
    answer: string;
    category: string;
}

const faqData: FAQItem[] = [
    {
        id: '1',
        question: 'Bagaimana cara menambah diklat baru?',
        answer: 'Untuk menambah diklat baru, klik menu "Kelola Diklat" di sidebar, lalu klik tombol "Tambah Diklat". Isi semua informasi yang diperlukan seperti nama diklat, tanggal pelaksanaan, kuota peserta, dan materi. Setelah selesai, klik "Simpan" untuk menyimpan diklat baru.',
        category: 'diklat'
    },
    {
        id: '2',
        question: 'Bagaimana cara menyetujui atau menolak pendaftaran instansi?',
        answer: 'Buka menu "Kelola Instansi" di sidebar. Anda akan melihat daftar pendaftaran instansi. Untuk setiap pendaftaran yang berstatus "Menunggu", Anda dapat klik tombol "Setujui" atau "Tolak". Pastikan untuk memeriksa data instansi dan PIC sebelum mengambil keputusan.',
        category: 'instansi'
    },
    {
        id: '3',
        question: 'Bagaimana cara melihat laporan statistik?',
        answer: 'Klik menu "Laporan" di sidebar untuk melihat statistik lengkap. Di halaman ini Anda dapat melihat total diklat, instansi, peserta, serta grafik perkembangan pendaftaran dalam 7 hari terakhir.',
        category: 'laporan'
    },
    {
        id: '4',
        question: 'Apa perbedaan status peserta?',
        answer: 'Terdapat beberapa status peserta: PENDING (menunggu verifikasi), DISETUJUI (sudah disetujui untuk mengikuti diklat), DITOLAK (tidak disetujui), HADIR (sudah mengikuti diklat), dan SELESAI (telah menyelesaikan diklat).',
        category: 'peserta'
    },
    {
        id: '5',
        question: 'Bagaimana cara mengubah password?',
        answer: 'Buka menu "Pengaturan" di sidebar, lalu pilih tab "Keamanan". Masukkan password lama Anda, kemudian masukkan password baru dan konfirmasi. Klik "Ubah Password" untuk menyimpan perubahan.',
        category: 'akun'
    },
    {
        id: '6',
        question: 'Apakah bisa mengedit diklat yang sudah dibuat?',
        answer: 'Ya, Anda dapat mengedit diklat yang sudah dibuat. Buka menu "Kelola Diklat", temukan diklat yang ingin diedit, lalu klik tombol "Edit". Ubah informasi yang diperlukan dan simpan perubahan.',
        category: 'diklat'
    },
    {
        id: '7',
        question: 'Apa itu metode pelaksanaan diklat?',
        answer: 'Metode pelaksanaan diklat terdiri dari: ONLINE (dilaksanakan secara daring melalui video conference), OFFLINE (dilaksanakan secara langsung di lokasi), dan HYBRID (kombinasi online dan offline).',
        category: 'diklat'
    },
    {
        id: '8',
        question: 'Bagaimana cara menghubungi support teknis?',
        answer: 'Anda dapat menghubungi support teknis melalui email di support@bpmp-kalsel.go.id atau melalui WhatsApp di nomor yang tertera di halaman ini. Tim kami siap membantu pada jam kerja (Senin-Jumat, 08:00-16:00 WITA).',
        category: 'support'
    }
];

const categories = [
    { id: 'all', label: 'Semua', icon: BiHelpCircle },
    { id: 'diklat', label: 'Diklat', icon: BiBookOpen },
    { id: 'instansi', label: 'Instansi', icon: BiBuilding },
    { id: 'peserta', label: 'Peserta', icon: BiUser },
    { id: 'laporan', label: 'Laporan', icon: BiBook },
    { id: 'akun', label: 'Akun', icon: BiUser },
    { id: 'support', label: 'Support', icon: BiSupport }
];

export default function BantuanView({ user }: BantuanViewProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [expandedFaq, setExpandedFaq] = useState<string | null>(null);

    const filteredFaq = faqData.filter(item => {
        const matchesSearch = item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.answer.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-50 to-gray-100">
            <div className="max-w-5xl mx-auto p-4 lg:p-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                        <Link href="/dashboard/admin" className="hover:text-primary">Dashboard</Link>
                        <span>/</span>
                        <span className="text-gray-900">Bantuan</span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <h1 className="text-2xl lg:text-3xl font-bold">Pusat Bantuan</h1>
                            <p className="text-gray-500 mt-1">Temukan jawaban untuk pertanyaan Anda</p>
                        </div>
                        <Link href="/dashboard/admin">
                            <Button variant="ghost" size="sm">
                                <BiArrowBack /> Kembali
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Search */}
                <Card className="border-0 shadow-md mb-6">
                    <CardContent className="p-4">
                        <div className="relative">
                            <BiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <Input
                                placeholder="Cari pertanyaan atau topik..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Quick Help Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                    <Card className="border-0 shadow-md hover:shadow-lg transition-shadow cursor-pointer bg-gradient-to-br from-blue-50 to-blue-100">
                        <CardContent className="p-6 text-center">
                            <BiVideo className="text-4xl text-blue-600 mx-auto mb-3" />
                            <h3 className="font-semibold">Video Tutorial</h3>
                            <p className="text-sm text-gray-500 mt-1">Pelajari dengan video panduan</p>
                            <p className="text-xs text-blue-600 mt-2">(Segera Hadir)</p>
                        </CardContent>
                    </Card>
                    <Card className="border-0 shadow-md hover:shadow-lg transition-shadow cursor-pointer bg-gradient-to-br from-green-50 to-green-100">
                        <CardContent className="p-6 text-center">
                            <BiBook className="text-4xl text-green-600 mx-auto mb-3" />
                            <h3 className="font-semibold">Dokumentasi</h3>
                            <p className="text-sm text-gray-500 mt-1">Baca panduan lengkap</p>
                            <p className="text-xs text-green-600 mt-2">(Segera Hadir)</p>
                        </CardContent>
                    </Card>
                    <Card className="border-0 shadow-md hover:shadow-lg transition-shadow cursor-pointer bg-gradient-to-br from-purple-50 to-purple-100">
                        <CardContent className="p-6 text-center">
                            <BiChat className="text-4xl text-purple-600 mx-auto mb-3" />
                            <h3 className="font-semibold">Live Chat</h3>
                            <p className="text-sm text-gray-500 mt-1">Bicara dengan tim support</p>
                            <p className="text-xs text-purple-600 mt-2">(Segera Hadir)</p>
                        </CardContent>
                    </Card>
                </div>

                {/* FAQ Section */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Category Filter */}
                    <div className="lg:col-span-1">
                        <Card className="border-0 shadow-md">
                            <CardHeader>
                                <CardTitle className="text-base">Kategori</CardTitle>
                            </CardHeader>
                            <CardContent className="p-2">
                                <nav className="space-y-1">
                                    {categories.map((cat) => (
                                        <button
                                            key={cat.id}
                                            onClick={() => setSelectedCategory(cat.id)}
                                            className={cn(
                                                "w-full flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors",
                                                selectedCategory === cat.id
                                                    ? "bg-primary text-white"
                                                    : "text-gray-600 hover:bg-gray-100"
                                            )}
                                        >
                                            <cat.icon />
                                            {cat.label}
                                        </button>
                                    ))}
                                </nav>
                            </CardContent>
                        </Card>
                    </div>

                    {/* FAQ List */}
                    <div className="lg:col-span-3">
                        <Card className="border-0 shadow-md">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <BiHelpCircle className="text-primary" />
                                    Pertanyaan Umum (FAQ)
                                </CardTitle>
                                <CardDescription>
                                    {filteredFaq.length} pertanyaan ditemukan
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {filteredFaq.length === 0 ? (
                                    <div className="text-center py-8">
                                        <BiSearch className="text-4xl text-gray-300 mx-auto mb-3" />
                                        <p className="text-gray-500">Tidak ada hasil untuk pencarian Anda</p>
                                    </div>
                                ) : (
                                    filteredFaq.map((item) => (
                                        <div
                                            key={item.id}
                                            className="border rounded-lg overflow-hidden"
                                        >
                                            <button
                                                onClick={() => setExpandedFaq(expandedFaq === item.id ? null : item.id)}
                                                className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
                                            >
                                                <span className="font-medium pr-4">{item.question}</span>
                                                {expandedFaq === item.id ? (
                                                    <BiChevronUp className="text-xl flex-shrink-0" />
                                                ) : (
                                                    <BiChevronDown className="text-xl flex-shrink-0" />
                                                )}
                                            </button>
                                            {expandedFaq === item.id && (
                                                <div className="px-4 pb-4 text-gray-600 text-sm border-t bg-gray-50">
                                                    <p className="pt-4">{item.answer}</p>
                                                </div>
                                            )}
                                        </div>
                                    ))
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Contact Section */}
                <Card className="border-0 shadow-md mt-8">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <BiSupport className="text-primary" />
                            Hubungi Kami
                        </CardTitle>
                        <CardDescription>
                            Masih butuh bantuan? Tim kami siap membantu Anda
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                                <BiEnvelope className="text-2xl text-primary" />
                                <div>
                                    <p className="text-sm text-gray-500">Email</p>
                                    <p className="font-medium">support@bpmp-kalsel.go.id</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                                <BiPhone className="text-2xl text-primary" />
                                <div>
                                    <p className="text-sm text-gray-500">Telepon</p>
                                    <p className="font-medium">(0511) 123-4567</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                                <BiChat className="text-2xl text-green-600" />
                                <div>
                                    <p className="text-sm text-gray-500">WhatsApp</p>
                                    <p className="font-medium">+62 812-3456-7890</p>
                                </div>
                            </div>
                        </div>
                        <p className="text-sm text-gray-500 mt-4 text-center">
                            Jam operasional: Senin - Jumat, 08:00 - 16:00 WITA
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
