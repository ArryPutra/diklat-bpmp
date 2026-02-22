"use server"

import prisma from "@/lib/prisma"
import Admin_VerifKelulusan_View from "./view"

export default async function Admin_VerifKelulusan_Page() {

    const daftarDiklatSelesaiRaw = await prisma.diklat.findMany({
        where: {
            statusPelaksanaanAcaraDiklatId:{
                in: [2, 3]
            }
        },
        include: {
            materiDiklat: {
                select: {
                    id: true
                }
            },
            pesertaDiklat: {
                where: {
                    statusDaftarPesertaDiklat: {
                        nama: "Diterima"
                    }
                },
                include: {
                    absensiPesertaDiklat: {
                        select: {
                            materiDiklatId: true
                        }
                    }
                }
            }
        }
    })

    const daftarDiklatSelesai = daftarDiklatSelesaiRaw
        .map((diklat) => {
            const totalMateri = diklat.materiDiklat.length
            const totalPesertaDiterima = diklat.pesertaDiklat.length
            const totalAbsensiWajib = totalMateri * totalPesertaDiterima
            const totalAbsensiTerisi = diklat.pesertaDiklat.reduce((jumlah, pesertaDiklat) => {
                return jumlah + pesertaDiklat.absensiPesertaDiklat.length
            }, 0)

            return {
                id: diklat.id,
                judul: diklat.judul,
                tanggalSelesaiAcara: diklat.tanggalSelesaiAcara,
                totalPesertaDiterima,
                totalAbsensiWajib,
                totalAbsensiTerisi,
                isAbsensiLengkap: totalAbsensiWajib > 0 && totalAbsensiTerisi === totalAbsensiWajib
            }
        })
        .filter((diklat) => diklat.isAbsensiLengkap)

    return (
        <Admin_VerifKelulusan_View 
        daftarDiklatSelesai={daftarDiklatSelesai}/>
    )
}
