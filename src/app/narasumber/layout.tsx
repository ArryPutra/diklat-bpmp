import AuthLayout from '@/components/layouts/auth-layout'
import { BiBookContent, BiBookOpen, BiHistory, BiHome } from 'react-icons/bi'

export default function NarasumberLayout({ children }: { children: React.ReactNode }) {
    return (
        <AuthLayout
            menuItems={
                [
                    {
                        name: 'Dashboard',
                        icon: <BiHome />,
                        url: '/narasumber/dashboard'
                    },
                    {
                        name: 'Materi Diklat',
                        icon: <BiBookOpen />,
                        url: '/narasumber/diklat',
                        submenu: [
                            {
                                icon: <BiBookContent />,
                                name: 'Materi Aktif',
                                url: '/narasumber/diklat/aktif'
                            },
                            {
                                icon: <BiHistory />,
                                name: 'Riwayat Materi',
                                url: '/narasumber/diklat/riwayat'
                            }
                        ]
                    },
                ]
            }>
            {children}
        </AuthLayout>
    )
}
