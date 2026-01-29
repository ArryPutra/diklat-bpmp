"use server"

import { getCurrentSession, checkIsAdmin } from '@/actions/auth-action';
import { getRegistrasiInstansiList } from '@/actions/dashboard-action';
import { redirect } from 'next/navigation';
import InstansiView from './view';

interface PageProps {
    searchParams: Promise<{
        page?: string;
        search?: string;
        status?: string;
    }>;
}

export default async function InstansiPage({ searchParams }: PageProps) {
    const session = await getCurrentSession();

    if (!session?.user) {
        redirect('/login');
    }

    const isAdmin = await checkIsAdmin(session.user.id);
    if (!isAdmin) {
        redirect('/dashboard');
    }

    const params = await searchParams;
    const page = parseInt(params.page || '1');
    const search = params.search || '';
    const status = params.status || '';

    const instansiList = await getRegistrasiInstansiList(page, 10, search, status || undefined);

    return (
        <InstansiView 
            user={session.user} 
            instansiList={instansiList}
            currentPage={page}
            search={search}
            statusFilter={status}
        />
    );
}
