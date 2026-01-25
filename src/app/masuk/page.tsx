import Layout from '@/components/layouts/layout'
import { Button } from '@/components/ui/button'
import { Field, FieldLabel, FieldSet } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import Image from 'next/image'

export default function Masuk() {
    return (
        <Layout
            parentClassName='px-0!'
            className='h-screen flex gap-8 py-0! max-w-full! 
        max-md:flex-col-reverse max-md:justify-end'>
            <div className='w-[60%] flex items-center justify-center px-5
            max-md:w-full'>
                <div className='max-w-96 w-full
                max-md:max-w-full'>
                    <Image
                        src='/images/kemendikdasmen-bpmp-kalsel.png'
                        alt='Logo Kemendikdasmen BPMP Kalsel'
                        width={280}
                        height={42} />
                    <div className='mt-8'>
                        <h1 className='font-bold text-2xl text-primary'>Masuk</h1>
                        <p>Selamat datang, silahkan login</p>

                        <FieldSet className='mt-8'>
                            <Field>
                                <FieldLabel>Email</FieldLabel>
                                <Input placeholder='Masukkan email' />
                            </Field>
                            <Field>
                                <FieldLabel>Password</FieldLabel>
                                <Input placeholder='Masukkan password' />
                            </Field>
                            <Button>Masuk</Button>
                        </FieldSet>
                    </div>
                </div>
            </div>
            <div className="w-[40%] flex
            max-md:w-full max-md:h-[20%]">
                <Image
                    src='/images/gedung-bpmp-kalsel.jpg'
                    alt='Gedung BPMP Kalsel'
                    width={1000}
                    height={1000}
                    className='object-cover object-center w-full' />
            </div>
        </Layout>
    )
}
