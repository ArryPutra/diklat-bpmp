"use server"

import NarasumberDiklatContent from "../components/narasumber-diklat-content";
import { getDaftarDiklatNarasumber } from "../data";

export default async function Narasumber_DiklatSaya_Page() {
  const daftarDiklatAktifSaya = await getDaftarDiklatNarasumber([1, 2])

  return (
    <NarasumberDiklatContent
      daftarDiklatSaya={daftarDiklatAktifSaya}
      title='Daftar Diklat Diajarkan'
      description='Anda telah didaftarkan oleh Admin untuk mengajarkan pada diklat ini.'
      emptyTitle='Belum ada materi diklat aktif yang Anda ajarkan.'
      emptyDescription='Materi diklat aktif adalah materi diklat yang tanggal pelaksanaannya hari ini atau di masa depan.'
      detailBasePath='/narasumber/diklat/aktif'
    />
  )
}
