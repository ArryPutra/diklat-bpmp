import { redirect } from "next/navigation"

export default async function Peserta_DiklatRiwayatDetail_Page({
    params
}: {
    params: Promise<{ diklatId: string }>
}) {
    const { diklatId } = await params

    redirect(`/peserta/diklat/riwayat/${diklatId}/hasil-akhir`)
}
