"use server"

import { Prisma } from "@/generated/prisma/client";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { CreatePesertaSchema, UpdatePesertaSchema } from "@/schemas/peserta.schema";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getCurrentUser } from "./auth-action";

export async function getAllPesertaAction({
    search = "",
    page = "1",
    take = 10,
    banned = "false"
}: {
    search?: string
    page?: string
    take?: number
    banned?: "false" | "true"
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
        }
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

        const instansi = await prisma.instansi.findUniqueOrThrow({
            where: { userId: currentUser?.id },
            select: { id: true }
        })

        // cek duplikasi sekaligus
        const duplicate = await prisma.peserta.findFirst({
            where: {
                OR: [
                    { nik: data.nik },
                    { nomorTelepon: data.nomorTelepon }
                ]
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

        // transaction supaya konsisten
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

        // handle auth error 400
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

        const instansi = await prisma.instansi.findUniqueOrThrow({
            where: { userId: currentUser?.id },
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

        // cek duplikasi nik / nomor (kecuali diri sendiri)
        const duplicate = await prisma.peserta.findFirst({
            where: {
                id: { not: pesertaId },
                OR: [
                    { nik: data.nik },
                    { nomorTelepon: data.nomorTelepon }
                ]
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

        // transaction update
        await prisma.$transaction(async (tx) => {
            await tx.user.update({
                where: { id: peserta.userId },
                data: {
                    name: data.nama,
                    email: data.email
                }
            })

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

            // update password jika ada
            if (data.password && data.password.length > 0) {
                await auth.api.setUserPassword({
                    body: {
                        userId: peserta.userId,
                        newPassword: data.password,
                    },
                })
            }
        })

    } catch (error: any) {
        console.error(error)

        return {
            success: false,
            values,
            message: "Terjadi kesalahan saat memperbarui peserta."
        }
    }

    ; (await cookies()).set(
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