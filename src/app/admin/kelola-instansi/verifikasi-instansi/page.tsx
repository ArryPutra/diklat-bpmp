"use server"

import { getAllRegistrasiInstansiAction } from "@/actions/registrasi-instansi-action";
import Admin_VerifikasiInstansi_View from "./view";

export default async function Admin_VerifikasiInstansi_Page({
    searchParams
}: {
    searchParams: {
        search?: string
        page?: string
        status?: string
    }
}) {

    const _searchParams = await searchParams;

    const daftarRegistrasiInstansi =
        await getAllRegistrasiInstansiAction({
            page: _searchParams.page,
            search: _searchParams.search,
            statusRegistrasiInstansiId: Number(_searchParams.status ?? "1"),
        });

    return (
        <Admin_VerifikasiInstansi_View
            daftarRegistrasiInstansi={daftarRegistrasiInstansi.data}
            totalRegistrasiInstansi={daftarRegistrasiInstansi.total} />
    )
}
