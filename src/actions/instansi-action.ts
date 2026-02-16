"use server"

import { Prisma } from "@/generated/prisma/client";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { UpdateInstansiSchema } from "@/schemas/instansi.schema";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { getCurrentUser } from "./auth-action";

export async function getAllInstansiAction({
    search = "",
    page = "1",
    banned = "false",
    extraWhere = {}
}: {
    search?: string
    page?: string
    banned?: string
    extraWhere?: Prisma.InstansiWhereInput
}) {
    const _search = search.trim();

    const where: Prisma.InstansiWhereInput = {
        user: {
            banned: banned === "true",
            OR: [
                {
                    name: {
                        contains: _search,
                        mode: "insensitive"
                    }
                },
                {
                    email: {
                        contains: _search,
                        mode: "insensitive"
                    },
                }
            ]
        },
        ...extraWhere
    }

    const data = await prisma.instansi.findMany({
        skip: parseInt(page) * 10 - 10,
        take: 10,
        where,
        include: {
            user: true,
            picInstansi: true,
            registrasiInstansi: true
        },
        orderBy: {
            createdAt: "desc"
        }
    });

    const total = await prisma.instansi.count({ where });

    return {
        data: data,
        total: total,
    };
}

export async function getInstansiAction(instansiId: number) {
    const instansi = await prisma.instansi.findUnique({
        where: { id: instansiId },
        include: {
            user: true,
            picInstansi: true,
            registrasiInstansi: true
        }
    })

    return instansi
}

export async function updateInstansiAction(
    instansiId: number,
    prevState: any,
    formData: FormData
) {
    const resultData = UpdateInstansiSchema.safeParse(Object.fromEntries(formData));

    if (!resultData.success) {
        return {
            success: false,
            errors: resultData.error.flatten().fieldErrors,
            values: Object.fromEntries(formData)
        }
    }

    const instansi = await getInstansiAction(instansiId)
    const user = await prisma.user.findUniqueOrThrow({ where: { id: instansi?.userId } })

    try {
        const result = await auth.api.setUserPassword({
            body: {
                userId: user.id,
                newPassword: resultData.data.password!,
            },
            headers: await headers()
        })
    } catch (error) {
        console.error(error)

        return {
            success: false,
            values: Object.fromEntries(formData)
        }
    }

    (await cookies()).set("flash", `Data instansi ${instansi?.user.name} berhasil diperbarui.`, {
        path: "/admin/kelola-instansi",
        maxAge: 10
    })

    redirect("/admin/kelola-instansi")
}

export async function getCurrentInstansi() {
    const currentUser = await getCurrentUser()

    const currentInstansi = await prisma.instansi.findUnique({
        where: {
            userId: currentUser?.id
        }
    })

    return currentInstansi
}