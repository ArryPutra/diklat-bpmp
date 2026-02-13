"use server"

import { getAllDiklatAction, getDiklatAction } from "@/actions/diklat-action"
import { getAllPesertaDiklatAction } from "@/actions/peserta-diklat-action"
import VerifikasiPesertaDiklatView_Diklat from "./view-diklat"
import VerifikasiPesertaDiklatView_PesertaDiklat from "./view-peserta-diklat"

export default async function VerifikasiPesertaDiklatServer({
  searchQuery
}: {
  searchQuery: {
    search?: string
    page?: string
    diklatId?: string
  }
}) {

  if (!searchQuery.diklatId) {
    const daftarDiklatStatusDibuka = await getAllDiklatAction({
      page: searchQuery.page,
      search: searchQuery.search,
      statusPendaftaranDiklatId: [2]
    })

    return (
      <VerifikasiPesertaDiklatView_Diklat
        daftarDiklatStatusDibuka={daftarDiklatStatusDibuka.data}
        totalDaftarDiklat={daftarDiklatStatusDibuka.total} />
    )
  } else {
    const daftarPesertaDiklat = await getAllPesertaDiklatAction({
      page: searchQuery.page,
      search: searchQuery.search,
      diklatId: searchQuery.diklatId
    })
    const diklat = await getDiklatAction(searchQuery.diklatId)

    return (
      <VerifikasiPesertaDiklatView_PesertaDiklat
        diklat={diklat}
        daftarPesertaDiklat={daftarPesertaDiklat.data}
        totalPesertaDiklat={daftarPesertaDiklat.total}
      />
    )
  }
}
