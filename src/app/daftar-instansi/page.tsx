"use client"

import Layout from '@/components/layouts/layout'
import { Separator } from '@/components/ui/separator'
import { useDaftarInstansi } from '@/app/daftar-instansi/useDaftarInstansi'
import Image from 'next/image'
import PicForm from './components/PicForm'
import InstansiForm from './components/InstansiForm'
import { Button } from '@/components/ui/button'
import { BiLeftArrowAlt } from 'react-icons/bi'
import { useRouter } from 'next/navigation'

export default function DaftarInstansi() {
    const daftarInstansi = useDaftarInstansi();

    const router = useRouter();

    return (
        <Layout
            parentClassName='px-0!'
            className='p-0! flex max-w-full! h-screen
            max-md:flex-col-reverse'>

            {/* Tampilan Kiri */}
            <div className='w-[60%] h-screen overflow-auto p-12
            max-md:w-full max-md:p-5 max-md:rounded-t-xl max-md:-mt-4 max-md:shadow-xl max-md:bg-white'>
                <Image
                    src='/images/kemendikdasmen-bpmp-kalsel.png'
                    alt='Logo Kemendikdasmen'
                    width={280}
                    height={45}
                    className='object-contain' />
                <h1 className='mt-12 font-bold text-2xl text-primary'>Daftar Instansi ({daftarInstansi.step}/2)</h1>
                <p>Selamat datang, silahkan daftarkan instansi Anda</p>

                <Button variant='secondary' className='mt-6' onClick={() => router.push('/')}>
                    <BiLeftArrowAlt /> Halaman Utama
                </Button>

                <Separator className='my-6' />

                {/* Tampilan Formulir PIC */}
                {daftarInstansi.step === 1 &&
                    <PicForm
                        setData={daftarInstansi.setPicInstansi}
                        data={daftarInstansi.picInstansi}
                        onSubmit={() => daftarInstansi.onSubmitPicForm()}
                        errorMessages={daftarInstansi.picInstansiErrorMessages}
                    />
                }

                {/* Tampilan Formulir Instansi */}
                {daftarInstansi.step === 2 &&
                    <InstansiForm
                        setData={daftarInstansi.setInstansi}
                        data={daftarInstansi.instansi}
                        onSubmit={() => daftarInstansi.onSubmitInstansiForm()}
                        onBackStep={daftarInstansi.onBackStep}
                        errorMessages={daftarInstansi.instansiErrorMessages}
                    />
                }
            </div>

            {/* Tampilan Kanan */}
            <div className='w-[40%]
            max-md:w-full max-md:h-44'>
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