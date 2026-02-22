"use server"

import NarasumberDiklatContent from '../components/narasumber-diklat-content'
import { getDaftarDiklatNarasumber } from '../data'

export default async function Narasumber_RiwayatDiklat_Page() {
  const daftarDiklatRiwayatSaya = await getDaftarDiklatNarasumber([3])

  return (
    <NarasumberDiklatContent
      daftarDiklatSaya={daftarDiklatRiwayatSaya}
      title='Riwayat Diklat Diajarkan'
      description='Daftar diklat yang pernah Anda ajarkan dan telah selesai.'
      emptyTitle='Belum ada riwayat diklat yang Anda ajarkan.'
      emptyDescription='Riwayat akan muncul saat diklat yang Anda ajarkan sudah selesai.'
      detailBasePath='/narasumber/diklat/riwayat'
    />
  )
}
