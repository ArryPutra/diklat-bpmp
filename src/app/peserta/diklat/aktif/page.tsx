import { getCurrentPeserta } from "@/actions/peserta-action"
import prisma from "@/lib/prisma"
import Peserta_DiklatAktif_View from "./view"

export default async function Peserta_DiklatAktif_Page() {
    const currentPeserta = await getCurrentPeserta()

    const daftarDiklatAktifDiikuti = currentPeserta
        ? await prisma.diklat.findMany({
            where: {
                statusPelaksanaanAcaraDiklatId: {
                    in: [1, 2] // BELUM DIMULAI (1) atau SEDANG BERLANGSUNG (2)
                },
                pesertaDiklat: {
                    some: {
                        pesertaId: currentPeserta.id, // Pastikan peserta terdaftar dalam diklat ini
                        statusDaftarPesertaDiklatId: 2 // DITERIMA (2) sebagai peserta
                    }
                },
            },
            include: {
                metodeDiklat: true,
                statusPelaksanaanAcaraDiklat: true
            },
            orderBy: {
                tanggalMulaiAcara: "asc"
            }
        })
        : []

    return (
        <Peserta_DiklatAktif_View
            daftarDiklatAktifDiikuti={daftarDiklatAktifDiikuti} />
    )
}
