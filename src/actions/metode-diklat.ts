"use server"

import prisma from "@/lib/prisma"

export async function getAllMetodeDiklatAction() {
    const metodeDiklat = await prisma.metodeDiklat.findMany()

    return metodeDiklat
}
