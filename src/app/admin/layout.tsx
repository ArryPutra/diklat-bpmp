
import AuthLayout from '@/components/layouts/auth-layout'
import { BiBookReader, BiBuilding, BiHome, BiUserVoice } from 'react-icons/bi'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <AuthLayout
            menuItems={
                [
                    { name: 'Dashboard', icon: <BiHome />, url: '/admin/dashboard' },
                    { name: 'Kelola Diklat', icon: <BiBookReader />, url: '/admin/kelola-diklat' },
                    { name: 'Kelola Instansi', icon: <BiBuilding />, url: '/admin/kelola-instansi' },
                    { name: 'Narasumber', icon: <BiUserVoice />, url: '/admin/narasumber' },
                ]
            }>
            {children}
        </AuthLayout>
    )
}
