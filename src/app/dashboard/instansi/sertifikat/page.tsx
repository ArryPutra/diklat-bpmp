import { getCurrentSession, getApprovedInstansi } from "@/actions/auth-action";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import SertifikatView from "./view";

export default async function SertifikatPage() {
    const session = await getCurrentSession();

    if (!session?.user) {
        redirect("/login");
    }

    const instansi = await getApprovedInstansi(session.user.email);

    if (!instansi) {
        redirect("/dashboard");
    }

    // Get peserta yang hadir dan berhak mendapat sertifikat
    const sertifikatList = await prisma.pendaftaranDiklat.findMany({
        where: {
            registrasiInstansiId: instansi.id,
            status: "HADIR"
        },
        include: {
            diklat: {
                select: {
                    id: true,
                    nama: true,
                    metode: true,
                    tanggalMulai: true,
                    tanggalSelesai: true
                }
            }
        },
        orderBy: {
            diklat: {
                tanggalSelesai: 'desc'
            }
        }
    });

    return (
        <SertifikatView 
            instansiNama={instansi.nama}
            sertifikatList={sertifikatList}
        />
    );
}
