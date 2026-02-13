"use server"

import { getDiklatAction } from "@/actions/diklat-action"
import { getCurrentInstansi } from "@/actions/instansi-action"
import { getAllPesertaDiklatAction } from "@/actions/peserta-diklat-action"
import DaftarDiklatView from "./view-daftar-diklat"
import DaftarPesertaDiklatView from "./view-daftar-peserta-diklat"


export default async function DaftarDiklatDiikutiServer({
  daftarDiklatDiikuti,
  diklatId
}: {
  daftarDiklatDiikuti: any[]
  diklatId?: string
}) {

  if (!diklatId) {

    return (
      <DaftarDiklatView
        daftarDiklatDiikuti={daftarDiklatDiikuti} />
    )

  }

  else {
    const currentInstansi = await getCurrentInstansi();

    if (currentInstansi === null) return ("Data instansi Anda tidak ditemukan, terjadi kesalahan.");

    const diklat = await getDiklatAction(diklatId)
    const daftarPesertaDiklat = await getAllPesertaDiklatAction({
      diklatId: diklatId,
      extraWhere: {
        peserta: {
          // pastikan peserta hanya instansi yang sama
          instansiId: currentInstansi.id
        }
      }
    })

    return (
      <DaftarPesertaDiklatView
        diklat={diklat}
        daftarPeserta={{
          data: daftarPesertaDiklat.data,
          total: daftarPesertaDiklat.total
        }} />
    )

  }
}
