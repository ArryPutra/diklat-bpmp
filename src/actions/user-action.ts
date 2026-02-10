"use server"

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getCurrentUser } from "./auth-action";

export async function updateStatusBannedAction(prevState: any, formData: FormData) {
    const userId = formData.get("userId") as string
    const banned = formData.get("banned") as string
    const currentPath = formData.get("currentPath") as string

    const currentUser = await getCurrentUser()

    if (currentUser?.peranId === 1) {
        try {
            const userInstansiUpdate = await prisma.user.update({
                where: { id: userId },
                data: { banned: banned === "true" }
            });

            revalidatePath(currentPath);

            return { success: true, message: `Pengguna ${userInstansiUpdate.name} berhasil ${banned === "true" ? "nonaktifkan" : "aktifkan"}` }
        } catch (error) {
            console.log(error)

            return { success: false, message: "Terjadi kesalahan" }
        }
    }

    if (currentUser?.peranId === 2) {
        try {
            const userPesertaUpdate = await prisma.user.update({
                where: {
                    id: userId,
                    peranId: 3 // memastikan hanya peserta yang dipilih
                },
                data: {
                    banned: banned === "true"
                }
            })

            revalidatePath(currentPath);

            return { success: true, message: `Pengguna ${userPesertaUpdate.name} berhasil ${banned === "true" ? "nonaktifkan" : "aktifkan"}` }
        } catch (error) {

        }
    }
}