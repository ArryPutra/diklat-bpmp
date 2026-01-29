"use client"

import { getRegistrasiInstansiStatus } from '@/actions/registrasi-instansi-action'
import Layout from '@/components/layouts/guest-layout'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Spinner } from '@/components/ui/spinner'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useActionState, useEffect, useState } from 'react'
import { BiBuilding, BiCalendar, BiCheckCircle, BiCopy, BiEnvelope, BiLeftArrowAlt, BiMap, BiPhone, BiSearch, BiTime, BiUser } from 'react-icons/bi'

// Helper untuk masking email (privasi)
function maskEmail(email: string): string {
    const [localPart, domain] = email.split('@')
    if (localPart.length <= 2) return `${localPart[0]}***@${domain}`
    return `${localPart.slice(0, 2)}${'*'.repeat(Math.min(localPart.length - 2, 5))}@${domain}`
}

// Helper untuk masking nomor telepon (privasi)
function maskPhone(phone: string): string {
    if (phone.length <= 4) return phone
    return `${phone.slice(0, 4)}${'*'.repeat(phone.length - 7)}${phone.slice(-3)}`
}

// Helper untuk format tanggal
function formatDate(date: Date | string): string {
    return new Date(date).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    })
}

// Status badge dengan warna
function StatusBadge({ status }: { status: string }) {
    const statusConfig: Record<string, { color: string; bgColor: string; icon: React.ReactNode }> = {
        'Menunggu Verifikasi': {
            color: 'text-amber-700',
            bgColor: 'bg-amber-50 border-amber-200',
            icon: <BiTime className="w-4 h-4" />
        },
        'Disetujui': {
            color: 'text-green-700',
            bgColor: 'bg-green-50 border-green-200',
            icon: <BiCheckCircle className="w-4 h-4" />
        },
        'Ditolak': {
            color: 'text-red-700',
            bgColor: 'bg-red-50 border-red-200',
            icon: <BiTime className="w-4 h-4" />
        },
        'Dalam Proses': {
            color: 'text-blue-700',
            bgColor: 'bg-blue-50 border-blue-200',
            icon: <BiTime className="w-4 h-4" />
        }
    }

    const config = statusConfig[status] || statusConfig['Menunggu Verifikasi']

    return (
        <span className={cn(
            'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border',
            config.color,
            config.bgColor
        )}>
            {config.icon}
            {status}
        </span>
    )
}

// Info item component
function InfoItem({ icon, label, value, masked = false }: {
    icon: React.ReactNode
    label: string
    value: string
    masked?: boolean
}) {
    return (
        <div className="flex items-start gap-3">
            <div className="text-muted-foreground mt-0.5">{icon}</div>
            <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground">{label}</p>
                <p className={cn("text-sm font-medium truncate", masked && "font-mono")}>{value}</p>
            </div>
        </div>
    )
}

export default function CekStatus() {
    const [state, formAction, pending] = useActionState(getRegistrasiInstansiStatus, null);
    const router = useRouter();
    const [mounted, setMounted] = useState(false);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Copy kode registrasi ke clipboard
    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }

    return (
        <Layout
            parentClassName='px-0! overflow-hidden'
            className='p-0! flex max-w-full! h-dvh
                    max-md:flex-col-reverse overflow-hidden'>
            <div className={cn(
                'w-[60%] h-full p-12 overflow-auto max-md:w-full max-md:p-5 max-md:rounded-t-xl max-md:-mt-4 max-md:shadow-xl max-md:bg-white',
                mounted ? 'animate-fade-in-left opacity-100' : 'opacity-0'
            )}>
                <Image
                    src='/images/logo/kemendikdasmen-bpmp-kalsel.png'
                    alt='Logo Kemendikdasmen'
                    width={280}
                    height={45}
                    className='object-contain' />

                <h1 className='mt-12 font-bold text-2xl text-primary'>
                    Cek Status <span className='gradient-text'>Registrasi</span>
                </h1>
                <p className='text-muted-foreground mb-6'>
                    Masukkan kode registrasi untuk melihat status pendaftaran instansi Anda
                </p>

                <Button variant='secondary' onClick={() => router.push('/')} className='mb-6 hover-lift'>
                    <BiLeftArrowAlt /> Halaman Utama
                </Button>

                {/* Form Pencarian */}
                <Card className="mb-6">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-base flex items-center gap-2">
                            <BiSearch className="w-5 h-5" />
                            Cari Status Registrasi
                        </CardTitle>
                        <CardDescription>
                            Masukkan kode registrasi yang Anda terima saat mendaftar
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form action={formAction} className='flex gap-3'>
                            <Input
                                name='kodeRegistrasi'
                                placeholder='Contoh: cm5abc123xyz'
                                className='font-mono'
                                defaultValue={state?.data?.id}
                            />
                            <Button type='submit' disabled={pending} className='hover-lift'>
                                {pending ? <Spinner /> : 'Cek Status'}
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                {/* Alert Error */}
                {state?.success === false && (
                    <Alert className='mb-6 animate-fade-in-up' variant='destructive'>
                        <AlertTitle>Data Tidak Ditemukan</AlertTitle>
                        <AlertDescription>
                            {state?.message}. Pastikan kode registrasi yang Anda masukkan sudah benar.
                        </AlertDescription>
                    </Alert>
                )}

                {/* Hasil Pencarian */}
                {state?.success === true && state.data && (
                    <div className="space-y-4 animate-fade-in-up">
                        {/* Status Card */}
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between flex-wrap gap-3">
                                    <div>
                                        <CardTitle className="text-lg">Status Registrasi</CardTitle>
                                        <CardDescription className="flex items-center gap-2 mt-1">
                                            <span className="font-mono text-xs bg-muted px-2 py-0.5 rounded">
                                                {state.data.id}
                                            </span>
                                            <button
                                                type="button"
                                                onClick={() => copyToClipboard(state.data!.id)}
                                                className={cn(
                                                    "transition-all duration-300",
                                                    copied ? "text-green-500" : "text-muted-foreground hover:text-foreground"
                                                )}
                                                title="Salin kode registrasi"
                                            >
                                                {copied ? <BiCheckCircle className="w-4 h-4" /> : <BiCopy className="w-4 h-4" />}
                                            </button>
                                        </CardDescription>
                                    </div>
                                    <StatusBadge status={state.data.statusRegistrasiInstansi.nama} />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <BiCalendar className="w-4 h-4" />
                                    <span>Tanggal Pendaftaran: {formatDate(state.data.createdAt)}</span>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Info Instansi */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base flex items-center gap-2">
                                    <BiBuilding className="w-5 h-5" />
                                    Informasi Instansi
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <InfoItem
                                    icon={<BiBuilding className="w-4 h-4" />}
                                    label="Nama Instansi"
                                    value={state.data.nama}
                                />
                                <InfoItem
                                    icon={<BiEnvelope className="w-4 h-4" />}
                                    label="Email"
                                    value={maskEmail(state.data.email)}
                                    masked
                                />
                                <InfoItem
                                    icon={<BiPhone className="w-4 h-4" />}
                                    label="Nomor Telepon"
                                    value={maskPhone(state.data.nomorTelepon)}
                                    masked
                                />
                                <Separator />
                                <InfoItem
                                    icon={<BiMap className="w-4 h-4" />}
                                    label="Lokasi"
                                    value={`${state.data.desaKelurahan}, ${state.data.kecamatan}, ${state.data.kabupatenKota}`}
                                />
                            </CardContent>
                        </Card>

                        {/* Info PIC */}
                        {state.data.registrasiPicInstansi && (
                            <Card className="hover-lift transition-all duration-300 delay-200">
                                <CardHeader>
                                    <CardTitle className="text-base flex items-center gap-2">
                                        <BiUser className="w-5 h-5" />
                                        Informasi PIC (Person In Charge)
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <InfoItem
                                        icon={<BiUser className="w-4 h-4" />}
                                        label="Nama PIC"
                                        value={state.data.registrasiPicInstansi.nama}
                                    />
                                    <InfoItem
                                        icon={<BiEnvelope className="w-4 h-4" />}
                                        label="Email PIC"
                                        value={maskEmail(state.data.registrasiPicInstansi.email)}
                                        masked
                                    />
                                    <InfoItem
                                        icon={<BiPhone className="w-4 h-4" />}
                                        label="Nomor Telepon PIC"
                                        value={maskPhone(state.data.registrasiPicInstansi.nomorTelepon)}
                                        masked
                                    />
                                    <InfoItem
                                        icon={<BiBuilding className="w-4 h-4" />}
                                        label="Jabatan"
                                        value={state.data.registrasiPicInstansi.jabatan}
                                    />
                                </CardContent>
                            </Card>
                        )}

                        {/* Info Tambahan */}
                        <Alert>
                            <AlertTitle className="text-sm">Informasi</AlertTitle>
                            <AlertDescription className="text-xs">
                                Data sensitif seperti email dan nomor telepon ditampilkan dalam format tersamar untuk menjaga privasi.
                                Jika ada pertanyaan, silahkan hubungi admin BPMP Kalsel.
                            </AlertDescription>
                        </Alert>
                    </div>
                )}
            </div>

            {/* Tampilan Kanan */}
            <div className={cn(
                'w-[40%] max-md:w-full max-md:h-44 overflow-hidden transition-all duration-1000',
                mounted ? 'animate-fade-in-right opacity-100' : 'opacity-0'
            )}>
                <Image
                    src='/images/gedung-bpmp-kalsel.jpg'
                    alt='Gedung BPMP Kalsel'
                    width={1000}
                    height={1000}
                    className='h-full object-cover w-full object-center' />
            </div>
        </Layout>
    )
}
