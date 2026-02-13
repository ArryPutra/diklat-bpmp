"use client"

import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { useRouter, useSearchParams } from 'next/navigation'
import { useTransition } from 'react'
import { BiBuilding, BiUser } from 'react-icons/bi'

export default function ButtonNav() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const [isPending, startTransition] = useTransition()

    const currentContent = searchParams.get('content') ?? 'verifikasi-registrasi-instansi'

    const handleNavigate = (content: string) => {
        if (content === currentContent) return
        const params = new URLSearchParams()

        params.set('content', content)

        startTransition(() => {
            router.push(`/admin/dashboard?${params.toString()}`)
        })
    }

    return (
        <div className='mb-6 flex gap-3 flex-wrap'>
            <Button
                onClick={() => handleNavigate('verifikasi-registrasi-instansi')}
                variant={currentContent === 'verifikasi-registrasi-instansi' ? 'default' : 'outline'}>
                <BiBuilding />
                Registrasi Instansi
                {isPending && currentContent !== 'verifikasi-registrasi-instansi' && <Spinner />}
            </Button>

            <Button
                onClick={() => handleNavigate('verifikasi-peserta-diklat')}
                variant={currentContent === 'verifikasi-peserta-diklat' ? 'default' : 'outline'}>
                <BiUser />
                Peserta Diklat
                {isPending && currentContent !== 'verifikasi-peserta-diklat' && <Spinner />}
            </Button>
        </div>
    )
}
