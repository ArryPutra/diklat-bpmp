"use server"

import { getCurrentSession, checkIsAdmin } from '@/actions/auth-action';
import { getDiklatList } from '@/actions/dashboard-action';
import { redirect } from 'next/navigation';
import DiklatListView from './view';

export default async function DiklatPage({
    searchParams
}: {
    searchParams: Promise<{ page?: string; search?: string; status?: string }>
}) {
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
    const isActive = params.status === 'active' ? true : params.status === 'inactive' ? false : undefined;

    const result = await getDiklatList({ page, limit: 10, search, isActive });

    return (
        <DiklatListView
            user={session.user}
            diklatList={result.success ? result.data : []}
            pagination={result.success ? result.pagination : { page: 1, limit: 10, total: 0, totalPages: 1 }}
            currentSearch={search}
            currentStatus={params.status || 'all'}
        />
    );
}
