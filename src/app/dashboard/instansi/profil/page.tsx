import { getCurrentSession, getApprovedInstansi } from "@/actions/auth-action";
import { redirect } from "next/navigation";
import ProfilView from "./view";

export default async function ProfilPage() {
    const session = await getCurrentSession();

    if (!session?.user) {
        redirect("/login");
    }

    const instansi = await getApprovedInstansi(session.user.email);

    if (!instansi) {
        redirect("/dashboard");
    }

    return (
        <ProfilView 
            instansi={instansi}
        />
    );
}
