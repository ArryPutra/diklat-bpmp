"use server"

import { getCurrentInstansi } from "@/actions/instansi-action";
import { getAllPesertaDiklatAction } from "@/actions/peserta-diklat-action";
import prisma from "@/lib/prisma";
import Instansi_DiklatPesertaDetail_View from "./view";

export default async function Instansi_DiklatPesertaDetail_Page({
    params
}: {
    params: Promise<
        { diklatId: string }
    >
}) {

    const _params = await params

    const currentInstansi = await getCurrentInstansi()

    const getAllPesertaDiklat = await getAllPesertaDiklatAction({
        diklatId: _params.diklatId,
        extraWhere: {
            peserta: {
                instansi: {
                    id: currentInstansi?.id
                }
            }
        }
    })

    return (
        <Instansi_DiklatPesertaDetail_View
            diklat={await prisma.diklat.findUnique({
                where: {
                    id: _params.diklatId
                },
                include: {
                    metodeDiklat: true,
                    statusPelaksanaanAcaraDiklat: true
                }
            })}
            daftarPeserta={{
                data: getAllPesertaDiklat.data,
                total: getAllPesertaDiklat.total
            }}
        />
    )
}
