import { getCurrentPeserta } from "@/actions/peserta-action"
import prisma from "@/lib/prisma"
import Peserta_DiklatRiwayat_View from "./view"

export default async function Peserta_DiklatRiwayat_Page() {
    const currentPeserta = await getCurrentPeserta()

    const daftarDiklatRiwayatDiikuti = currentPeserta
        ? await prisma.diklat.findMany({
            where: {
                statusPelaksanaanAcaraDiklatId: 3,
                pesertaDiklat: {
                    some: {
                        pesertaId: currentPeserta.id,
                        statusDaftarPesertaDiklatId: 2
                    }
                }
            },
            include: {
                metodeDiklat: true,
                statusPelaksanaanAcaraDiklat: true
            },
            orderBy: {
                tanggalSelesaiAcara: "desc"
            }
        })
        : []

    return (
        <Peserta_DiklatRiwayat_View daftarDiklatRiwayatDiikuti={daftarDiklatRiwayatDiikuti} />
    )
}
