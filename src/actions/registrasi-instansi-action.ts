"use server"

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import RegistrasiInstansi from "@/models/RegistrasiInstansi";
import RegistrasiInstansiSchema from "@/schemas/RegistrasiInstansiSchema";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const schemaRegistrasiInstansiStatus = z.object({
    kodeRegistrasi: z.string().nonempty("Kode Registrasi wajib diisi"),
});

export async function getRegistrasiInstansiStatus(_prev: any, formData: FormData) {
    const result = schemaRegistrasiInstansiStatus.safeParse(Object.fromEntries(formData));

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

// Fungsi lama untuk backward compatibility (internal use only)
export async function getRegistrasiInstansi(_prev: any, formData: FormData) {
    const result = schemaRegistrasiInstansiStatus.safeParse(Object.fromEntries(formData));

    if (!result.success) {
        return {
            success: false,
            message: "Kode Registrasi wajib diisi",
        };
    }

    const kodeRegistrasi = result.data.kodeRegistrasi;

    try {
        const data = await prisma.registrasiInstansi.
            findFirst({
                where: {
                    id: kodeRegistrasi
                },
                include: {
                    statusRegistrasiInstansi: true,
                    registrasiPicInstansi: true
                }
            });

        if (!data) {
            return { success: false, message: "Data tidak ditemukan" };
        }

        return { success: true, data: data };
    } catch (error) {
        return { success: false, message: "Terjadi kesalahan" };
    }
}

export async function createRegistrasiInstansi(instansi: RegistrasiInstansi) {
    const resultData = RegistrasiInstansiSchema.safeParse(instansi);

    if (!resultData.success) {
        return {
            success: false
        }
    }

    try {
        // melakukan pengecekan apakah email sudah terdaftar atau belum
        const emailExists = await prisma.user.findUnique({
            where: {
                email: resultData.data.email
            }
        });

        if (emailExists) {
            return {
                success: false,
                errors: {
                    message: "Email yang dimasukkan sudah terdaftar sebagai akun, silahkan gunakan email lain."
                }
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

        return { success: true, data: data }
    } catch (error) {
        console.log(error)

        return {
            success: false,
            errors: {
                message: "Terjadi kesalahan"
            }
        }
    }
}

export async function updateStatusRegistrasiInstansi(
    prevState: any,
    formData: FormData
) {
    const registrasiInstansiId = formData.get("registrasiInstansiId") as string
    const statusRegistrasiInstansi = formData.get("statusRegistrasiInstansi") as string

    if (!registrasiInstansiId || !statusRegistrasiInstansi) {
        return {
            success: false
        }
    }

    try {
        await prisma.$transaction(async (tx) => {
            const data = await tx.registrasiInstansi.update({
                where: {
                    id: registrasiInstansiId
                },
                data: {
                    statusRegistrasiInstansi: {
                        connect: {
                            nama: statusRegistrasiInstansi
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
    } catch (error) {
        console.log(error);

        return {
            success: false,
            message: "Terjadi kesalahan"
        }
    }
}