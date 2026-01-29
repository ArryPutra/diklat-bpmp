"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { createDiklat } from '@/actions/dashboard-action';
import { MetodeDiklat } from '@/generated/prisma/enums';
import {
    BiArrowBack,
    BiBookOpen,
    BiCalendar,
    BiCheck,
    BiGroup,
    BiLaptop,
    BiLink,
    BiListUl,
    BiMap,
    BiPlus,
    BiSave,
    BiTime,
    BiX
} from 'react-icons/bi';

export default function TambahDiklatView({ user }: { user: any }) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [errors, setErrors] = useState<Record<string, string>>({});

    const [formData, setFormData] = useState({
        nama: '',
        deskripsi: '',
        metode: 'ONLINE' as MetodeDiklat,
        target: '',
        tanggalMulai: '',
        tanggalSelesai: '',
        waktuMulai: '08:00',
        waktuSelesai: '16:00',
        batasPendaftaran: '',
        kuota: 30,
        lokasi: '',
        linkMeeting: '',
        materi: [''],
        persyaratan: [''],
        fasilitas: [''],
        isActive: true
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        startTransition(async () => {
            const result = await createDiklat({
                nama: formData.nama,
                deskripsi: formData.deskripsi || undefined,
                metode: formData.metode,
                target: formData.target || undefined,
                tanggalMulai: new Date(formData.tanggalMulai),
                tanggalSelesai: new Date(formData.tanggalSelesai),
                waktuMulai: formData.waktuMulai || undefined,
                waktuSelesai: formData.waktuSelesai || undefined,
                batasPendaftaran: new Date(formData.batasPendaftaran),
                kuota: formData.kuota,
                lokasi: formData.lokasi || undefined,
                linkMeeting: formData.linkMeeting || undefined,
                materi: formData.materi.filter(m => m.trim() !== ''),
                persyaratan: formData.persyaratan.filter(p => p.trim() !== ''),
                fasilitas: formData.fasilitas.filter(f => f.trim() !== ''),
                isActive: formData.isActive
            }, user?.id);

            if (result.success) {
                router.push('/dashboard/admin/diklat');
            } else if ('message' in result && result.message) {
                alert(result.message);
            }
        });
    };

    const addArrayItem = (field: 'materi' | 'persyaratan' | 'fasilitas') => {
        setFormData(prev => ({
            ...prev,
            [field]: [...prev[field], '']
        }));
    };

    const removeArrayItem = (field: 'materi' | 'persyaratan' | 'fasilitas', index: number) => {
        setFormData(prev => ({
            ...prev,
            [field]: prev[field].filter((_, i) => i !== index)
        }));
    };

    const updateArrayItem = (field: 'materi' | 'persyaratan' | 'fasilitas', index: number, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: prev[field].map((item, i) => i === index ? value : item)
        }));
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-50 to-gray-100">
            <div className="max-w-4xl mx-auto p-4 lg:p-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                        <Link href="/dashboard/admin" className="hover:text-primary">Dashboard</Link>
                        <span>/</span>
                        <Link href="/dashboard/admin/diklat" className="hover:text-primary">Kelola Diklat</Link>
                        <span>/</span>
                        <span className="text-gray-900">Tambah Diklat</span>
                    </div>
                    <h1 className="text-2xl lg:text-3xl font-bold">Tambah Diklat Baru</h1>
                    <p className="text-gray-500 mt-1">Isi form di bawah untuk membuat diklat baru</p>
                </div>

                <form onSubmit={handleSubmit}>
                    {/* Informasi Dasar */}
                    <Card className="border-0 shadow-md mb-6">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <BiBookOpen className="text-primary" />
                                Informasi Dasar
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label htmlFor="nama">Nama Diklat *</Label>
                                <Input
                                    id="nama"
                                    placeholder="Contoh: Pelatihan Kepemimpinan Kepala Sekolah"
                                    value={formData.nama}
                                    onChange={(e) => setFormData(prev => ({ ...prev, nama: e.target.value }))}
                                    className={errors.nama ? 'border-red-500' : ''}
                                />
                                {errors.nama && <p className="text-red-500 text-sm mt-1">{errors.nama}</p>}
                            </div>

                            <div>
                                <Label htmlFor="deskripsi">Deskripsi</Label>
                                <Textarea
                                    id="deskripsi"
                                    placeholder="Jelaskan tentang diklat ini..."
                                    value={formData.deskripsi}
                                    onChange={(e) => setFormData(prev => ({ ...prev, deskripsi: e.target.value }))}
                                    rows={4}
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="metode">Metode Pelaksanaan *</Label>
                                    <Select
                                        value={formData.metode}
                                        onValueChange={(value) => setFormData(prev => ({ ...prev, metode: value as MetodeDiklat }))}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Pilih metode" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="ONLINE">Online</SelectItem>
                                            <SelectItem value="OFFLINE">Offline</SelectItem>
                                            <SelectItem value="HYBRID">Hybrid</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div>
                                    <Label htmlFor="target">Target Peserta</Label>
                                    <Input
                                        id="target"
                                        placeholder="Contoh: Guru, Kepala Sekolah"
                                        value={formData.target}
                                        onChange={(e) => setFormData(prev => ({ ...prev, target: e.target.value }))}
                                    />
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="kuota">Kuota Peserta *</Label>
                                <Input
                                    id="kuota"
                                    type="number"
                                    min={1}
                                    value={formData.kuota}
                                    onChange={(e) => setFormData(prev => ({ ...prev, kuota: parseInt(e.target.value) || 1 }))}
                                    className={errors.kuota ? 'border-red-500' : ''}
                                />
                                {errors.kuota && <p className="text-red-500 text-sm mt-1">{errors.kuota}</p>}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Jadwal */}
                    <Card className="border-0 shadow-md mb-6">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <BiCalendar className="text-primary" />
                                Jadwal Pelaksanaan
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="tanggalMulai">Tanggal Mulai *</Label>
                                    <Input
                                        id="tanggalMulai"
                                        type="date"
                                        value={formData.tanggalMulai}
                                        onChange={(e) => setFormData(prev => ({ ...prev, tanggalMulai: e.target.value }))}
                                        className={errors.tanggalMulai ? 'border-red-500' : ''}
                                    />
                                    {errors.tanggalMulai && <p className="text-red-500 text-sm mt-1">{errors.tanggalMulai}</p>}
                                </div>

                                <div>
                                    <Label htmlFor="tanggalSelesai">Tanggal Selesai *</Label>
                                    <Input
                                        id="tanggalSelesai"
                                        type="date"
                                        value={formData.tanggalSelesai}
                                        onChange={(e) => setFormData(prev => ({ ...prev, tanggalSelesai: e.target.value }))}
                                        className={errors.tanggalSelesai ? 'border-red-500' : ''}
                                    />
                                    {errors.tanggalSelesai && <p className="text-red-500 text-sm mt-1">{errors.tanggalSelesai}</p>}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="waktuMulai">Waktu Mulai</Label>
                                    <Input
                                        id="waktuMulai"
                                        type="time"
                                        value={formData.waktuMulai}
                                        onChange={(e) => setFormData(prev => ({ ...prev, waktuMulai: e.target.value }))}
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="waktuSelesai">Waktu Selesai</Label>
                                    <Input
                                        id="waktuSelesai"
                                        type="time"
                                        value={formData.waktuSelesai}
                                        onChange={(e) => setFormData(prev => ({ ...prev, waktuSelesai: e.target.value }))}
                                    />
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="batasPendaftaran">Batas Pendaftaran *</Label>
                                <Input
                                    id="batasPendaftaran"
                                    type="date"
                                    value={formData.batasPendaftaran}
                                    onChange={(e) => setFormData(prev => ({ ...prev, batasPendaftaran: e.target.value }))}
                                    className={errors.batasPendaftaran ? 'border-red-500' : ''}
                                />
                                {errors.batasPendaftaran && <p className="text-red-500 text-sm mt-1">{errors.batasPendaftaran}</p>}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Lokasi */}
                    <Card className="border-0 shadow-md mb-6">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <BiMap className="text-primary" />
                                Lokasi & Link
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label htmlFor="lokasi">Lokasi</Label>
                                <Input
                                    id="lokasi"
                                    placeholder="Contoh: Aula BPMP Kalsel atau Via Zoom Meeting"
                                    value={formData.lokasi}
                                    onChange={(e) => setFormData(prev => ({ ...prev, lokasi: e.target.value }))}
                                />
                            </div>

                            {(formData.metode === 'ONLINE' || formData.metode === 'HYBRID') && (
                                <div>
                                    <Label htmlFor="linkMeeting">Link Meeting</Label>
                                    <Input
                                        id="linkMeeting"
                                        placeholder="https://zoom.us/j/..."
                                        value={formData.linkMeeting}
                                        onChange={(e) => setFormData(prev => ({ ...prev, linkMeeting: e.target.value }))}
                                    />
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Materi */}
                    <Card className="border-0 shadow-md mb-6">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <BiListUl className="text-primary" />
                                Materi Pelatihan
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {formData.materi.map((item, index) => (
                                <div key={index} className="flex gap-2">
                                    <Input
                                        placeholder={`Materi ${index + 1}`}
                                        value={item}
                                        onChange={(e) => updateArrayItem('materi', index, e.target.value)}
                                    />
                                    {formData.materi.length > 1 && (
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="icon"
                                            onClick={() => removeArrayItem('materi', index)}
                                        >
                                            <BiX />
                                        </Button>
                                    )}
                                </div>
                            ))}
                            <Button type="button" variant="outline" onClick={() => addArrayItem('materi')}>
                                <BiPlus /> Tambah Materi
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Persyaratan */}
                    <Card className="border-0 shadow-md mb-6">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <BiCheck className="text-primary" />
                                Persyaratan Peserta
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {formData.persyaratan.map((item, index) => (
                                <div key={index} className="flex gap-2">
                                    <Input
                                        placeholder={`Persyaratan ${index + 1}`}
                                        value={item}
                                        onChange={(e) => updateArrayItem('persyaratan', index, e.target.value)}
                                    />
                                    {formData.persyaratan.length > 1 && (
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="icon"
                                            onClick={() => removeArrayItem('persyaratan', index)}
                                        >
                                            <BiX />
                                        </Button>
                                    )}
                                </div>
                            ))}
                            <Button type="button" variant="outline" onClick={() => addArrayItem('persyaratan')}>
                                <BiPlus /> Tambah Persyaratan
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Fasilitas */}
                    <Card className="border-0 shadow-md mb-6">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <BiGroup className="text-primary" />
                                Fasilitas
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {formData.fasilitas.map((item, index) => (
                                <div key={index} className="flex gap-2">
                                    <Input
                                        placeholder={`Fasilitas ${index + 1}`}
                                        value={item}
                                        onChange={(e) => updateArrayItem('fasilitas', index, e.target.value)}
                                    />
                                    {formData.fasilitas.length > 1 && (
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="icon"
                                            onClick={() => removeArrayItem('fasilitas', index)}
                                        >
                                            <BiX />
                                        </Button>
                                    )}
                                </div>
                            ))}
                            <Button type="button" variant="outline" onClick={() => addArrayItem('fasilitas')}>
                                <BiPlus /> Tambah Fasilitas
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-between">
                        <Link href="/dashboard/admin/diklat">
                            <Button type="button" variant="ghost">
                                <BiArrowBack /> Batal
                            </Button>
                        </Link>
                        <Button
                            type="submit"
                            disabled={isPending}
                            className="bg-gradient-to-r from-primary to-primary/90 shadow-lg"
                        >
                            {isPending ? 'Menyimpan...' : <><BiSave /> Simpan Diklat</>}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
