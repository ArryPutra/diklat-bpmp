
import AuthLayout from '@/components/layouts/auth-layout'
import { BiBookReader, BiHome, BiSearch, BiUser } from 'react-icons/bi'

export default function InstansiLayout({ children }: { children: React.ReactNode }) {
    return (
        <AuthLayout
            menuItems={
                [
                    { name: 'Dashboard', icon: <BiHome />, url: '/instansi/dashboard' },
                    {
                        name: 'Diklat',
                        icon: <BiBookReader />,
                        url: '/instansi/diklat',
                        submenu: [
                            {
                                name: 'Cari Diklat',
                                icon: <BiSearch />,
                                url: '/diklat'
                            },
                            {
                                name: 'Peserta Diklat',
                                icon: <BiUser />,
                                url: '/instansi/diklat/peserta'
                            },
                        ]

                    },
                    { name: 'Kelola Peserta', icon: <BiUser />, url: '/instansi/kelola-peserta' },
                ]
            }>
            {children}
        </AuthLayout>
    )
}
