import { getCurrentSession, getApprovedInstansi } from "@/actions/auth-action";
import { redirect } from "next/navigation";
import { getDiklatForInstansi } from "@/actions/instansi-action";
import DiklatListView from "./view";

export default async function DiklatListPage() {
    const session = await getCurrentSession();

    if (!session?.user) {
        redirect("/login");
    }

    const instansi = await getApprovedInstansi(session.user.email);

    if (!instansi) {
        redirect("/dashboard");
    }

    const diklatResult = await getDiklatForInstansi(1, 20);
    const diklatList = diklatResult.success ? diklatResult.data : [];

    return (
        <DiklatListView 
            instansiId={instansi.id}
            instansiNama={instansi.nama}
            diklatList={diklatList ?? []}
        />
    );
}
