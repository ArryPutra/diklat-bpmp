"use server"

import { getCurrentSession, checkIsAdmin } from '@/actions/auth-action';
import { 
    getDashboardStats, 
    getDiklatList, 
    getRegistrasiInstansiList, 
    getAktivitasList,
    getWeeklyStats 
} from '@/actions/dashboard-action';
import DashboardView from './view'
import { redirect } from 'next/navigation';

export default async function DashboardPage() {

    const session = await getCurrentSession();

    // Redirect jika belum login
    if (!session?.user) {
        redirect('/login');
    }

    // Cek apakah user adalah admin
    const isAdmin = await checkIsAdmin(session.user.id);

    // Redirect jika bukan admin
    if (!isAdmin) {
        redirect('/dashboard');
    }

    // Fetch semua data dari database
    const [stats, diklat, instansi, aktivitas, weeklyStats] = await Promise.all([
        getDashboardStats(),
        getDiklatList({ limit: 5, isActive: true }),
        getRegistrasiInstansiList({ limit: 5 }),
        getAktivitasList(5),
        getWeeklyStats()
    ]);

    return (
        <DashboardView 
            user={session?.user}
            stats={stats.success ? stats.data : null}
            diklatList={diklat.success ? diklat.data : []}
            instansiList={instansi.success ? instansi.data : []}
            aktivitasList={aktivitas.success ? aktivitas.data : []}
            weeklyData={weeklyStats.success ? weeklyStats.data : []}
        />
    );
}
