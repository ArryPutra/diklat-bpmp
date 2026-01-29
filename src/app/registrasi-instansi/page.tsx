"use client"

import Layout from '@/components/layouts/guest-layout'
import { Separator } from '@/components/ui/separator'
import { useDaftarInstansi } from '@/app/registrasi-instansi/useDaftarInstansi'
import Image from 'next/image'
import PicForm from './views/PicForm'
import InstansiForm from './views/InstansiForm'
import { Button } from '@/components/ui/button'
import { BiLeftArrowAlt } from 'react-icons/bi'
import { useRouter } from 'next/navigation'
import KonfirmasiData from './views/KonfirmasiData'
import SuksesKirim from './views/SuksesKirim'
import { useEffect } from 'react'

export default function DaftarInstansi() {
    const daftarInstansi = useDaftarInstansi();
    const router = useRouter();

    useEffect(() => {
        document.body.classList.add('overflow-hidden');

        return () => {
            document.body.classList.remove('overflow-hidden');
        }
    }, []);

    return (
        <Layout
            parentClassName='px-0! overflow-hidden'
            className='p-0! flex max-w-full! h-dvh
            max-md:flex-col-reverse overflow-hidden'>
            {/* Tampilan Kiri */}
            <div className="w-[60%] h-full p-12 overflow-auto max-md:w-full max-md:p-5 max-md:rounded-t-xl max-md:-mt-4 max-md:shadow-xl max-md:bg-white">
                <Image
                    src='/images/logo/kemendikdasmen-bpmp-kalsel.png'
                    alt='Logo Kemendikdasmen'
                    width={280}
                    height={45}
                    className='object-contain hover-scale' />
                <h1 className='mt-12 font-bold text-2xl text-primary'>
                    Daftar Instansi <span className='gradient-text'>({daftarInstansi.step}/{daftarInstansi.maxStep})</span>
                </h1>
                <p className='text-muted-foreground'>Selamat datang, silahkan daftarkan instansi Anda</p>

                {
                    daftarInstansi.step === 1 &&
                    <div className='flex items-center gap-3 mt-6'>
                        <Button variant='secondary' onClick={() => router.push('/')} className='hover-lift'>
                            <BiLeftArrowAlt /> Halaman Utama
                        </Button>
                        <Button onClick={() => router.push('/registrasi-instansi/cek-status')} className='hover-lift'>
                            Cek Status
                        </Button>
                    </div>
                }

                <Separator className='my-6' />

                {/* Tampilan Formulir PIC */}
                <div>
                    {daftarInstansi.step === 1 &&
                        <PicForm
                            setData={daftarInstansi.setPicInstansi}
                            data={daftarInstansi.picInstansi}
                            onSubmit={daftarInstansi.onSubmitPicForm}
                            errorMessages={daftarInstansi.picInstansiErrorMessages}
                        />
                    }
                </div>

                {/* Tampilan Formulir Instansi */}
                <div>
                    {daftarInstansi.step === 2 &&
                        <InstansiForm
                            setData={daftarInstansi.setInstansi}
                            data={daftarInstansi.instansi}
                            onSubmit={daftarInstansi.onSubmitInstansiForm}
                            onBackStep={daftarInstansi.showPicForm}
                            errorMessages={daftarInstansi.instansiErrorMessages}
                        />
                    }
                </div>

                {/* Tampilan Konfirmasi Data */}
                <div>
                    {daftarInstansi.step === 3 &&
                        <KonfirmasiData
                            dataPic={daftarInstansi.picInstansi}
                            dataInstansi={daftarInstansi.instansi}
                            onBackStep={daftarInstansi.showInstansiForm}
                            onSubmit={daftarInstansi.onSubmitKonfirmasiData}
                            message={daftarInstansi.konfirmasiDataErrorMessage}
                            loading={daftarInstansi.konfirmasiDataLoading}
                        />
                    }
                </div>

                {/* Tampilan Sukses Kirim */}
                <div>
                    {daftarInstansi.step === 4 &&
                        <SuksesKirim
                            emailInstansi={daftarInstansi.instansi.email}
                            emailPicInstansi={daftarInstansi.picInstansi.email}
                            nomorTeleponInstansi={daftarInstansi.instansi.nomorTelepon}
                            nomorTeleponPicInstansi={daftarInstansi.picInstansi.nomorTelepon}
                            kodeTiketRegistrasi={daftarInstansi.kodeTiketRegistrasi}
                        />
                    }
                </div>
            </div>

            {/* Tampilan Kanan */}
            <div className="w-[40%] max-md:w-full max-md:h-44 overflow-hidden">
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