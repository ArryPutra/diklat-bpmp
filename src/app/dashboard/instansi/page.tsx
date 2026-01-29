import { getCurrentSession, getApprovedInstansi } from "@/actions/auth-action";
import { redirect } from "next/navigation";
import { getInstansiDashboardStats } from "@/actions/instansi-action";
import DashboardInstansiView from "./view";
import prisma from "@/lib/prisma";

export default async function DashboardInstansiPage() {
    const session = await getCurrentSession();

    if (!session?.user) {
        redirect("/login");
    }

    // Cek apakah user memiliki instansi yang disetujui
    const instansi = await getApprovedInstansi(session.user.email);

    if (!instansi) {
        redirect("/dashboard");
    }

    // Get dashboard stats
    const statsResult = await getInstansiDashboardStats(instansi.id);
    const stats = statsResult.success ? statsResult.data : null;

    // Get recent pendaftaran
    const recentPendaftaran = await prisma.pendaftaranDiklat.findMany({
        where: { registrasiInstansiId: instansi.id },
        include: {
            diklat: {
                select: {
                    id: true,
                    nama: true,
                    metode: true,
                    tanggalMulai: true
                }
            }
        },
        orderBy: { createdAt: 'desc' },
        take: 5
    });

    // Get upcoming diklat
    const upcomingDiklat = await prisma.diklat.findMany({
        where: {
            isActive: true,
            batasPendaftaran: { gte: new Date() }
        },
        include: {
            _count: {
                select: { pendaftaranDiklat: true }
            }
        },
        orderBy: { tanggalMulai: 'asc' },
        take: 3
    });

    return (
        <DashboardInstansiView 
            user={session.user}
            instansi={instansi}
            stats={stats}
            recentPendaftaran={recentPendaftaran}
            upcomingDiklat={upcomingDiklat}
        />
    );
}
