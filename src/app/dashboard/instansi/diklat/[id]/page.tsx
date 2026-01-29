import { getCurrentSession, getApprovedInstansi } from "@/actions/auth-action";
import { redirect, notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import DaftarPesertaView from "./view";

interface Props {
    params: Promise<{ id: string }>;
}

export default async function DaftarPesertaPage({ params }: Props) {
    const { id } = await params;
    
    const session = await getCurrentSession();

    if (!session?.user) {
        redirect("/login");
    }

    const instansi = await getApprovedInstansi(session.user.email);

    if (!instansi) {
        redirect("/dashboard");
    }

    const diklat = await prisma.diklat.findUnique({
        where: { id },
        include: {
            _count: {
                select: { pendaftaranDiklat: true }
            }
        }
    });

    if (!diklat) {
        notFound();
    }

    // Get peserta yang sudah didaftarkan dari instansi ini
    const pesertaTerdaftar = await prisma.pendaftaranDiklat.findMany({
        where: {
            diklatId: id,
            registrasiInstansiId: instansi.id
        }
    });

    return (
        <DaftarPesertaView 
            instansiId={instansi.id}
            instansiNama={instansi.nama}
            diklat={diklat}
            pesertaTerdaftar={pesertaTerdaftar}
        />
    );
}
