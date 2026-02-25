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
        where: {
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
                }
            ],
            pesertaDiklat: {
                every: {
                    statusKelulusanPesertaDiklatId: {
                        in: _searchParams.kelulusanDiklat === "sudahValidasi" ? [2, 3] : [1]
                    }
                }
            }
        }
    })

    return (
        <Admin_VerifKelulusan_View
            daftarDiklatSelesai={daftarDiklatSelesai} />
    )
}
