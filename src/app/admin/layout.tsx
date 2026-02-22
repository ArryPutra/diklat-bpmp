import AuthLayout from '@/components/layouts/auth-layout'
import { BiBookReader, BiBuilding, BiCheckDouble, BiHome, BiTable, BiUser, BiUserVoice } from 'react-icons/bi'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <AuthLayout
            menuItems={
                [
                    {
                        name: 'Dashboard',
                        icon: <BiHome />,
                        url: '/admin/dashboard'
                    },
                    {
                        name: 'Kelola Diklat',
                        icon: <BiBookReader />,
                        url: '/admin/kelola-diklat',
                        submenu: [
                            { name: "Daftar Diklat", icon: <BiTable />, url: "/admin/kelola-diklat/daftar-diklat" },
                            { name: "Verif Peserta", icon: <BiUser />, url: "/admin/kelola-diklat/verifikasi-peserta" },
                            { name: "Verif Kelulusan", icon: <BiCheckDouble />, url: "/admin/kelola-diklat/verif-kelulusan" },
                        ]
                    },
                    {
                        name: 'Kelola Instansi',
                        icon: <BiBuilding />,
                        url: '/admin/kelola-instansi',
                        submenu: [
                            { name: "Daftar Instansi", icon: <BiTable />, url: "/admin/kelola-instansi/daftar-instansi" },
                            { name: "Verifikasi", icon: <BiCheckDouble />, url: "/admin/kelola-instansi/verifikasi-instansi" }
                        ]
                    },
                    {
                        name: 'Narasumber',
                        icon: <BiUserVoice />,
                        url: '/admin/kelola-narasumber'
                    },
                ]
            }>
            {children}
        </AuthLayout>
    )
}
