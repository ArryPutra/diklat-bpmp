"use client"

import { getSertifikasiAction } from '@/actions/sertifikasi-action'
import Layout from '@/components/layouts/guest-layout'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Spinner } from '@/components/ui/spinner'
import { cn } from '@/lib/utils'
import { formatDateId } from '@/utils/dateFormatted'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useActionState, useEffect, useState } from 'react'
import { BiAward, BiCalendar, BiCheckCircle, BiCopy, BiEnvelope, BiLeftArrowAlt, BiMapPin, BiSearch, BiUser } from 'react-icons/bi'

// Helper untuk masking email (privasi)
function maskEmail(email: string): string {
    const [localPart, domain] = email.split('@')
    if (localPart.length <= 2) return `${localPart[0]}***@${domain}`
    return `${localPart.slice(0, 2)}${'*'.repeat(Math.min(localPart.length - 2, 5))}@${domain}`
}

// Info item component
function InfoItem({ icon, label, value }: {
    icon: React.ReactNode
    label: string
    value: string
}) {
    return (
        <div className="flex items-start gap-3">
            <div className="text-muted-foreground mt-0.5">{icon}</div>
            <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground">{label}</p>
                <p className="text-sm font-medium">{value}</p>
            </div>
        </div>
    )
}

export default function CekSertifikasi() {
    const [state, formAction, pending] = useActionState(getSertifikasiAction, null);
    const router = useRouter();
    const [mounted, setMounted] = useState(false);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Copy kode sertifikasi ke clipboard
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
                    Cek <span className='gradient-text'>Sertifikat</span>
                </h1>
                <p className='text-muted-foreground mb-6'>
                    Masukkan kode sertifikasi untuk melihat detail dan mengunduh sertifikat Anda
                </p>

                <Button variant='secondary' onClick={() => router.push('/')} className='mb-6 hover-lift'>
                    <BiLeftArrowAlt /> Halaman Utama
                </Button>

                {/* Form Pencarian */}
                <Card className="mb-6">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-base flex items-center gap-2">
                            <BiSearch className="w-5 h-5" />
                            Cari Sertifikat
                        </CardTitle>
                        <CardDescription>
                            Masukkan kode sertifikasi yang Anda terima setelah menyelesaikan diklat
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form action={formAction} className='flex gap-3'>
                            <Input
                                name='kodeSertifikasi'
                                placeholder='Contoh: SERT-ABC123-DEF456'
                                className='font-mono uppercase'
                                defaultValue={state?.data?.kodeSertifikasi}
                            />
                            <Button type='submit' disabled={pending} className='hover-lift'>
                                {pending ? <Spinner /> : 'Cek'}
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                {/* Alert Error */}
                {state?.success === false && (
                    <Alert className='mb-6 animate-fade-in-up' variant='destructive'>
                        <AlertTitle>Data Tidak Ditemukan</AlertTitle>
                        <AlertDescription>
                            {state?.message}. Pastikan kode sertifikasi yang Anda masukkan sudah benar.
                        </AlertDescription>
                    </Alert>
                )}

                {/* Hasil Pencarian */}
                {state?.success === true && state.data && (
                    <div className="space-y-4 animate-fade-in-up">
                        {/* Sertifikat Card */}
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between flex-wrap gap-3">
                                    <div>
                                        <CardTitle className="text-lg flex items-center gap-2">
                                            <BiAward className="w-5 h-5 text-amber-500" />
                                            Sertifikat Valid
                                        </CardTitle>
                                        <CardDescription className="flex items-center gap-2 mt-1">
                                            <span className="font-mono text-xs bg-muted px-2 py-0.5 rounded">
                                                {state.data.kodeSertifikasi}
                                            </span>
                                            <button
                                                type="button"
                                                onClick={() => copyToClipboard(state.data!.kodeSertifikasi)}
                                                className={cn(
                                                    "transition-all duration-300",
                                                    copied ? "text-green-500" : "text-muted-foreground hover:text-foreground"
                                                )}
                                                title="Salin kode sertifikasi"
                                            >
                                                {copied ? <BiCheckCircle className="w-4 h-4" /> : <BiCopy className="w-4 h-4" />}
                                            </button>
                                        </CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <BiCalendar className="w-4 h-4" />
                                    <span>Tanggal Terbit: {formatDateId(state.data.createdAt.toString())}</span>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Info Peserta */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base flex items-center gap-2">
                                    <BiUser className="w-5 h-5" />
                                    Informasi Peserta
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <InfoItem
                                    icon={<BiUser className="w-4 h-4" />}
                                    label="Nama Peserta"
                                    value={state.data.pesertaDiklat.peserta.user.name}
                                />
                                <InfoItem
                                    icon={<BiEnvelope className="w-4 h-4" />}
                                    label="Email Peserta"
                                    value={maskEmail(state.data.pesertaDiklat.peserta.user.email)}
                                />
                            </CardContent>
                        </Card>

                        {/* Info Diklat */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base flex items-center gap-2">
                                    <BiAward className="w-5 h-5" />
                                    Informasi Diklat
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <InfoItem
                                    icon={<BiAward className="w-4 h-4" />}
                                    label="Judul Diklat"
                                    value={state.data.pesertaDiklat.diklat.judul}
                                />
                                <InfoItem
                                    icon={<BiCalendar className="w-4 h-4" />}
                                    label="Tanggal Pelaksanaan"
                                    value={`${formatDateId(state.data.pesertaDiklat.diklat.tanggalMulaiAcara.toString())} s/d ${formatDateId(state.data.pesertaDiklat.diklat.tanggalSelesaiAcara.toString())}`}
                                />
                                <InfoItem
                                    icon={<BiMapPin className="w-4 h-4" />}
                                    label="Lokasi"
                                    value={state.data.pesertaDiklat.diklat.lokasi}
                                />
                                <Separator />
                                <InfoItem
                                    icon={<BiAward className="w-4 h-4" />}
                                    label="Metode Diklat"
                                    value={state.data.pesertaDiklat.diklat.metodeDiklat?.nama || '-'}
                                />
                                <InfoItem
                                    icon={<BiCheckCircle className="w-4 h-4" />}
                                    label="Status Kelulusan"
                                    value={state.data.pesertaDiklat.statusKelulusanPesertaDiklat?.nama || '-'}
                                />
                            </CardContent>
                        </Card>

                        {/* Info Tambahan */}
                        <Alert>
                            <AlertTitle className="text-sm">Informasi Penting</AlertTitle>
                            <AlertDescription className="text-xs">
                                Sertifikat ini adalah bukti resmi bahwa Anda telah menyelesaikan program diklat sesuai dengan standar yang ditetapkan.
                                Untuk mengunduh sertifikat dalam format PDF, klik link di halaman utama atau login ke akun peserta Anda.
                            </AlertDescription>
                        </Alert>
                    </div>
                )}
            </div>

            {/* Tampilan Kanan */}
            <div className='w-[40%] max-md:w-full max-md:h-44 overflow-hidden transition-all duration-1000'>
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
