"use client"

import { useState } from "react";
import Link from "next/link";
import { 
    BiArrowBack,
    BiTime,
    BiMapPin,
    BiGroup,
    BiPlus,
    BiX,
    BiCheck,
    BiTrash,
    BiUser
} from "react-icons/bi";
import { daftarkanPeserta, batalkanPendaftaran } from "@/actions/instansi-action";
import { useRouter } from "next/navigation";

interface DiklatData {
    id: string;
    nama: string;
    deskripsi: string;
    metode: string;
    tanggalMulai: Date;
    tanggalSelesai: Date;
    batasPendaftaran: Date;
    lokasi: string | null;
    kuota: number;
    _count: {
        pendaftaranDiklat: number;
    };
}

interface PesertaTerdaftar {
    id: string;
    namaPeserta: string;
    email: string;
    nomorTelepon: string;
    jabatan: string | null;
    status: string;
}

interface DaftarPesertaViewProps {
    instansiId: string;
    instansiNama: string;
    diklat: DiklatData;
    pesertaTerdaftar: PesertaTerdaftar[];
}

export default function DaftarPesertaView({ 
    instansiId, 
    instansiNama, 
    diklat, 
    pesertaTerdaftar 
}: DaftarPesertaViewProps) {
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        namaPeserta: "",
        email: "",
        nomorTelepon: "",
        jabatan: ""
    });
    const router = useRouter();

    const formatDate = (date: Date) => {
        return new Date(date).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "DITERIMA": return "bg-green-100 text-green-700";
            case "MENUNGGU": return "bg-yellow-100 text-yellow-700";
            case "DITOLAK": return "bg-red-100 text-red-700";
            case "HADIR": return "bg-blue-100 text-blue-700";
            default: return "bg-gray-100 text-gray-700";
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case "DITERIMA": return "Diterima";
            case "MENUNGGU": return "Menunggu";
            case "DITOLAK": return "Ditolak";
            case "HADIR": return "Hadir";
            default: return status;
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(null);

        const result = await daftarkanPeserta({
            diklatId: diklat.id,
            registrasiInstansiId: instansiId,
            namaPeserta: formData.namaPeserta,
            email: formData.email,
            nomorTelepon: formData.nomorTelepon,
            jabatan: formData.jabatan || undefined
        });

        setLoading(false);

        if (result.success) {
            setSuccess("Peserta berhasil didaftarkan!");
            setFormData({ namaPeserta: "", email: "", nomorTelepon: "", jabatan: "" });
            setShowForm(false);
            router.refresh();
        } else {
            setError(result.message || "Gagal mendaftarkan peserta");
        }
    };

    const handleBatalkan = async (id: string) => {
        if (!confirm("Apakah Anda yakin ingin membatalkan pendaftaran ini?")) return;
        
        setLoading(true);
        const result = await batalkanPendaftaran(id, instansiId);
        setLoading(false);

        if (result.success) {
            setSuccess("Pendaftaran berhasil dibatalkan");
            router.refresh();
        } else {
            setError(result.message || "Gagal membatalkan pendaftaran");
        }
    };

    const sisaKuota = diklat.kuota - diklat._count.pendaftaranDiklat;
    const isPendaftaranDitutup = new Date() > new Date(diklat.batasPendaftaran);

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white border-b">
                <div className="max-w-4xl mx-auto px-4 py-4">
                    <Link 
                        href="/dashboard/instansi/diklat" 
                        className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-4"
                    >
                        <BiArrowBack className="w-5 h-5" />
                        <span>Kembali ke Daftar Diklat</span>
                    </Link>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-4 py-6">
                {/* Alerts */}
                {error && (
                    <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 flex items-center justify-between">
                        <span>{error}</span>
                        <button onClick={() => setError(null)}>
                            <BiX className="w-5 h-5" />
                        </button>
                    </div>
                )}
                {success && (
                    <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 flex items-center justify-between">
                        <span>{success}</span>
                        <button onClick={() => setSuccess(null)}>
                            <BiX className="w-5 h-5" />
                        </button>
                    </div>
                )}

                {/* Diklat Info */}
                <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
                    <div className="flex items-start justify-between mb-4">
                        <div>
                            <h1 className="text-xl font-bold text-gray-800">{diklat.nama}</h1>
                            <p className="text-gray-500 mt-1">{diklat.deskripsi}</p>
                        </div>
                        <span className={`text-sm font-medium px-3 py-1 rounded-full ${
                            diklat.metode === 'ONLINE' 
                                ? 'bg-blue-100 text-blue-700' 
                                : 'bg-orange-100 text-orange-700'
                        }`}>
                            {diklat.metode}
                        </span>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="flex items-center gap-3 text-gray-600">
                            <BiTime className="w-5 h-5" />
                            <span>{formatDate(diklat.tanggalMulai)} - {formatDate(diklat.tanggalSelesai)}</span>
                        </div>
                        {diklat.lokasi && (
                            <div className="flex items-center gap-3 text-gray-600">
                                <BiMapPin className="w-5 h-5" />
                                <span>{diklat.lokasi}</span>
                            </div>
                        )}
                        <div className="flex items-center gap-3 text-gray-600">
                            <BiGroup className="w-5 h-5" />
                            <span>Sisa kuota: <strong>{sisaKuota}</strong> dari {diklat.kuota}</span>
                        </div>
                    </div>

                    {isPendaftaranDitutup && (
                        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                            Pendaftaran sudah ditutup pada {formatDate(diklat.batasPendaftaran)}
                        </div>
                    )}
                </div>

                {/* Peserta Section */}
                <div className="bg-white rounded-xl shadow-sm border">
                    <div className="p-4 border-b flex items-center justify-between">
                        <div>
                            <h2 className="font-semibold text-gray-800">Peserta dari {instansiNama}</h2>
                            <p className="text-sm text-gray-500">{pesertaTerdaftar.length} peserta terdaftar</p>
                        </div>
                        {!isPendaftaranDitutup && sisaKuota > 0 && (
                            <button
                                onClick={() => setShowForm(true)}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                            >
                                <BiPlus className="w-5 h-5" />
                                <span>Tambah Peserta</span>
                            </button>
                        )}
                    </div>

                    {/* Form Tambah Peserta */}
                    {showForm && (
                        <div className="p-4 border-b bg-gray-50">
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Nama Peserta <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.namaPeserta}
                                            onChange={(e) => setFormData(prev => ({ ...prev, namaPeserta: e.target.value }))}
                                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                            placeholder="Masukkan nama lengkap"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Email <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="email"
                                            required
                                            value={formData.email}
                                            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                            placeholder="email@example.com"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Nomor Telepon <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="tel"
                                            required
                                            value={formData.nomorTelepon}
                                            onChange={(e) => setFormData(prev => ({ ...prev, nomorTelepon: e.target.value }))}
                                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                            placeholder="08xxxxxxxxxx"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Jabatan
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.jabatan}
                                            onChange={(e) => setFormData(prev => ({ ...prev, jabatan: e.target.value }))}
                                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                            placeholder="Opsional"
                                        />
                                    </div>
                                </div>
                                <div className="flex justify-end gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setShowForm(false)}
                                        className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                                    >
                                        <BiCheck className="w-5 h-5" />
                                        <span>{loading ? "Menyimpan..." : "Simpan"}</span>
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* Daftar Peserta */}
                    <div className="divide-y">
                        {pesertaTerdaftar.length > 0 ? (
                            pesertaTerdaftar.map((peserta) => (
                                <div key={peserta.id} className="p-4 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                                            <BiUser className="w-5 h-5 text-gray-600" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-800">{peserta.namaPeserta}</p>
                                            <p className="text-sm text-gray-500">{peserta.email}</p>
                                            {peserta.jabatan && (
                                                <p className="text-xs text-gray-400">{peserta.jabatan}</p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(peserta.status)}`}>
                                            {getStatusLabel(peserta.status)}
                                        </span>
                                        {peserta.status === "MENUNGGU" && (
                                            <button
                                                onClick={() => handleBatalkan(peserta.id)}
                                                disabled={loading}
                                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                title="Batalkan pendaftaran"
                                            >
                                                <BiTrash className="w-5 h-5" />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="p-8 text-center text-gray-500">
                                <BiGroup className="w-12 h-12 mx-auto text-gray-300 mb-2" />
                                <p>Belum ada peserta yang didaftarkan</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
