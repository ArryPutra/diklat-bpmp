"use server"

import { Prisma } from "@/generated/prisma/client";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { CreatePesertaSchema, UpdatePesertaSchema } from "@/schemas/peserta.schema";
import { revalidatePath } from "next/cache";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { getCurrentUser } from "./auth-action";

export async function getAllPesertaAction({
    search = "",
    page = "1",
    take = 10,
    banned = "false",
    instansiId
}: {
    search?: string
    page?: string
    take?: number
    banned?: "false" | "true"
    instansiId?: number
}) {
    const _search = search.trim();

    const where: Prisma.PesertaWhereInput = {
        user: {
            OR: [
                {
                    name: {
                        contains: _search,
                        mode: "insensitive"
                    }
                }
            ],
            banned: banned === "true"
        },
        instansiId: instansiId
    }

    const data = await prisma.peserta.findMany({
        skip: parseInt(page) * 10 - 10,
        take: take,
        where,
        include: {
            user: true,
        },
        orderBy: {
            createdAt: "desc",
        },
    });

    const total = await prisma.peserta.count({ where });

    return {
        data: data,
        total: total,
    }
}

export async function createPesertaAction(
    prevState: any,
    formData: FormData
) {
    const values = Object.fromEntries(formData)

    const result = CreatePesertaSchema.safeParse(values)

    if (!result.success) {
        return {
            success: false,
            errors: result.error.flatten().fieldErrors,
            values
        }
    }

    const data = result.data

    try {
        const currentUser = await getCurrentUser()

        if (!currentUser) {
            return {
                success: false,
                message: "Unauthorized"
            }
        }

        const instansi = await prisma.instansi.findUniqueOrThrow({
            where: { userId: currentUser.id },
            select: { id: true }
        })

        // =========================
        // PRE-CHECK DUPLIKASI (UX)
        // =========================
        const duplicate = await prisma.peserta.findFirst({
            where: {
                instansiId: instansi.id,
                OR: [
                    { nik: data.nik },
                    { nomorTelepon: data.nomorTelepon }
                ]
            },
            select: {
                nik: true,
                nomorTelepon: true
            }
        })

        if (duplicate) {
            return {
                success: false,
                values,
                message:
                    duplicate.nik === data.nik
                        ? "NIK peserta sudah terdaftar."
                        : "Nomor telepon peserta sudah terdaftar."
            }
        }

        let userPeserta: any

        // =========================
        // TRANSACTION
        // =========================
        await prisma.$transaction(async (tx) => {
            userPeserta = await auth.api.createUser({
                body: {
                    name: data.nama,
                    email: data.email,
                    password: data.password,
                    data: {
                        peranId: 3
                    }
                }
            })

            await tx.peserta.create({
                data: {
                    userId: userPeserta.user.id,
                    instansiId: instansi.id,
                    nik: data.nik,
                    nomorTelepon: data.nomorTelepon,
                    jabatan: data.jabatan,
                    jenisKelamin: data.jenisKelamin,
                    tanggalLahir: data.tanggalLahir,
                    tempatLahir: data.tempatLahir,
                    alamat: data.alamat
                }
            })
        })

    } catch (error: any) {
        console.error(error)

        // =========================
        // HANDLE UNIQUE DB ERROR
        // =========================
        if (error?.code === "P2002") {
            const target = error?.meta?.target as string[]

            if (target?.includes("nik")) {
                return {
                    success: false,
                    values,
                    message: "NIK peserta sudah terdaftar."
                }
            }

            if (target?.includes("nomorTelepon")) {
                return {
                    success: false,
                    values,
                    message: "Nomor telepon peserta sudah terdaftar."
                }
            }
        }

        // auth error
        if (error?.statusCode === 400) {
            return {
                success: false,
                values,
                message:
                    "Email sudah terdaftar di akun lain, silakan gunakan email berbeda."
            }
        }

        return {
            success: false,
            values,
            message: "Terjadi kesalahan saat menambahkan peserta."
        }
    }

    (await cookies()).set(
        "flash",
        `Peserta dengan nama "${data.nama}" berhasil ditambahkan.`,
        {
            path: "/instansi/kelola-peserta",
            maxAge: 10
        }
    )

    redirect("/instansi/kelola-peserta")
}



export async function getPesertaAction(id: number) {
    const peserta = await prisma.peserta.findUnique({
        where: { id: id },
        include: {
            user: true,
        }
    })

    return peserta
}

export async function updatePesertaAction(
    pesertaId: number,
    prevState: any,
    formData: FormData
) {
    const values = Object.fromEntries(formData)

    const result = UpdatePesertaSchema.safeParse(values)

    if (!result.success) {
        return {
            success: false,
            errors: result.error.flatten().fieldErrors,
            values
        }
    }

    const data = result.data

    try {
        const currentUser = await getCurrentUser()

        if (!currentUser) {
            return {
                success: false,
                message: "Unauthorized"
            }
        }

        const instansi = await prisma.instansi.findUniqueOrThrow({
            where: { userId: currentUser.id },
            select: { id: true }
        })

        const peserta = await prisma.peserta.findUnique({
            where: { id: pesertaId },
            include: { user: true }
        })

        if (!peserta || peserta.instansiId !== instansi.id) {
            return {
                success: false,
                values,
                message: "Instansi peserta tidak sesuai."
            }
        }

        // =========================
        // PRECHECK DUPLIKASI (PER INSTANSI)
        // =========================
        const duplicate = await prisma.peserta.findFirst({
            where: {
                id: { not: pesertaId },
                instansiId: instansi.id,
                OR: [
                    { nik: data.nik },
                    { nomorTelepon: data.nomorTelepon }
                ]
            },
            select: {
                nik: true,
                nomorTelepon: true
            }
        })

        if (duplicate) {
            return {
                success: false,
                values,
                message:
                    duplicate.nik === data.nik
                        ? "NIK peserta sudah digunakan."
                        : "Nomor telepon peserta sudah digunakan."
            }
        }

        // =========================
        // TRANSACTION
        // =========================
        await prisma.$transaction(async (tx) => {
            if (data.email !== peserta.user.email) {
                await auth.api.adminUpdateUser({
                    body: {
                        userId: peserta.user.id,
                        data: {
                            email: data.email
                        }
                    },
                    headers: await headers()
                })
            }

            await tx.peserta.update({
                where: { id: pesertaId },
                data: {
                    nik: data.nik,
                    nomorTelepon: data.nomorTelepon,
                    jabatan: data.jabatan,
                    jenisKelamin: data.jenisKelamin,
                    tanggalLahir: data.tanggalLahir,
                    tempatLahir: data.tempatLahir,
                    alamat: data.alamat
                }
            })

            if (data.password && data.password.length > 0) {
                await auth.api.setUserPassword({
                    body: {
                        userId: peserta.userId,
                        newPassword: data.password
                    },
                    headers: await headers()
                })
            }
        })

    } catch (error: any) {
        console.error(error)

        // =========================
        // HANDLE UNIQUE DB ERROR
        // =========================
        if (error?.code === "P2002") {
            const target = error?.meta?.target as string[]

            if (target?.includes("nik")) {
                return {
                    success: false,
                    values,
                    message: "NIK peserta sudah digunakan."
                }
            }

            if (target?.includes("nomorTelepon")) {
                return {
                    success: false,
                    values,
                    message: "Nomor telepon peserta sudah digunakan."
                }
            }

            if (target?.includes("email")) {
                return {
                    success: false,
                    values,
                    message: "Email sudah digunakan."
                }
            }
        }

        return {
            success: false,
            values,
            message: "Terjadi kesalahan saat memperbarui peserta."
        }
    }

    (await cookies()).set(
        "flash",
        `Data peserta ${data.nama} berhasil diperbarui.`,
        {
            path: "/instansi/kelola-peserta",
            maxAge: 10
        }
    )

    redirect("/instansi/kelola-peserta")
}


export async function getPesertaByInstansi(instansiId: number) {
    const daftarPeserta = await prisma.peserta.findMany({
        where: { instansiId: instansiId },
        include: {
            user: true,
        }
    })

    return daftarPeserta
}

export async function getCurrentPeserta() {
    const currentUser = await getCurrentUser()

    if (!currentUser?.id) {
        return null
    }

    const currentPeserta = await prisma.peserta.findUnique({
        where: {
            userId: currentUser.id
        },
        include: {
            user: {
                include: {
                    peran: true
                }
            },
            instansi: {
                include: {
                    user: true
                }
            }
        }
    })

    return currentPeserta
}

export async function updateStatusBannedPesertaAction(
    prevState: any,
    formData: FormData
) {
    const userId = formData.get("userId") as string
    const banned = formData.get("banned") as string

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

        revalidatePath("/instansi/kelola-peserta");

        return {
            success: true,
            message: `Pengguna ${userPesertaUpdate.name} berhasil ${banned === "true" ? "nonaktifkan" : "aktifkan"}`
        }
    } catch (error) {
        console.error(error)

        return { success: false, message: "Terjadi kesalahan" }
    }
}