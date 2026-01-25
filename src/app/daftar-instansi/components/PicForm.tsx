import { Button } from '@/components/ui/button'
import { Field, FieldError, FieldGroup, FieldLabel, FieldSet } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { PicInstansi } from '@/models/PicInstansi'
import React from 'react'
import { BiRightArrowAlt } from 'react-icons/bi'

export default function PicForm({
    setData,
    data,
    onSubmit,
    errorMessages
}: {
    setData: React.Dispatch<React.SetStateAction<PicInstansi>>,
    data: PicInstansi,
    onSubmit: () => void,
    errorMessages: PicInstansi
}) {

    return (
        <>
            <h1 className='text-xl font-semibold mb-6'>Data PIC</h1>

            <FieldGroup>

                <FieldSet>
                    <Field>
                        <FieldLabel>Nama</FieldLabel>
                        <Input placeholder='Contoh: Farhan Aryo' name='nama'
                            value={data.nama}
                            onChange={(e) =>
                                setData(prev => ({ ...prev, nama: e.target.value }))
                            } />
                        {
                            errorMessages.nama &&
                            <FieldError>{errorMessages.nama}</FieldError>
                        }
                    </Field>
                    <Field>
                        <FieldLabel>Email</FieldLabel>
                        <Input placeholder='Contoh: farhanaryo@gmail.com' type='email' name='email'
                            value={data.email}
                            onChange={(e) =>
                                setData(prev => ({ ...prev, email: e.target.value }))
                            } />
                        {
                            errorMessages.email &&
                            <FieldError>{errorMessages.email}</FieldError>
                        }
                    </Field>
                    <Field>
                        <FieldLabel>Nomor Telepon</FieldLabel>
                        <Input placeholder='Contoh: 08123456789' type='number' name='nomorTelepon'
                            value={data.nomorTelepon}
                            onChange={(e) =>
                                setData(prev => ({ ...prev, nomorTelepon: e.target.value }))
                            } />
                        {
                            errorMessages.nomorTelepon &&
                            <FieldError>{errorMessages.nomorTelepon}</FieldError>
                        }
                    </Field>
                    <Field>
                        <FieldLabel>Jabatan</FieldLabel>
                        <Input placeholder='Contoh: Pranata Komputer' name='jabatan'
                            value={data.jabatan}
                            onChange={(e) =>
                                setData(prev => ({ ...prev, jabatan: e.target.value }))
                            } />
                        {
                            errorMessages.jabatan &&
                            <FieldError>{errorMessages.jabatan}</FieldError>
                        }
                    </Field>
                </FieldSet>

                <Button className='w-fit ml-auto' onClick={() => onSubmit()}>Selanjutnya <BiRightArrowAlt /></Button>
            </FieldGroup>
        </>
    )
}