import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { useRouter } from 'next/navigation';

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

    return (
        <div className='flex flex-col items-center text-center'>
            <Image
                src='/images/illustrations/undraw_done_i0ak.png'
                alt='Undraw Done i0ak'
                width={1000}
                height={1000}
                className='w-72 animate-float' />
            <h1 className='font-bold text-xl animate-fade-in-up'>Pendaftaran Instansi <span className='gradient-text'>Berhasil</span> Dikirim!</h1>
            <p className='mb-6 text-muted-foreground animate-fade-in-up delay-100'>Saat ini akun sedang menunggu proses verifikasi oleh Admin.</p>

            <div className='border py-3 px-4 text-sm mb-6 rounded-xl w-full animate-fade-in-up delay-200 hover-lift transition-all duration-300'>
                <h1>Informasi hasil verifikasi akan dikirimkan melalui:</h1>
                <p className='mt-2'>Email: <b>{emailInstansi}</b> / <b>{emailPicInstansi}</b></p>
                <p className='mt-2 mb-4'>Nomor Telepon: <b>{nomorTeleponInstansi}</b> / <b>{nomorTeleponPicInstansi}</b>
                </p>

                <h1>Kode Tiket Registrasi: <b className='gradient-text'>{kodeTiketRegistrasi}</b></h1>
            </div>

            <div className='flex gap-3 flex-wrap justify-center animate-fade-in-up delay-300'>
                <Button variant='secondary' onClick={() => { router.push('/') }} className='hover-lift'>Halaman Utama</Button>
                <Button onClick={() => { router.push('/registrasi-instansi/cek-status') }} className='hover-lift'>Cek Status</Button>
            </div>
        </div>
    )
}
