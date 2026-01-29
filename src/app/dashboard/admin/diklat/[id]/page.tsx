"use server"

import { getCurrentSession, checkIsAdmin } from '@/actions/auth-action';
import { getDiklatById } from '@/actions/dashboard-action';
import { redirect, notFound } from 'next/navigation';
import EditDiklatView from './view';

interface PageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function EditDiklatPage({ params }: PageProps) {
    const session = await getCurrentSession();

    if (!session?.user) {
        redirect('/login');
    }

    const isAdmin = await checkIsAdmin(session.user.id);
    if (!isAdmin) {
        redirect('/dashboard');
    }

    const { id } = await params;
    const diklat = await getDiklatById(id);

    if (!diklat) {
        notFound();
    }

    return <EditDiklatView user={session.user} diklat={diklat} />;
}
