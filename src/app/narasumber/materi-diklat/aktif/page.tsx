"use server"

import { getCurrentNarasumber } from "@/actions/narasumber-action";
import prisma from "@/lib/prisma";
import Narasumber_DiklatSaya_View from "./view";

export default async function Narasumber_DiklatSaya_Page() {
  const currentNarasumber = await getCurrentNarasumber()

  const daftarDiklatAktifSaya = await prisma.diklat.findMany({
    where: {
      statusPelaksanaanAcaraDiklatId: {
        in: [1, 2] // Belum Dimulai, Sedang Berlangsung
      },
      materiDiklat: {
        some: {
          narasumberId: currentNarasumber?.id,
        }
      },
    },
    include: {
      materiDiklat: {
        where: {
          narasumberId: currentNarasumber?.id,
        },
        orderBy: [
          {
            tanggalPelaksanaan: "asc"
          },
          {
            waktuMulai: "asc"
          }
        ]
      },
      metodeDiklat: true,
      statusPendaftaranDiklat: true,
      statusPelaksanaanAcaraDiklat: true,
    }
  })

  return (
    <Narasumber_DiklatSaya_View
      daftarDiklatAktifSaya={daftarDiklatAktifSaya} />
  )
}
