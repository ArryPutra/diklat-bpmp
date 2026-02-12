import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import diklatSeed from "./seeds/diklat.seed";
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

    await prisma.statusPendaftarPesertaDiklat.createMany({
        data: [
            { nama: "Menunggu Persetujuan" }, // menunggu persetujuan dari admin
            { nama: "Terdaftar" }, // peserta sudah terdaftar di diklat
            { nama: "Dalam Pelatihan" }, // peserta sedang dalam pelatihan
            { nama: "Selesai" }, // peserta sudah selesai pelatihan
            { nama: "Lulus" }, // peserta sudah lulus pelatihan
            { nama: "Tidak Lulus" }, // peserta tidak lulus pelatihan
            { nama: "Ditolak" }, // peserta ditolak oleh admin
            { nama: "Batal" }, // peserta batal mendaftar diklat
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
    await diklatSeed()
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