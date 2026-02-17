"use server"

import { getAllDiklatAction } from "@/actions/diklat-action";
import { getCurrentInstansi } from "@/actions/instansi-action";
import Instansi_Dashboard_View from "./view";
import prisma from "@/lib/prisma";

export default async function Instansi_Dashboard_Page() {
    return (
        <Instansi_Dashboard_View
        dataStatistik={{ 
            totalPeserta: await prisma.peserta.count({
                where: {
                    instansiId: (await getCurrentInstansi())?.id
                }
            })
         }}/>
    )
}
