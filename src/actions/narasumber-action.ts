"use server";

import { Prisma } from "@/generated/prisma/client";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { CreateNarasumberSchema, UpdateNarasumberSchema } from "@/schemas/narasumber.schema";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { getCurrentUser } from "./auth-action";


export async function getAllNarasumberAction({
    search = "",
    page = "1",
    extraWhere = {}
}: {
    search?: string
    page?: string
    extraWhere?: Prisma.NarasumberWhereInput
}) {
    const _search = search.trim();

    const where: Prisma.NarasumberWhereInput = {
        user: {
            banned: false,
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

    const data = await prisma.narasumber.findMany({
        skip: parseInt(page) * 10 - 10,
        take: 10,
        where,
        include: {
            user: true,
        },
        orderBy: {
            createdAt: "desc"
        }
    });

    const total = await prisma.narasumber.count({ where });

    return {
        data: data,
        total: total,
    };
}

export async function getNarasumberAction(narasumberId: number) {
    const data = await prisma.narasumber.findUnique({
        where: {
            id: narasumberId,
        },
        include: {
            user: true,
        }
    });

    return data;
}

export async function createNarasumberAction(prevState: any, formData: FormData) {
    const values = Object.fromEntries(formData)
    const resultData = CreateNarasumberSchema.safeParse(values);

    if (!resultData.success) {
        return {
            success: false,
            errors: resultData.error.flatten().fieldErrors,
            values: values,
        }
    }

    const data = resultData.data;

    let user

    try {
        const createUser = await auth.api.createUser({
            body: {
                name: data.nama,
                email: data.email,
                password: data.password,
                data: {
                    peranId: 4 // narasumber
                },
            },
            headers: await headers()
        })

        user = createUser.user

        await prisma.narasumber.create({
            data: {
                userId: user.id,
                nomorTelepon: data.nomorTelepon,
                jenisKelamin: data.jenisKelamin,
            }
        })

    } catch (error) {
        console.error(error);

        if (user) {
            await auth.api.removeUser({
                body: {
                    userId: user.id
                },
                headers: await headers()
            });
        }

        let errorMessage = "Terjadi kesalahan saat membuat narasumber."

        if (error instanceof Error) {
            errorMessage = error.message
        }

        return {
            success: false,
            message: errorMessage,
            values: values,
        }
    }

    (await cookies()).set(
        "flash",
        `Narasumber dengan nama "${data.nama}" berhasil ditambahkan.`,
        {
            path: "/admin/kelola-narasumber",
            maxAge: 10
        }
    )

    redirect('/admin/kelola-narasumber');
}

export async function updateNarasumberAction(
    narasumberId: number,
    prevState: any,
    formData: FormData
) {
    const values = Object.fromEntries(formData);
    const resultData = UpdateNarasumberSchema.safeParse(values);

    if (!resultData.success) {
        return {
            success: false,
            errors: resultData.error.flatten().fieldErrors,
            values: values,
        }
    }

    const narasumber = await getNarasumberAction(narasumberId);
    const user = await prisma.user.findUniqueOrThrow({ where: { id: narasumber?.user.id } });

    try {
        // Update user data (name and email)
        await auth.api.adminUpdateUser({

            body: {
                userId: user.id,
                data: {
                    name: resultData.data.nama,
                    email: resultData.data.email,
                },
            },
            headers: await headers()
        });

        // Update password if provided
        if (resultData.data.password) {
            await auth.api.setUserPassword({
                body: {
                    userId: user.id,
                    newPassword: resultData.data.password,
                },
                headers: await headers()
            });
        }

        // Update narasumber-specific data
        await prisma.narasumber.update({
            where: { id: narasumberId },
            data: {
                nomorTelepon: resultData.data.nomorTelepon,
                jenisKelamin: resultData.data.jenisKelamin,
            }
        });

    } catch (error) {
        console.error(error);

        let errorMessage = "Terjadi kesalahan saat memperbarui narasumber."

        if (error instanceof Error) {
            errorMessage = error.message
        }

        return {
            success: false,
            message: errorMessage,
            values: values,
        }
    }

    (await cookies()).set(
        "flash",
        `Narasumber dengan nama "${resultData.data.nama}" berhasil diperbarui.`,
        {
            path: "/admin/kelola-narasumber",
            maxAge: 10
        }
    );

    redirect('/admin/kelola-narasumber');
}

export async function getCurrentNarasumber() {
    const currentUser = await getCurrentUser()

    const currentNarasumber = await prisma.narasumber.findUnique({
        where: {
            userId: currentUser?.id
        }
    })

    return currentNarasumber
}