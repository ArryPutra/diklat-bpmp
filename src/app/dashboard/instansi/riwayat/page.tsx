import { getCurrentSession, getApprovedInstansi } from "@/actions/auth-action";
import { redirect } from "next/navigation";
import { getRiwayatDiklat } from "@/actions/instansi-action";
import RiwayatView from "./view";

export default async function RiwayatPage() {
    const session = await getCurrentSession();

    if (!session?.user) {
        redirect("/login");
    }

    const instansi = await getApprovedInstansi(session.user.email);

    if (!instansi) {
        redirect("/dashboard");
    }

    const riwayatResult = await getRiwayatDiklat(instansi.id);
    const riwayatList = riwayatResult.success ? riwayatResult.data : [];

    return (
        <RiwayatView 
            instansiNama={instansi.nama}
            riwayatList={riwayatList ?? []}
        />
    );
}
