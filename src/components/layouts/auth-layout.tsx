'use client'

import { getCurrentUser, logoutAction } from "@/actions/auth-action";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useActionState, useEffect, useState, useTransition } from "react";
import { BiChevronDown, BiLogOut, BiMenu, BiX } from "react-icons/bi";
import LoadingScreen from "../shared/loading-screen";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { Spinner } from "../ui/spinner";

type MenuItem = {
    name: string;
    icon: React.ReactNode;
    url: string;
    submenu?: MenuItem[];
}

type AuthLayoutProps = {
    children: React.ReactNode
    menuItems: MenuItem[]
}

export default function AuthLayout({ children, menuItems }: AuthLayoutProps) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [profileMenu, setProfileMenu] = useState(false);
    const [expandedMenus, setExpandedMenus] = useState<string[]>([]);
    const [user, setUser] = useState({ name: '...', namaPeran: '...' });

    const router = useRouter();
    const pathname = usePathname();

    const getTitle = menuItems.find(item => item.url === pathname || pathname.startsWith(item.url + '/'));

    useEffect(() => {
        async function fetchCurrentUser() {
            const user: any = await getCurrentUser();
            setUser({ name: user?.name!, namaPeran: user?.peran.nama });
        }

        fetchCurrentUser();
    }, []);

    // Auto-expand menu if current path matches submenu
    useEffect(() => {
        const newExpandedMenus: string[] = [];
        menuItems.forEach(item => {
            if (item.submenu && item.submenu.length > 0) {
                const hasActiveSubmenu = item.submenu.some(subitem =>
                    pathname.startsWith(subitem.url)
                );
                if (hasActiveSubmenu) {
                    newExpandedMenus.push(item.name);
                }
            }
        });
        setExpandedMenus(newExpandedMenus);
    }, [pathname, menuItems]);

    const [isPending, startTransition] = useTransition();

    const toggleMenu = (menuName: string) => {
        setExpandedMenus(prev =>
            prev.includes(menuName)
                ? prev.filter(m => m !== menuName)
                : [...prev, menuName]
        );
    };

    return (
        <div className="bg-gray-50 flex">
            <LoadingScreen isLoading={isPending} />
            {/* SIDEBAR */}
            <aside className={`min-w-60 bg-white px-5 h-dvh z-50 fixed
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
                <nav className="flex w-full flex-col pt-6 space-y-3 overflow-y-auto max-h-[calc(100dvh-120px)]">
                    {
                        menuItems.map((item, index) => (
                            <div key={index}>
                                <button
                                    className={`h-12 rounded-xl flex items-center gap-3 px-3 duration-300 transition-[background-color] w-full justify-between
                                        ${pathname.startsWith(item.url) ? 'border border-transparent bg-primary text-white shadow' : 'border hover:bg-gray-100'}`}
                                    onClick={() => {
                                        if (item.submenu && item.submenu.length > 0) {
                                            toggleMenu(item.name);
                                        } else if (pathname.startsWith(item.url)) {
                                            return;
                                        } else if (!item.url) {
                                            return;
                                        } else {
                                            startTransition(() => {
                                                router.push(item.url!)
                                                setSidebarOpen(false)
                                            })
                                        }
                                    }}>
                                    <div className="flex items-center gap-3">
                                        {item.icon}
                                        <span className="font-semibold">{item.name}</span>
                                    </div>
                                    {item.submenu && item.submenu.length > 0 && (
                                        <BiChevronDown
                                            size={20}
                                            className={`duration-300 transition-transform ${expandedMenus.includes(item.name) ? 'rotate-180' : ''
                                                }`}
                                        />
                                    )}
                                </button>

                                {/* SUBMENU */}
                                {item.submenu && item.submenu.length > 0 && expandedMenus.includes(item.name) && (
                                    <div className="ml-4 mt-2 space-y-2 border-l-2 border-gray-200 pl-3">
                                        {item.submenu.map((subitem, subindex) => (
                                            <button
                                                key={subindex}
                                                className={`min-h-10 rounded-lg flex items-center gap-3 px-3 duration-300 transition-[background-color] w-full text-sm border
                                                    ${pathname.startsWith(subitem.url) ? 'bg-primary text-white shadow' : 'hover:bg-gray-100'}`}
                                                onClick={() => {
                                                    if (pathname.startsWith(subitem.url)) return;
                                                    startTransition(() => {
                                                        router.push(subitem.url!)
                                                        setSidebarOpen(false)
                                                    })
                                                }}>
                                                {subitem.icon}
                                                <span className="font-medium">{subitem.name}</span>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))
                    }
                </nav>
            </aside>

            <div className="flex flex-col w-full">
                {/* HEADER */}
                <header className="min-h-20 flex items-center px-5 justify-between bg-white w-full border-b fixed pl-65 z-30
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

                <main className="w-full pl-65 pt-25 min-h-dvh p-5
                max-md:pl-5 max-md:pt-25">
                    <h1 className="md:hidden text-xl font-bold text-primary mb-6">
                        {getTitle?.name}
                    </h1>

                    {/* CONTENT VIEW */}
                    <div className="space-y-6">
                        {children}
                    </div>
                </main>
            </div>

            {/* OVERLAY (FOR MOBILE WHEN SIDEBAR IS OPEN) */}
            <div className={`max-md:w-full max-md:h-screen max-md:duration-300 max-md:fixed max-md:z-40
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
        <div className='p-6 bg-white border rounded-md w-full space-y-6'>
            {children}
        </div>
    )
}