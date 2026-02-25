"use server"

import prisma from "@/lib/prisma"
import { notFound } from "next/navigation"
import AdminSelesaikanDiklatView from "./view"

export default async function AdminSelesaikanDiklatPage({ params }: { params: Promise<{ diklatId: string }> }) {
    const { diklatId } = await params

    const diklat = await prisma.diklat.findUnique({
        where: {
            id: diklatId
        },
        include: {
            statusPelaksanaanAcaraDiklat: true,
            pesertaDiklat: {
                where: {
                    statusDaftarPesertaDiklat: {
                        nama: "Diterima"
                    }
                },
                include: {
                    statusKelulusanPesertaDiklat: {
                        select: {
                            nama: true
                        }
                    },
                    peserta: {
                        include: {
                            user: true,
                            instansi: {
                                include: {
                                    user: true
                                }
                            }
                        }
                    },
                    absensiPesertaDiklat: {
                        include: {
                            materiDiklat: {
                                select: {
                                    id: true,
                                    judul: true
                                }
                            },
                            statusAbsensiPesertaDiklat: {
                                select: {
                                    nama: true
                                }
                            }
                        }
                    }
                }
            },
            materiDiklat: {
                select: {
                    id: true,
                    judul: true
                }
            }
        }
    })

    if (!diklat) {
        notFound()
    }

    const totalSesiMateri = diklat.materiDiklat.length

    const daftarPesertaEvaluasi = diklat.pesertaDiklat.map((pesertaDiklat) => {
        const totalKehadiran = pesertaDiklat.absensiPesertaDiklat.filter((absensi) => absensi.statusAbsensiId === 1).length
        const persenKehadiran = totalSesiMateri > 0 ? Math.round((totalKehadiran / totalSesiMateri) * 100) : 0
        const isLulusByMinimalKehadiran = persenKehadiran >= diklat.minimalKehadiranPersen
        const statusRekomendasiKelulusan: "Lulus" | "Tidak Lulus" = isLulusByMinimalKehadiran ? "Lulus" : "Tidak Lulus"
        const statusAkhirKelulusan: "Lulus" | "Tidak Lulus" | null =
            pesertaDiklat.statusKelulusanPesertaDiklat?.nama === "Lulus" ||
                pesertaDiklat.statusKelulusanPesertaDiklat?.nama === "Tidak Lulus"
                ? pesertaDiklat.statusKelulusanPesertaDiklat.nama
                : null

        const totalStatusAbsensi = {
            hadir: pesertaDiklat.absensiPesertaDiklat.filter((absensi) => absensi.statusAbsensiPesertaDiklat.nama === "Hadir").length,
            tidakHadir: pesertaDiklat.absensiPesertaDiklat.filter((absensi) => absensi.statusAbsensiPesertaDiklat.nama === "Tidak Hadir").length,
            izin: pesertaDiklat.absensiPesertaDiklat.filter((absensi) => absensi.statusAbsensiPesertaDiklat.nama === "Izin").length,
            sakit: pesertaDiklat.absensiPesertaDiklat.filter((absensi) => absensi.statusAbsensiPesertaDiklat.nama === "Sakit").length
        }

        const detailAbsensiPerMateri = diklat.materiDiklat.map((materi) => {
            const absensiMateri = pesertaDiklat.absensiPesertaDiklat.find((absensi) => absensi.materiDiklatId === materi.id)
            const namaStatusAbsensi = absensiMateri?.statusAbsensiPesertaDiklat.nama

            return {
                judulMateri: materi.judul,
                statusAbsensi: namaStatusAbsensi ?? "Belum Diisi"
            }
        })

        return {
            id: pesertaDiklat.id,
            namaPeserta: pesertaDiklat.peserta.user.name,
            namaInstansi: pesertaDiklat.peserta.instansi.user.name,
            totalKehadiran,
            totalSesiMateri,
            persenKehadiran,
            statusRekomendasiKelulusan,
            statusAkhirKelulusan,
            totalStatusAbsensi,
            detailAbsensiPerMateri
        }
    })

    return (
        <AdminSelesaikanDiklatView
            diklat={{
                id: diklat.id,
                judul: diklat.judul,
                minimalKehadiranPersen: diklat.minimalKehadiranPersen,
                statusPelaksanaanAcara: diklat.statusPelaksanaanAcaraDiklat?.nama ?? "-"
            }}
            daftarPesertaEvaluasi={daftarPesertaEvaluasi}
        />
    )
}
