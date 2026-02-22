import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Copy, Check } from 'lucide-react'; // import icon lucide

export default function SuksesKirim({
    emailInstansi,
    emailPicInstansi,
    nomorTeleponInstansi,
    nomorTeleponPicInstansi,
    kodeTiketRegistrasi
}: {
    emailInstansi: string,
    emailPicInstansi: string,
    nomorTeleponInstansi: string,
    nomorTeleponPicInstansi: string,
    kodeTiketRegistrasi: string
}) {
    const router = useRouter();
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(kodeTiketRegistrasi)
            .then(() => {
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            })
            .catch(() => {
                alert('Gagal menyalin kode.');
            });
    }

    return (
        <div className='flex flex-col items-center text-center'>
            <Image
                src='/images/illustrations/undraw_done_i0ak.png'
                alt='Undraw Done i0ak'
                width={1000}
                height={1000}
                className='w-72 animate-float' />
            <h1 className='font-bold text-xl animate-fade-in-up'>
                Pendaftaran Instansi <span className='gradient-text'>Berhasil</span> Dikirim!
            </h1>
            <p className='mb-6 text-muted-foreground animate-fade-in-up delay-100'>
                Saat ini akun sedang menunggu proses verifikasi oleh Admin.
            </p>

            <div className='border py-3 px-4 text-sm mb-6 rounded-xl w-full animate-fade-in-up delay-200 hover-lift transition-all duration-300'>
                <h1>Informasi hasil verifikasi akan dikirimkan melalui:</h1>
                <p className='mt-2'>
                    Email: <b>{emailPicInstansi}</b>
                </p>

                <div className='mt-6'>
                    <p className='mb-2'>Kode Tiket Registrasi:</p>
                    <div className='flex items-center justify-center gap-2'>
                        <div className='font-bold bg-gray-100 p-2 w-fit rounded-md'>
                            {kodeTiketRegistrasi}
                        </div>
                        <Button
                            size='sm'
                            variant='outline'
                            onClick={handleCopy}
                            className='hover-lift p-2 rounded-md'
                        >
                            {copied ? <Check className='w-4 h-4 text-green-500' /> : <Copy className='w-4 h-4' />}
                        </Button>
                    </div>
                    <p className='text-xs text-gray-500 mt-2'>Kode Tiket Registrasi dapat digunakan untuk melacak status verifikasi.</p>
                </div>
            </div>

            <div className='flex gap-3 flex-wrap justify-center animate-fade-in-up delay-300'>
                <Button variant='secondary' onClick={() => router.push('/')} className='hover-lift'>
                    Halaman Utama
                </Button>
                <Button onClick={() => router.push('/registrasi-instansi/cek-status')} className='hover-lift'>
                    Cek Status
                </Button>
            </div>
        </div>
    )
}
