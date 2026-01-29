"use server"

import { getCurrentSession } from '@/actions/auth-action';
import DashboardView from './view'

export default async function DashboardPage() {

    const session = await getCurrentSession();

    return <DashboardView user={session?.user} />;
}
