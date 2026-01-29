"use server"

import { getCurrentSession, checkIsAdmin } from '@/actions/auth-action';
import { getDashboardStats, getWeeklyStats } from '@/actions/dashboard-action';
import { redirect } from 'next/navigation';
import LaporanView from './view';

export default async function LaporanPage() {
    const session = await getCurrentSession();

    if (!session?.user) {
        redirect('/login');
    }

    const isAdmin = await checkIsAdmin(session.user.id);
    if (!isAdmin) {
        redirect('/dashboard');
    }

    const stats = await getDashboardStats();
    const weeklyData = await getWeeklyStats();

    return (
        <LaporanView 
            user={session.user} 
            stats={stats}
            weeklyData={weeklyData}
        />
    );
}
