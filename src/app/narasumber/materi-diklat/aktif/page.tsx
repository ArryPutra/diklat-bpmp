"use server"

import { getCurrentNarasumber } from "@/actions/narasumber-action";
import prisma from "@/lib/prisma";
import Narasumber_DiklatSaya_View from "./view";

export default async function Narasumber_DiklatSaya_Page() {
  const currentNarasumber = await getCurrentNarasumber()

  const daftarDiklatAktifSaya = await prisma.diklat.findMany({
    where: {
      materiDiklat: {
        some: {
          narasumberId: currentNarasumber?.id,
        }
      }
    },
    include: {
      materiDiklat: true,
      metodeDiklat: true
    }
  })


  return (
    <Narasumber_DiklatSaya_View
      daftarDiklatAktifSaya={daftarDiklatAktifSaya} />
  )
}
