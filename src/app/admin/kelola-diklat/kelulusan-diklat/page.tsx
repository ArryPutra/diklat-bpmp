"use server"

import prisma from "@/lib/prisma"
import Admin_VerifKelulusan_View from "./view"

export default async function Admin_VerifKelulusan_Page({
    searchParams
}: {
    searchParams: Promise<{
        kelulusanDiklat?: string
    }>
}) {

    const _searchParams = await searchParams
    const whereKelulusanDiklat = _searchParams.kelulusanDiklat === "sudahValidasi"
        ? {
            AND: [
                {
                    materiDiklat: {
                        some: {}
                    }
                },
                {
                    materiDiklat: {
                        every: {
                            isSelesai: true
                        }
                    }
                },
                {
                    pesertaDiklat: {
                        some: {
                            statusDaftarPesertaDiklatId: 2
                        }
                    }
                },
                {
                    pesertaDiklat: {
                        none: {
                            statusDaftarPesertaDiklatId: 2,
                            statusKelulusanPesertaDiklatId: 1
                        }
                    }
                }
            ]
        }
        : {
            AND: [
                {
                    materiDiklat: {
                        some: {}
                    }
                },
                {
                    materiDiklat: {
                        every: {
                            isSelesai: true
                        }
                    }
                },
                {
                    pesertaDiklat: {
                        some: {
                            statusDaftarPesertaDiklatId: 2,
                            statusKelulusanPesertaDiklatId: 1
                        }
                    }
                }
            ]
        }

    const daftarDiklatSelesai = await prisma.diklat.findMany({
        include: {
            _count: {
                select: {
                    pesertaDiklat: {
                        where: {
                            statusDaftarPesertaDiklatId: 2
                        }
                    }
                }
            }
        },
        where: whereKelulusanDiklat
    })

    return (
        <Admin_VerifKelulusan_View
            daftarDiklatSelesai={daftarDiklatSelesai} />
    )
}
