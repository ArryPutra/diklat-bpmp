"use server"

import prisma from "@/lib/prisma";
import Narasumber_Dashboard_View from "./view";

export default async function Narasumber_Dashboard_Page() {

    // Mendapatkan diklatId unik
    const getDiklatIds = await prisma.materiDiklat.findMany({
        where: {
            narasumberId: 1
        },
        select: {
            diklatId: true
        },
        distinct: ['diklatId']
    })

    // Menghitung jumlah diklatId unik
    const totalDiklat = getDiklatIds.length;

    return (
        <Narasumber_Dashboard_View
            dataStatistik={{
                totalDiklat: totalDiklat
            }} />
    )
}
