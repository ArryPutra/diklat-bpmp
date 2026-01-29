"use client"

import { useState } from "react";
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
    BiChevronDown,
    BiChevronUp,
    BiEnvelope,
    BiPhone,
    BiMessageDetail
} from "react-icons/bi";
import { logoutAction } from "@/actions/auth-action";

interface BantuanViewProps {
    instansiNama: string;
}

const faqs = [
    {
        question: "Bagaimana cara mendaftarkan peserta ke diklat?",
        answer: "Untuk mendaftarkan peserta, buka menu 'Diklat Tersedia', pilih diklat yang diinginkan, lalu klik 'Daftarkan Peserta'. Isi formulir dengan data peserta yang lengkap dan klik 'Simpan'."
    },
    {
        question: "Berapa batas maksimal peserta yang bisa didaftarkan?",
        answer: "Jumlah peserta yang dapat didaftarkan tergantung pada kuota yang tersedia di setiap diklat. Anda dapat melihat sisa kuota di halaman detail diklat."
    },
    {
        question: "Bagaimana cara mengunduh sertifikat?",
        answer: "Sertifikat dapat diunduh melalui menu 'Sertifikat' setelah peserta dinyatakan hadir dalam diklat. Klik tombol 'Unduh' pada sertifikat yang tersedia."
    },
    {
        question: "Apa yang harus dilakukan jika pendaftaran ditolak?",
        answer: "Jika pendaftaran ditolak, Anda akan menerima notifikasi dengan alasan penolakan. Anda dapat menghubungi admin melalui kontak yang tersedia untuk informasi lebih lanjut."
    },
    {
        question: "Bagaimana cara membatalkan pendaftaran?",
        answer: "Pendaftaran hanya dapat dibatalkan jika masih berstatus 'Menunggu'. Buka menu 'Peserta', temukan peserta yang ingin dibatalkan, lalu klik tombol hapus."
    },
    {
        question: "Bagaimana cara mengubah data instansi?",
        answer: "Untuk mengubah data instansi, buka menu 'Profil Instansi' dan klik tombol 'Edit'. Lakukan perubahan yang diperlukan dan simpan."
    }
];

export default function BantuanView({ instansiNama }: BantuanViewProps) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [openFaq, setOpenFaq] = useState<number | null>(0);

    const menuItems = [
        { icon: BiHomeAlt, label: "Dashboard", href: "/dashboard/instansi" },
        { icon: BiCalendar, label: "Diklat Tersedia", href: "/dashboard/instansi/diklat" },
        { icon: BiGroup, label: "Peserta", href: "/dashboard/instansi/peserta" },
        { icon: BiHistory, label: "Riwayat", href: "/dashboard/instansi/riwayat" },
        { icon: BiCertification, label: "Sertifikat", href: "/dashboard/instansi/sertifikat" },
        { icon: BiBuildings, label: "Profil Instansi", href: "/dashboard/instansi/profil" },
        { icon: BiCog, label: "Pengaturan", href: "/dashboard/instansi/pengaturan" },
        { icon: BiHelpCircle, label: "Bantuan", href: "/dashboard/instansi/bantuan", active: true },
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
                                <h1 className="text-lg font-semibold text-gray-800">Pusat Bantuan</h1>
                                <p className="text-sm text-gray-500">FAQ dan informasi kontak</p>
                            </div>
                        </div>
                    </div>
                </header>

                <main className="p-4 lg:p-6 max-w-4xl">
                    {/* FAQ Section */}
                    <div className="bg-white rounded-xl shadow-sm border overflow-hidden mb-6">
                        <div className="p-4 border-b bg-gray-50">
                            <div className="flex items-center gap-3">
                                <BiHelpCircle className="w-5 h-5 text-gray-600" />
                                <h2 className="font-semibold text-gray-800">Pertanyaan Umum (FAQ)</h2>
                            </div>
                        </div>
                        <div className="divide-y">
                            {faqs.map((faq, index) => (
                                <div key={index}>
                                    <button
                                        onClick={() => setOpenFaq(openFaq === index ? null : index)}
                                        className="w-full px-4 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                                    >
                                        <span className="font-medium text-gray-800 pr-4">{faq.question}</span>
                                        {openFaq === index ? (
                                            <BiChevronUp className="w-5 h-5 text-gray-400 shrink-0" />
                                        ) : (
                                            <BiChevronDown className="w-5 h-5 text-gray-400 shrink-0" />
                                        )}
                                    </button>
                                    {openFaq === index && (
                                        <div className="px-4 pb-4">
                                            <p className="text-gray-600 bg-gray-50 p-3 rounded-lg">{faq.answer}</p>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Contact Section */}
                    <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                        <div className="p-4 border-b bg-gray-50">
                            <div className="flex items-center gap-3">
                                <BiMessageDetail className="w-5 h-5 text-gray-600" />
                                <h2 className="font-semibold text-gray-800">Hubungi Kami</h2>
                            </div>
                        </div>
                        <div className="p-4">
                            <p className="text-gray-600 mb-4">
                                Jika Anda memiliki pertanyaan lebih lanjut atau membutuhkan bantuan, silakan hubungi kami melalui:
                            </p>
                            <div className="space-y-3">
                                <a 
                                    href="mailto:diklat@bpmpsulsel.kemdikbud.go.id"
                                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                                >
                                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                        <BiEnvelope className="w-5 h-5 text-green-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Email</p>
                                        <p className="font-medium text-gray-800">diklat@bpmpsulsel.kemdikbud.go.id</p>
                                    </div>
                                </a>
                                <a 
                                    href="tel:+624112345678"
                                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                                >
                                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                        <BiPhone className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Telepon</p>
                                        <p className="font-medium text-gray-800">(0411) 234-5678</p>
                                    </div>
                                </a>
                                <a 
                                    href="https://wa.me/6281234567890"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                                >
                                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                        <BiMessageDetail className="w-5 h-5 text-green-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">WhatsApp</p>
                                        <p className="font-medium text-gray-800">+62 812-3456-7890</p>
                                    </div>
                                </a>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
