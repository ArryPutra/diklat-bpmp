import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export default async function narasumberSeed() {
    const user1 = await auth.api.createUser({
        body: {
            name: "Arry Kusuma Putra",
            email: "arrykusumaputra04@gmail.com",
            password: "password123",
            data: {
                peranId: 4, // narasumber
            }
        }
    })
    await prisma.narasumber.create({
        data: {
            userId: user1.user.id,
            nomorTelepon: "081234567890",
            jenisKelamin: "Pria",
        }
    })

    const user2 = await auth.api.createUser({
        body: {
            name: "Raju Adha Dani",
            email: "rajuadhadani@gmail.com",
            password: "password123",
            data: {
                peranId: 4, // narasumber
            }
        }
    })
    await prisma.narasumber.create({
        data: {
            userId: user2.user.id,
            nomorTelepon: "081234567891",
            jenisKelamin: "Wanita",
        }
    })
}