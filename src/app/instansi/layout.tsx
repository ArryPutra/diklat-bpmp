
import AuthLayout from '@/components/layouts/auth-layout'
import { BiBook, BiBookBookmark, BiBookReader, BiBuilding, BiHome, BiLeaf, BiSolidCaretUpCircle, BiSolidGraduation, BiUser, BiUserPlus, BiUserVoice } from 'react-icons/bi'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <AuthLayout
            menuItems={
                [
                    { name: 'Dashboard', icon: <BiHome />, url: '/instansi/dashboard' },
                ]
            }>
            {children}
        </AuthLayout>
    )
}
