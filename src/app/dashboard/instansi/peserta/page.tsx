import { getCurrentSession, getApprovedInstansi } from "@/actions/auth-action";
import { redirect } from "next/navigation";
import { getPesertaByInstansi } from "@/actions/instansi-action";
import PesertaView from "./view";

export default async function PesertaPage() {
    const session = await getCurrentSession();

    if (!session?.user) {
        redirect("/login");
    }

    const instansi = await getApprovedInstansi(session.user.email);

    if (!instansi) {
        redirect("/dashboard");
    }

    const pesertaResult = await getPesertaByInstansi(instansi.id, 1, 50);
    const pesertaList = pesertaResult.success ? pesertaResult.data : [];

    return (
        <PesertaView 
            instansiId={instansi.id}
            instansiNama={instansi.nama}
            pesertaList={pesertaList ?? []}
        />
    );
}
