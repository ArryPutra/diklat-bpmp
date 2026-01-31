import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

async function main() {
    await prisma.statusRegistrasiInstansi.createMany({
        data: [
            { nama: "Diajukan", warna: "bg-yellow-500 " },
            { nama: "Diterima", warna: "bg-blue-500 " },
            { nama: "Ditolak", warna: "bg-red-500 " },
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