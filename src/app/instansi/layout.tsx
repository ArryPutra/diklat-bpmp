
import AuthLayout from '@/components/layouts/auth-layout'
import { BiBookReader, BiHome, BiUser } from 'react-icons/bi'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <AuthLayout
            menuItems={
                [
                    { name: 'Dashboard', icon: <BiHome />, url: '/instansi/dashboard' },
                    { name: 'Cari Diklat', icon: <BiBookReader />, url: '/diklat' },
                    { name: 'Kelola Peserta', icon: <BiUser />, url: '/instansi/kelola-peserta' },
                ]
            }>
            {children}
        </AuthLayout>
    )
}
