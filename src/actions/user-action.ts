"use server"

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function nonaktifkanUserAction(prevState: any, formData: FormData) {
    const userId = formData.get("userId") as string
    const currentPath = formData.get("currentPath") as string

    try {
        const userInstansiUpdate =
            await prisma.user.update({ where: { id: userId }, data: { apakahNonaktif: true } });

        revalidatePath(currentPath);

        return { success: true, message: `Pengguna ${userInstansiUpdate.name} berhasil dinonaktifkan` }
    } catch (error) {
        console.log(error)

        return { success: false, message: "Terjadi kesalahan" }
    }
}

export async function aktifkanUserAction(prevState: any, formData: FormData) {
    const userId = formData.get("userId") as string
    const currentPath = formData.get("currentPath") as string

    try {
        const userInstansiUpdate
            = await prisma.user.update({ where: { id: userId }, data: { apakahNonaktif: false } });

        revalidatePath(currentPath);

        return { success: true, message: `Pengguna ${userInstansiUpdate.name} berhasil diaktifkan` }
    } catch (error) {
        console.log(error)

        return { success: false, message: "Terjadi kesalahan" }
    }
}