"use server"

import { getCurrentSession, checkIsAdmin } from '@/actions/auth-action';
import { redirect } from 'next/navigation';
import TambahDiklatView from './view';

export default async function TambahDiklatPage() {
    const session = await getCurrentSession();

    if (!session?.user) {
        redirect('/login');
    }

    const isAdmin = await checkIsAdmin(session.user.id);
    if (!isAdmin) {
        redirect('/dashboard');
    }

    return <TambahDiklatView user={session.user} />;
}
