import { getDiklatAction } from "@/actions/diklat-action"
import { getAllPesertaDiklatAction } from "@/actions/peserta-diklat-action"
import VerifikasiPesertaDiklatView_PesertaDiklat from "./view"

export const metadata = {
    title: "Verifikasi Peserta Diklat",
}

export default async function VerifikasiPesertaDiklatDetailPage({
    params,
    searchParams
}: {
    params: Promise<{
        diklatId: string
    }>
    searchParams: Promise<{
        search?: string
        page?: string
    }>
}) {
    const _params = await params
    const _searchParams = await searchParams

    const daftarPesertaDiklat = await getAllPesertaDiklatAction({
        page: _searchParams.page,
        search: _searchParams.search,
        diklatId: _params.diklatId
    })
    const diklat = await getDiklatAction(_params.diklatId)

    return (
        <VerifikasiPesertaDiklatView_PesertaDiklat
            diklat={diklat}
            daftarPesertaDiklat={daftarPesertaDiklat.data}
            totalPesertaDiklat={daftarPesertaDiklat.total}
        />
    )
}
