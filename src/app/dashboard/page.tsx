"use server"

import { getCurrentSession, checkIsAdmin, getApprovedInstansi } from '@/actions/auth-action';
import { redirect } from 'next/navigation';
import DashboardSelectorView from './view';
import prisma from '@/lib/prisma';

export default async function DashboardSelectorPage() {
    const session = await getCurrentSession();

    if (!session?.user) {
        redirect('/login');
    }

    // Check roles
    const isAdmin = await checkIsAdmin(session.user.id);
    
    // Check if user has any registered instansi (include pending ones for info)
    const instansi = await prisma.registrasiInstansi.findFirst({
        where: {
            registrasiPicInstansi: {
                email: session.user.email
            }
        },
        include: {
            statusRegistrasiInstansi: true,
            registrasiPicInstansi: true
        }
    });

    const hasInstansi = !!instansi && instansi.statusRegistrasiInstansi.nama === 'DISETUJUI';

    // Auto-redirect based on role
    // If only admin, go directly to admin dashboard
    if (isAdmin && !hasInstansi) {
        redirect('/dashboard/admin');
    }
    
    // If only instansi (not admin), go directly to instansi dashboard
    if (!isAdmin && hasInstansi) {
        redirect('/dashboard/instansi');
    }

    // If user has both roles or neither, show selector
    return (
        <DashboardSelectorView 
            user={session.user} 
            isAdmin={isAdmin}
            hasInstansi={hasInstansi}
            instansi={instansi}
        />
    );
}
