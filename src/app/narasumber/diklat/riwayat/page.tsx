"use server"

import ListDiklatNarasumberCard from '../components/list-diklat-narasumber-card'
import { getDaftarDiklatNarasumber } from '../data'

export default async function Narasumber_RiwayatDiklat_Page() {
  const daftarDiklatRiwayatSaya = await getDaftarDiklatNarasumber([3])

  return (
    <ListDiklatNarasumberCard
      daftarDiklatSaya={daftarDiklatRiwayatSaya}
      title="Riwayat Diklat Saya"
      description="Berikut adalah daftar diklat yang sudah selesai dan pernah Anda ikuti sebagai narasumber."
      emptyTitle="Tidak Ada Riwayat Diklat"
      emptyDescription="Anda belum mengikuti diklat apapun."
      detailBasePath="/narasumber/diklat/riwayat"
    />
  )
}
