import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

async function main() {
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

    await prisma.peran.createMany({
        data: [
            { nama: "Admin" },
            { nama: "Instansi" },
            { nama: "Peserta" },
            { nama: "Narasumber" },
        ]
    })

    await auth.api.signUpEmail({
        body: {
            name: "Admin BPMP",
            email: "admin@gmail.com",
            password: "password123",
            peranId: 1
        }
    });

    // await registrasiInstansiSeed()
    // await diklatSeed()
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