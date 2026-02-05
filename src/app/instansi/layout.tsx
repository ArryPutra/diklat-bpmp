
import AuthLayout from '@/components/layouts/auth-layout'
import { BiBookReader, BiHome, BiUser } from 'react-icons/bi'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <AuthLayout
            menuItems={
                [
                    { name: 'Dashboard', icon: <BiHome />, url: '/instansi/dashboard' },
                    { name: 'Diklat', icon: <BiBookReader />, url: '/instansi/diklat' },
                    { name: 'Peserta', icon: <BiUser />, url: '/instansi/peserta' },
                ]
            }>
            {children}
        </AuthLayout>
    )
}
