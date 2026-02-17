"use server"

import { getAllPesertaDiklatAction } from "@/actions/peserta-diklat-action";
import Instansi_DiklatPesertaDetail_View from "./view";
import { getCurrentInstansi } from "@/actions/instansi-action";

export default async function Instansi_DiklatPesertaDetail_Page({
    params
}: {
    params: { diklatId: string }
}) {
    const currentInstansi = await getCurrentInstansi()

    const getAllPesertaDiklat = await getAllPesertaDiklatAction({
        diklatId: params.diklatId,
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
            daftarPeserta={{
                data: getAllPesertaDiklat.data,
                total: getAllPesertaDiklat.total
            }}
        />
    )
}
