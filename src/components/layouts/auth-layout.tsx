'use client'

import { getCurrentUser } from "@/actions/auth-action";
import { useRouter } from "@bprogress/next/app";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { BiChevronDown, BiMenu, BiX } from "react-icons/bi";
import LoadingScreen from "../shared/loading-screen";

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
    const [expandedMenus, setExpandedMenus] = useState<string[]>([]);
    const [user, setUser] = useState({ name: '...', namaPeran: '...', email: '...' });

    const router = useRouter();
    const pathname = usePathname();
    const roleSegment = pathname.split('/').filter(Boolean)[0];
    const isProfilePage = pathname === `/${roleSegment}/profil`;

    const activeMenu = menuItems.find(item => item.url === pathname || pathname.startsWith(item.url + '/'));
    const activeSubmenu = menuItems
        .flatMap(item =>
            (item.submenu ?? []).map(subitem => ({
                parentName: item.name,
                subitem,
            }))
        )
        .find(({ subitem }) => pathname === subitem.url || pathname.startsWith(subitem.url + '/'));

    const parentTitle = activeSubmenu?.parentName ?? activeMenu?.name ?? '';
    const submenuTitle = activeSubmenu?.subitem.name;
    const headerTitle = isProfilePage ? 'Profil Saya' : parentTitle;
    const profileInitial = user.name?.trim()?.charAt(0)?.toUpperCase() || '?';

    useEffect(() => {
        async function fetchCurrentUser() {
            const user: any = await getCurrentUser();
            setUser({
                name: user?.name ?? 'Pengguna',
                namaPeran: user?.peran?.nama ?? '-',
                email: user?.email ?? '-',
            });
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
            <aside className={`min-w-60 bg-white px-5 h-dvh z-50 fixed flex flex-col
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
                <nav className="flex w-full flex-col pt-6 space-y-3 overflow-y-auto flex-1 pb-4">
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

                <div className="border-t py-4 w-50">
                    <button className={`w-full rounded-xl border px-3 py-3 text-left duration-300
                        ${isProfilePage ? 'border border-transparent bg-primary text-white shadow' : 'hover:bg-gray-50'}`}
                        onClick={() => {
                            if (isProfilePage) return;
                            startTransition(() => {
                                router.push(`/${roleSegment}/profil`)
                                setSidebarOpen(false)
                            })
                        }}>
                        <div className="flex items-center gap-3">
                            <div className={`size-8 rounded-full flex items-center justify-center font-bold text-sm
                                ${isProfilePage ? 'bg-white text-primary' : 'bg-primary text-white'}`}>
                                {profileInitial}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="block w-full text-sm font-semibold truncate">{user.name}</p>
                                <p className={`block w-full text-xs truncate ${isProfilePage ? 'text-white/80' : 'text-gray-500'}`}>{user.email}</p>
                            </div>
                        </div>
                    </button>
                </div>
            </aside>

            <div className="flex flex-col w-full">
                {/* HEADER */}
                <header className="min-h-20 flex items-center px-5 justify-between bg-white w-full border-b fixed pl-65 z-30
                max-md:pl-5">
                    <BiMenu size={40} className="md:hidden"
                        onClick={() => { setSidebarOpen(true) }} />

                    <h1 className="text-2xl font-bold text-primary
            max-md:hidden">
                        {!isProfilePage && submenuTitle ? (
                            <span className="flex items-center gap-2">
                                <span>{headerTitle}</span>
                                <span className="text-base font-medium text-primary/80">&gt; {submenuTitle}</span>
                            </span>
                        ) : (
                            headerTitle
                        )}
                    </h1>
                </header>

                <main className="w-full pl-65 pt-25 min-h-dvh p-5
                max-md:pl-5 max-md:pt-25">
                    <h1 className="md:hidden text-xl font-bold text-primary mb-6">
                        {!isProfilePage && submenuTitle ? (
                            <span className="flex items-center gap-2">
                                <span>{headerTitle}</span>
                                <span className="text-sm font-medium text-primary/80">&gt; {submenuTitle}</span>
                            </span>
                        ) : (
                            headerTitle
                        )}
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

export function ContentCanvas({ children }: { children: React.ReactNode }) {
    return (
        <div className='p-6 bg-white border rounded-md w-full space-y-6'>
            {children}
        </div>
    )
}