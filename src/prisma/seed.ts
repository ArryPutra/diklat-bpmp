import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

async function main() {
    await prisma.statusRegistrasiInstansi.createMany({
        data: [
            { nama: "Menunggu" },
            { nama: "Ditinjau" },
            { nama: "Diterima" },
            { nama: "Ditolak" },
        ]
    })

    await auth.api.signUpEmail({
        body: {
            name: "Admin",
            email: "admin@gmail.com",
            password: "password123",
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