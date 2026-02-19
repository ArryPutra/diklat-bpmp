"use server"

import prisma from "@/lib/prisma";
import Narasumber_Dashboard_View from "./view";
import { getCurrentNarasumber } from "@/actions/narasumber-action";

export default async function Narasumber_Dashboard_Page() {
    const currentNarasumber = await getCurrentNarasumber()

    // Mendapatkan diklatId unik
    const getDiklatIds = await prisma.materiDiklat.findMany({
        where: {
            narasumberId: currentNarasumber?.id
        },
        select: {
            diklatId: true
        },
        distinct: ['diklatId']
    })

    // Menghitung jumlah diklatId unik
    const totalDiklat = getDiklatIds.length;
    const apakahAdaMateriDiklatAktif = await prisma.materiDiklat.count({
        where: {
            narasumberId: currentNarasumber?.id,
            diklat: {
                statusPendaftaranDiklatId: {
                    in: [1, 2]
                }
            }
        }
    })

    return (
        <Narasumber_Dashboard_View
            dataStatistik={{
                totalDiklat: totalDiklat
            }}
            apakahAdaMateriDiklatAktif={
                apakahAdaMateriDiklatAktif
            } />
    )
}
