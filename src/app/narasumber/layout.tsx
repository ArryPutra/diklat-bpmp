import AuthLayout from '@/components/layouts/auth-layout'
import { BiBookAdd, BiBookContent, BiBookOpen, BiHistory, BiHome } from 'react-icons/bi'

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
                        url: '/narasumber/materi-diklat',
                        submenu: [
                            {
                                icon: <BiBookContent/>,
                                name: 'Materi Aktif',
                                url: '/narasumber/materi-diklat/aktif'
                            },
                            {
                                icon: <BiHistory/>,
                                name: 'Riwayat Materi',
                                url: '/narasumber/materi-diklat/riwayat'
                            }
                        ]
                    },
                ]
            }>
            {children}
        </AuthLayout>
    )
}
