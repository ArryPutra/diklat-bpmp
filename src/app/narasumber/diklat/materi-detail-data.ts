import { getCurrentNarasumber } from "@/actions/narasumber-action";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";

export async function getNarasumberMateriDetailData(materiDiklatId: number) {
    const currentNarasumber = await getCurrentNarasumber()

    const materiDiklat = await prisma.materiDiklat.findFirst({
        where: {
            id: materiDiklatId,
            narasumberId: currentNarasumber?.id
        },
        include: {
            diklat: {
                include: {
                    pesertaDiklat: {
                        where: {
                            statusDaftarPesertaDiklatId: 2,
                        },
                        select: {
                            id: true,
                            absensiPesertaDiklat: {
                                where: {
                                    materiDiklatId,
                                },
                            },
                            peserta: {
                                select: {
                                    instansi: {
                                        select: {
                                            user: {
                                                select: {
                                                    name: true
                                                }
                                            }
                                        }
                                    },
                                    user: {
                                        select: {
                                            name: true
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    })

    if (!materiDiklat) {
        notFound()
    }

    const statusAbsensiPesertaDiklat = await prisma.statusAbsensiPesertaDiklat.findMany({
        orderBy: {
            id: 'asc'
        },
        select: {
            id: true,
            nama: true,
        }
    })

    const totalAbsensiStatus = await prisma.absensiPesertaDiklat.groupBy({
        where: {
            materiDiklatId,
        },
        by: ["statusAbsensiId"],
        _count: {
            _all: true,
        }
    })

    return {
        materiDiklat,
        statusAbsensiPesertaDiklat,
        totalAbsensiStatus,
    }
}
