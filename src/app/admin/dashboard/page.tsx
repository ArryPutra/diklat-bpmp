"use server"

import prisma from "@/lib/prisma";
import Admin_Dashboard_View from "./view";

export default async function AdminDashboardPage() {

    const dataStatistik = {
        totalDiklat: await prisma.diklat.count(),
        totalInstansi: await prisma.instansi.count(),
        totalPeserta: await prisma.peserta.count(),
        totalNarasumber: await prisma.narasumber.count(),
    }

    const totalVerifikasiInstansi = await prisma.registrasiInstansi.count({
        where: {
            statusRegistrasiInstansiId: 1
        }
    })
    const totalVerifikasiPesertaDiklat = await prisma.pesertaDiklat.count({
        where: {
            statusDaftarPesertaDiklatId: 1
        }
    })

    // const totalVerifikasiKelulusanDiklat = await getTotalDiklatButuhVerifikasiKelulusanAction()
    const totalVerifikasiKelulusanDiklat = await prisma.diklat.count({
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
                    kelulusanPesertaDiklat: {
                        every: {
                            NOT: {
                                id: {
                                    in: [2, 3]
                                }
                            }
                        }
                    }
                }
            }
        }
    })

    return (
        <Admin_Dashboard_View
            dataStatistik={dataStatistik}
            totalVerifikasiInstansi={totalVerifikasiInstansi}
            totalVerifikasiPesertaDiklat={totalVerifikasiPesertaDiklat}
            totalVerifikasiKelulusanDiklat={totalVerifikasiKelulusanDiklat} />
    )
}
