"use client"

import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { usePathname, useRouter } from 'next/navigation'
import { useTransition } from 'react'
import { BiBuilding, BiUser } from 'react-icons/bi'

export default function ButtonNav() {
    const pathName = usePathname()
    const router = useRouter()
    const [isPending, startTransition] = useTransition()

    const handleNavigate = (href: string) => {
        startTransition(() => {
            router.push(href)
        })
    }

    return (
        <div className='mb-6 flex gap-3 flex-wrap'>
            <Button
                onClick={() => handleNavigate('/admin/dashboard/verifikasi-registrasi-instansi')}
                variant={pathName === '/admin/dashboard/verifikasi-registrasi-instansi' ? 'default' : 'outline'}>
                <BiBuilding /> Registrasi Instansi {isPending && pathName !== '/admin/dashboard/verifikasi-registrasi-instansi' && <Spinner />}
            </Button>

            <Button
                onClick={() => handleNavigate('/admin/dashboard/verifikasi-peserta-diklat')}
                variant={pathName === '/admin/dashboard/verifikasi-peserta-diklat' ? 'default' : 'outline'}>
                <BiUser /> Peserta Diklat {isPending && pathName !== '/admin/dashboard/verifikasi-peserta-diklat' && <Spinner />}
            </Button>

        </div >
    )
}
