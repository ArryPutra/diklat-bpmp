
import AuthLayout from '@/components/layouts/auth-layout'
import { BiBook, BiBookBookmark, BiBookReader, BiBuilding, BiHome, BiLeaf, BiSolidCaretUpCircle, BiSolidGraduation, BiUser, BiUserPlus, BiUserVoice } from 'react-icons/bi'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <AuthLayout
            nameProfile='Arry'
            menuItems={
                [
                    { name: 'Dashboard', icon: <BiHome />, url: '/admin/dashboard' },
                    { name: 'Diklat', icon: <BiBookReader />, url: '/admin/kelola-diklat' },
                    { name: 'Instansi', icon: <BiBuilding />, url: '/admin/instansi' },
                    { name: 'Peserta', icon: <BiUser />, url: '/admin/peserta' },
                    { name: 'Narasumber', icon: <BiUserVoice />, url: '/admin/narasumber' },
                ]
            }>
            {children}
        </AuthLayout>
    )
}
