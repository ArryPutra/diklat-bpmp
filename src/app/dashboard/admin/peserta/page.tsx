"use server"

import { getCurrentSession, checkIsAdmin } from '@/actions/auth-action';
import { getPendaftaranDiklatList } from '@/actions/dashboard-action';
import { redirect } from 'next/navigation';
import PesertaView from './view';

interface PageProps {
    searchParams: Promise<{
        page?: string;
        search?: string;
        status?: string;
        diklatId?: string;
    }>;
}

export default async function PesertaPage({ searchParams }: PageProps) {
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
    const diklatId = params.diklatId || '';

    const pesertaList = await getPendaftaranDiklatList(page, 10, diklatId || undefined, status || undefined);

    return (
        <PesertaView 
            user={session.user} 
            pesertaList={pesertaList}
            currentPage={page}
            search={search}
            statusFilter={status}
            diklatFilter={diklatId}
        />
    );
}
