"use server"

import { getCurrentSession, checkIsAdmin } from '@/actions/auth-action';
import { redirect } from 'next/navigation';
import BantuanView from './view';

export default async function BantuanPage() {
    const session = await getCurrentSession();

    if (!session?.user) {
        redirect('/login');
    }

    const isAdmin = await checkIsAdmin(session.user.id);
    if (!isAdmin) {
        redirect('/dashboard');
    }

    return (
        <BantuanView user={session.user} />
    );
}
