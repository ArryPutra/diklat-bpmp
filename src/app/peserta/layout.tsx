import AuthLayout from '@/components/layouts/auth-layout'
import { BiBookOpen, BiCheckDouble, BiHistory, BiHome } from 'react-icons/bi'

export default function PesertaLayout({ children }: { children: React.ReactNode }) {
    return (
        <AuthLayout
            menuItems={
                [
                    {
                        name: 'Dashboard',
                        icon: <BiHome />,
                        url: '/peserta/dashboard'
                    },
                    {
                        name: 'Diklat',
                        icon: <BiBookOpen />,
                        url: '/peserta/diklat',
                        submenu: [
                            {
                                icon: <BiCheckDouble/>,
                                name: "Diklat Aktif",
                                url: '/peserta/diklat/aktif'
                            },
                            {
                                icon: <BiHistory/>,
                                name: "Riwayat Diklat",
                                url: '/peserta/diklat/riwayat'
                            }
                        ]
                    }
                ]
            }>
            {children}
        </AuthLayout>
    )
}
