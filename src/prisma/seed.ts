import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import diklatSeed from "./seeds/diklat.seed";
import instansiSeed from "./seeds/instansi.seed";
import narasumberSeed from "./seeds/narasumber.seed";
import registrasiInstansiSeed from "./seeds/registrasi-instansi.seed";

async function main() {
    await prisma.peran.createMany({
        data: [
            { nama: "Admin" },
            { nama: "Instansi" },
            { nama: "Peserta" },
            { nama: "Narasumber" },
        ]
    })

    await prisma.statusRegistrasiInstansi.createMany({
        data: [
            { nama: "Diajukan", backgroundColor: "bg-yellow-500 " },
            { nama: "Diterima", backgroundColor: "bg-blue-500 " },
            { nama: "Ditolak", backgroundColor: "bg-red-500 " },
        ]
    })

    await prisma.metodeDiklat.createMany({
        data: [
            { nama: "Offline/Luar Jaringan", backgroundColor: "bg-blue-500 " },
            { nama: "Online/Dalam Jaringan", backgroundColor: "bg-green-500 " },
            { nama: "Hybrid", backgroundColor: "bg-purple-500 " },
        ]
    })

    await prisma.statusPendaftaranDiklat.createMany({
        data: [
            { nama: "Dijadwalkan", backgroundColor: "bg-blue-500 " },
            { nama: "Dibuka", backgroundColor: "bg-green-500 " },
            { nama: "Ditutup", backgroundColor: "bg-red-500 " },
        ]
    })

    await prisma.statusPelaksanaanAcaraDiklat.createMany({
        data: [
            { nama: "Belum Dimulai", backgroundColor: "bg-yellow-500 " },
            { nama: "Sedang Berlangsung", backgroundColor: "bg-green-500 " },
            { nama: "Selesai", backgroundColor: "bg-gray-500 " },
        ]
    })

    await prisma.statusDaftarPesertaDiklat.createMany({
        data: [
            { nama: "Menunggu Persetujuan" }, // menunggu persetujuan dari admin
            { nama: "Diterima" }, // peserta sudah terdaftar di diklat
            { nama: "Ditolak" }, // peserta ditolak oleh admin\
            { nama: "Mengundurkan Diri" },
        ]
    })

    await prisma.statusPelaksanaanPesertaDiklat.createMany({
        data: [
            { nama: "Sedang Berlangsung" },
            { nama: "Mengundurkan Diri" },
            { nama: "Diskualifikasi" }
        ]
    })

    await prisma.statusKelulusanPesertaDiklat.createMany({
        data: [
            { nama: "Belum Dinilai" },
            { nama: "Lulus" },
            { nama: "Tidak Lulus" },
        ]
    })

    await prisma.statusAbsensiPesertaDiklat.createMany({
        data: [
            { nama: "Hadir" },
            { nama: "Tidak Hadir" },
            { nama: "Izin" },
            { nama: "Sakit" },
        ]
    })

    await auth.api.createUser({
        body: {
            name: "Admin BPMP",
            email: "admin@gmail.com",
            password: "password123",
            role: "admin",
            data: {
                peranId: 1,
            }
        }
    })

    await registrasiInstansiSeed()
    await instansiSeed()
    await diklatSeed()
    await narasumberSeed()
    // await materiDiklatSeed()
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })