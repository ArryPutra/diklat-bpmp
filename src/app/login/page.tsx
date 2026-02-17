"use client";

import { loginAction } from '@/actions/auth-action';
import Layout from '@/components/layouts/guest-layout';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Field, FieldError, FieldLabel, FieldSet } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { PasswordInput } from '@/components/ui/password-input';
import { Spinner } from '@/components/ui/spinner';
import Image from 'next/image';
import { useActionState } from 'react';

export default function Masuk() {
    const [state, formAction, pending] = useActionState(loginAction, null);

    return (
        <Layout
            parentClassName='px-0! overflow-hidden'
            className='min-h-screen flex gap-8 py-0! max-w-full! 
        max-md:flex-col-reverse max-md:justify-end'>
            <div className='w-[60%] flex items-center justify-center px-5
            max-md:w-full'>
                <div className='max-w-96 w-full max-md:max-w-full'>
                    <Image
                        src='/images/logo/kemendikdasmen-bpmp-kalsel.png'
                        alt='Logo Kemendikdasmen BPMP Kalsel'
                        width={280}
                        height={42} />
                    <div className='mt-8'>
                        <h1 className='font-bold text-2xl text-primary'>Masuk</h1>
                        <p className='text-muted-foreground'>Selamat datang, silahkan login</p>

                        {
                            state?.message &&
                            <Alert variant='destructive' className='mt-6'>
                                <AlertTitle>Pesan Kesalahan:</AlertTitle>
                                <AlertDescription>{state.message}</AlertDescription>
                            </Alert>
                        }

                        <form action={formAction}>
                            <FieldSet className='mt-8'>
                                <Field>
                                    <FieldLabel>Email</FieldLabel>
                                    <Input
                                        autoFocus
                                        placeholder='Masukkan email'
                                        type='email'
                                        name='email'
                                        defaultValue={state?.values?.email} />
                                    {
                                        state?.errors?.field?.email &&
                                        <FieldError>{state.errors.field?.email}</FieldError>
                                    }
                                </Field>
                                <Field>
                                    <FieldLabel>Password</FieldLabel>
                                    <PasswordInput
                                        placeholder='Masukkan password'
                                        name='password' />
                                    {
                                        state?.errors?.field?.password &&
                                        <FieldError>{state.errors.field.password}</FieldError>
                                    }
                                </Field>
                                <Button className='hover-lift transition-all duration-300 hover:shadow-lg'>
                                    Masuk {pending && <Spinner />}
                                </Button>
                            </FieldSet>
                        </form>
                    </div>
                </div>
            </div>
            <div className="w-[40%] flex max-md:w-full max-md:h-40">
                <Image
                    src='/images/gedung-bpmp-kalsel.jpg'
                    alt='Gedung BPMP Kalsel'
                    width={1000}
                    height={1000}
                    className='object-cover object-center w-full' />
            </div>
        </Layout >
    )
}
