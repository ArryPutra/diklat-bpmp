"use server"

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateStatusApakahNonaktifAction(prevState: any, formData: FormData) {
    const userId = formData.get("userId") as string
    const apakahNonaktif = formData.get("apakahNonaktif") as string
    const currentPath = formData.get("currentPath") as string

    try {
        const userInstansiUpdate = await prisma.user.update({
            where: { id: userId },
            data: { apakahNonaktif: apakahNonaktif === "true" }
        });

        revalidatePath(currentPath);

        return { success: true, message: `Pengguna ${userInstansiUpdate.name} berhasil ${apakahNonaktif === "true" ? "nonaktifkan" : "aktifkan"}` }
    } catch (error) {
        console.log(error)

        return { success: false, message: "Terjadi kesalahan" }
    }
}