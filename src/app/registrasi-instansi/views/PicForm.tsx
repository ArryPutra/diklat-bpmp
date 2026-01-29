import { Button } from '@/components/ui/button'
import { Field, FieldError, FieldGroup, FieldLabel, FieldSet } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { RegistrasiPicInstansi } from '@/models/RegistrasiPicInstansi'
import React from 'react'
import { BiRightArrowAlt } from 'react-icons/bi'

export default function PicForm({
    setData,
    data,
    onSubmit,
    errorMessages
}: {
    setData: React.Dispatch<React.SetStateAction<RegistrasiPicInstansi>>,
    data: RegistrasiPicInstansi,
    onSubmit: (formData: FormData) => void,
    errorMessages: RegistrasiPicInstansi
}) {

    return (
        <>
            <h1 className='text-xl font-semibold mb-6 gradient-text'>Data PIC</h1>

            <form action={onSubmit}>
                <FieldGroup>

                    <FieldSet>
                        <Field className='animate-fade-in-up'>
                            <FieldLabel>Nama</FieldLabel>
                            <Input
                                placeholder='Contoh: Farhan Aryo'
                                name='nama'
                                value={data.nama}
                                className='transition-all duration-300 focus:ring-2 focus:ring-primary/20'
                                onChange={(e) =>
                                    setData(prev => ({ ...prev, nama: e.target.value }))
                                } />
                            {
                                errorMessages.nama &&
                                <FieldError>{errorMessages.nama}</FieldError>
                            }
                        </Field>
                        <Field className='animate-fade-in-up delay-100'>
                            <FieldLabel>Email</FieldLabel>
                            <Input placeholder='Contoh: farhanaryo@gmail.com' type='email' name='email'
                                value={data.email}
                                className='transition-all duration-300 focus:ring-2 focus:ring-primary/20'
                                onChange={(e) =>
                                    setData(prev => ({ ...prev, email: e.target.value }))
                                } />
                            {
                                errorMessages.email &&
                                <FieldError>{errorMessages.email}</FieldError>
                            }
                        </Field>
                        <Field className='animate-fade-in-up delay-200'>
                            <FieldLabel>Nomor Telepon</FieldLabel>
                            <Input placeholder='Contoh: 08123456789' name='nomorTelepon'
                                value={data.nomorTelepon}
                                className='transition-all duration-300 focus:ring-2 focus:ring-primary/20'
                                onChange={(e) =>
                                    setData(prev => ({ ...prev, nomorTelepon: e.target.value }))
                                } />
                            {
                                errorMessages.nomorTelepon &&
                                <FieldError>{errorMessages.nomorTelepon}</FieldError>
                            }
                        </Field>
                        <Field className='animate-fade-in-up delay-300'>
                            <FieldLabel>Jabatan</FieldLabel>
                            <Input placeholder='Contoh: Pranata Komputer' name='jabatan'
                                value={data.jabatan}
                                className='transition-all duration-300 focus:ring-2 focus:ring-primary/20'
                                onChange={(e) =>
                                    setData(prev => ({ ...prev, jabatan: e.target.value }))
                                } />
                            {
                                errorMessages.jabatan &&
                                <FieldError>{errorMessages.jabatan}</FieldError>
                            }
                        </Field>
                    </FieldSet>

                    <Button className='w-fit ml-auto hover-lift group' type='submit'>
                        Selanjutnya <BiRightArrowAlt className='group-hover:translate-x-1 transition-transform' />
                    </Button>
                </FieldGroup>
            </form>
        </>
    )
}