"use server"

import { getCurrentInstansi } from "@/actions/instansi-action";
import prisma from "@/lib/prisma";
import Instansi_DiklatPeserta_View from "./view";

export default async function InstansiDiklatPesertaPage() {


    const currentInstansi = await getCurrentInstansi()

    const daftarDiklatDiikuti = await prisma.diklat.findMany({
        where: {
            pesertaDiklat: {
                some: {
                    peserta: {
                        instansiId: currentInstansi!.id
                    }
                }
            }
        },
        include: {
            statusPendaftaranDiklat: true,
            pesertaDiklat: {
                where: {
                    peserta: {
                        instansiId: currentInstansi!.id
                    }
                }
            }
        }
    })

    return (
        <Instansi_DiklatPeserta_View
            daftarDiklatDiikuti={daftarDiklatDiikuti} />
    )
}
