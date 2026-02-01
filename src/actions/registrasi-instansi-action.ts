"use server"

import { Prisma } from "@/generated/prisma/client";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import RegistrasiInstansi from "@/models/RegistrasiInstansi";
import { GetRegistrasiInstansiSchema, CreateRegistrasiInstansiSchema, UpdateRegistrasiInstansiStatusSchema } from "@/schemas/registrasi-instansi.schema";
import { revalidatePath } from "next/cache";

export async function getAllRegistrasiInstansi({
    search = "",
    page = "1",
    statusRegistrasiInstansiId = 1
}) {
    const _search = search.trim();

    const where: Prisma.RegistrasiInstansiWhereInput = {
        OR: [
            {
                nama: {
                    contains: _search,
                    mode: "insensitive"
                },
            }
        ],
        statusRegistrasiInstansi: {
            id: statusRegistrasiInstansiId
        }
    }

    const data = await prisma.registrasiInstansi.findMany({
        skip: parseInt(page) * 10 - 10,
        take: 10,
        where,
        include: {
            registrasiPicInstansi: true,
            statusRegistrasiInstansi: true
        }
    });

    const total = await prisma.registrasiInstansi.count({ where });

    return {
        data: data,
        total: total,
    };
}

export async function getRegistrasiInstansi(_prev: any, formData: FormData) {
    const result = GetRegistrasiInstansiSchema.safeParse(Object.fromEntries(formData));

    if (!result.success) {
        return {
            success: false,
            message: "Kode Registrasi wajib diisi",
        };
    }

    const kodeRegistrasi = result.data.kodeRegistrasi.trim();

    try {
        const data = await prisma.registrasiInstansi.findFirst({
            where: {
                id: kodeRegistrasi
            },
            select: {
                id: true,
                nama: true,
                email: true,
                nomorTelepon: true,
                desaKelurahan: true,
                kecamatan: true,
                kabupatenKota: true,
                alamat: true,
                createdAt: true,
                updatedAt: true,
                statusRegistrasiInstansi: {
                    select: {
                        id: true,
                        nama: true
                    }
                },
                registrasiPicInstansi: {
                    select: {
                        id: true,
                        nama: true,
                        email: true,
                        nomorTelepon: true,
                        jabatan: true
                    }
                }
            }
        });

        if (!data) {
            return { success: false, message: "Data tidak ditemukan" };
        }

        return { success: true, data: data };
    } catch (error) {
        console.error("Error fetching registration status:", error);
        return { success: false, message: "Terjadi kesalahan pada server" };
    }
}

export async function createRegistrasiInstansi(instansi: RegistrasiInstansi) {
    const resultData = CreateRegistrasiInstansiSchema.safeParse(instansi);

    if (!resultData.success) {
        return {
            success: false
        }
    }

    try {
        // melakukan pengecekan apakah email sudah terdaftar pada user autentikasi atau belum
        const emailExists = await prisma.user.findUnique({
            where: {
                email: resultData.data.email
            }
        });

        if (emailExists) {
            return {
                success: false,
                message: "Email yang dimasukkan sudah terdaftar sebagai akun, silahkan gunakan email lain."
            }
        }

        const data = await prisma.registrasiInstansi.create(
            {
                data: {
                    nama: resultData.data.nama,
                    email: resultData.data.email,
                    nomorTelepon: resultData.data.nomorTelepon,
                    desaKelurahan: resultData.data.desaKelurahan,
                    kecamatan: resultData.data.kecamatan,
                    kabupatenKota: resultData.data.kabupatenKota,
                    desaKelurahanKode: resultData.data.desaKelurahanKode,
                    kecamatanKode: resultData.data.kecamatanKode,
                    kabupatenKotaKode: resultData.data.kabupatenKotaKode,
                    password: resultData.data.password,
                    alamat: resultData.data.alamat,
                }
            }
        );

        return {
            success: true,
            message: "Registrasi instansi berhasil",
            data: data
        }
    } catch (error) {
        console.log(error)

        return {
            success: false,
            message: "Terjadi kesalahan"
        }
    }
}

export async function updateStatusRegistrasiInstansi(
    prevState: any,
    formData: FormData
) {
    const resultData = UpdateRegistrasiInstansiStatusSchema.safeParse(Object.fromEntries(formData));

    if (!resultData.success) {
        return {
            success: false
        }
    }

    try {
        await prisma.$transaction(async (tx) => {
            const data = await tx.registrasiInstansi.update({
                where: {
                    id: resultData.data.registrasiInstansiId
                },
                data: {
                    statusRegistrasiInstansi: {
                        connect: {
                            nama: resultData.data.statusRegistrasiInstansi
                        }
                    }
                },
                include: {
                    statusRegistrasiInstansi: true,
                }
            })

            if (data.statusRegistrasiInstansi.nama === "Diterima") {
                await auth.api.signUpEmail({
                    body: {
                        name: data.nama,
                        email: data.email,
                        password: data.password,
                        peranId: 2
                    }
                })
            }
        })

        revalidatePath('/admin/dashboard')

        return {
            success: true
        }
    } catch (error) {
        console.log(error);

        return {
            success: false
        }
    }
}