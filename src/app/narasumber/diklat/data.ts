import { getCurrentNarasumber } from "@/actions/narasumber-action";
import prisma from "@/lib/prisma";

export async function getDaftarDiklatNarasumber(
    statusPelaksanaanAcaraDiklatId: number[]
) {
    const currentNarasumber = await getCurrentNarasumber()

    if (!currentNarasumber) {
        return []
    }

    return prisma.diklat.findMany({
        where: {
            statusPelaksanaanAcaraDiklatId: {
                in: statusPelaksanaanAcaraDiklatId
            },
            materiDiklat: {
                some: {
                    narasumberId: currentNarasumber.id,
                }
            },
        },
        include: {
            materiDiklat: {
                where: {
                    narasumberId: currentNarasumber.id,
                },
                orderBy: [
                    {
                        tanggalPelaksanaan: "asc"
                    },
                    {
                        waktuMulai: "asc"
                    }
                ],
                include: {
                    _count: {
                        select: {
                            absensiPesertaDiklat: true
                        }
                    }
                }
            },
            _count: {
                select: {
                    pesertaDiklat: true
                }
            },
            metodeDiklat: true,
            statusPendaftaranDiklat: true,
            statusPelaksanaanAcaraDiklat: true,
        },
        orderBy: statusPelaksanaanAcaraDiklatId.includes(3)
            ? {
                tanggalSelesaiAcara: "desc"
            }
            : {
                tanggalMulaiAcara: "asc"
            }
    })
}
