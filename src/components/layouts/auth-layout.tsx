'use client'

import Image from "next/image"
import { usePathname, useRouter } from "next/navigation";
import { useActionState, useEffect, useRef, useState } from "react";
import { BiBookContent, BiChevronDown, BiDownArrowCircle, BiHome, BiLogOut, BiMenu, BiMoon, BiSolidGraduation, BiSolidMoon, BiSolidSun, BiSun, BiX } from "react-icons/bi"
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { getCurrentSession, getCurrentUser, logoutAction } from "@/actions/auth-action";
import { Spinner } from "../ui/spinner";
import { Switch } from "../ui/switch";

type MenuItem = {
    name: string;
    icon: React.ReactNode;
    url: string;
}

type AuthLayoutProps = {
    children: React.ReactNode
    menuItems: MenuItem[]
}

export default function AuthLayout({ children, menuItems }: AuthLayoutProps) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [profileMenu, setProfileMenu] = useState(false);
    const [user, setUser] = useState({ name: '...', namaPeran: '...' });

    const router = useRouter();
    const pathname = usePathname();

    const getTitle = menuItems.find(item => item.url === pathname);

    useEffect(() => {
        async function fetchCurrentUser() {
            const user = await getCurrentUser();
            setUser({ name: user?.name!, namaPeran: user?.peran?.nama! });
        }

        fetchCurrentUser();
    }, []);

    return (
        <div className="bg-gray-50 flex">
            {/* SIDEBAR */}
            <aside className={`min-w-60 bg-white px-5 h-dvh z-10 fixed
            max-md:shadow max-md:-left-full max-md:duration-500
                ${sidebarOpen && 'max-md:left-0'}`}>
                <div className="border-b h-20 flex items-center justify-center
                max-md:justify-between">
                    <Image
                        src='/images/logo/logo.png'
                        alt="Logo BPMP"
                        width={384}
                        height={75}
                        priority
                        className="w-40 max-md:w-36" />
                    <BiX size={36} className="md:hidden"
                        onClick={() => setSidebarOpen(false)} />
                </div>

                {/* MENU ITEMS */}
                <nav className="flex w-full flex-col pt-6 space-y-3">
                    {
                        menuItems.map((item, index) => (
                            <button key={index} className={`h-12 rounded-xl flex items-center gap-3 pl-3 duration-300 transition-[background-color]
                                ${pathname === item.url ? 'border border-transparent bg-primary text-white shadow' : 'border hover:bg-gray-100'}`}
                                onClick={() => {
                                    if (pathname == item.url) return;

                                    router.push(item.url)
                                    setSidebarOpen(false)
                                }
                                }>
                                {item.icon}
                                <span className="font-semibold">{item.name}</span>
                            </button>
                        ))
                    }
                </nav>
            </aside>

            <div className="flex flex-col w-full">
                {/* HEADER */}
                <header className="min-h-20 flex items-center px-5 justify-between bg-white w-full border-b fixed pl-65
                max-md:pl-5">
                    <BiMenu size={40} className="md:hidden"
                        onClick={() => { setSidebarOpen(true) }} />

                    <h1 className="text-2xl font-bold text-primary
            max-md:hidden">
                        {getTitle?.name}
                    </h1>
                    <div className="flex items-center gap-3 cursor-pointer"
                        onClick={() => setProfileMenu(!profileMenu)}>
                        <h1 className="font-semibold select-none">{user.name}</h1>
                        <BiChevronDown />
                    </div>

                    <PopupProfileMenu
                        profileMenu={profileMenu}
                        name={user.name}
                        namaPeran={user.namaPeran} />
                </header>

                <main className="overflow-auto w-full pl-65 pt-25 h-dvh
                max-md:p-5 max-md:pt-25">
                    <h1 className="md:hidden text-xl font-bold text-primary mb-6">
                        {getTitle?.name}
                    </h1>

                    {/* CONTENT VIEW */}
                    {children}
                </main>
            </div>

            {/* OVERLAY (FOR MOBILE WHEN SIDEBAR IS OPEN) */}
            <div className={`max-md:w-full max-md:h-screen max-md:duration-300 max-md:fixed
                ${sidebarOpen ? 'max-md:bg-black/50 max-md:pointer-events-auto' : 'max-md:bg-transparent max-md:pointer-events-none'}`}
                onClick={() => { setSidebarOpen(false) }}>

            </div>
        </div>
    )
}

function PopupProfileMenu({
    profileMenu,
    name,
    namaPeran,
}: {
    profileMenu: boolean
    name: string
    namaPeran: string
}) {
    const [state, formAction, pending] = useActionState(logoutAction, null);

    return (
        <div
            className={`absolute top-24 bg-white/20 backdrop-blur right-10 p-4 shadow border duration-500 z-10
            max-md:right-5
            ${profileMenu ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none translate-x-2 translate-y-1 scale-95'}`}>

            <h1 className="text-sm font-semibold mb-1">{name}</h1>
            <h1 className="text-sm mb-4">{namaPeran}</h1>

            <Separator className="my-4" />

            <form action={formAction}>
                <Button variant='destructive'>
                    <BiLogOut />
                    Keluar {pending && <Spinner />}
                </Button>
            </form>
        </div>
    )
}

export function ContentCanvas({ children }: { children: React.ReactNode }) {
    return (
        <div className='p-6 bg-white border rounded-md w-full'>
            {children}
        </div>
    )
}