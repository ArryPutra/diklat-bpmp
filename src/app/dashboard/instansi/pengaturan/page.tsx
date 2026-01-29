import { getCurrentSession, getApprovedInstansi } from "@/actions/auth-action";
import { redirect } from "next/navigation";
import PengaturanView from "./view";

export default async function PengaturanPage() {
    const session = await getCurrentSession();

    if (!session?.user) {
        redirect("/login");
    }

    const instansi = await getApprovedInstansi(session.user.email);

    if (!instansi) {
        redirect("/dashboard");
    }

    return (
        <PengaturanView 
            user={session.user}
            instansiNama={instansi.nama}
        />
    );
}
