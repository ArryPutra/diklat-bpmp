"use server"

import { Prisma } from "@/generated/prisma/client";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import RegistrasiInstansi from "@/models/RegistrasiInstansi";
import { CreateRegistrasiInstansiSchema, GetRegistrasiInstansiSchema, UpdateRegistrasiInstansiStatusSchema } from "@/schemas/registrasi-instansi.schema";
import { revalidatePath } from "next/cache";

export async function getAllRegistrasiInstansiAction({
    search = "",
    page = "1",
    statusRegistrasiInstansiId = 1,
    orderBy = "asc"
}: {
    search?: string,
    page?: string,
    statusRegistrasiInstansiId?: number,
    orderBy?: "asc" | "desc"
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
        },
        orderBy: {
            createdAt: orderBy
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

export async function createRegistrasiInstansiAction(instansi: RegistrasiInstansi) {
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

export async function updateStatusRegistrasiInstansiAction(
    prevState: any,
    formData: FormData
) {
    const resultData = UpdateRegistrasiInstansiStatusSchema.safeParse(Object.fromEntries(formData));

    if (!resultData.success) {
        return {
            success: false
        }
    }

    let messageData = {
        namaInstansi: "",
        status: ""
    };

    try {
        // memperbarui status registrasi instansi
        const updateRegistrasiInstansi = await prisma.registrasiInstansi.update({
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
                registrasiPicInstansi: true
            }
        })


        // jika status registrasi instansi diterima, maka buat akun instansi
        if (updateRegistrasiInstansi.statusRegistrasiInstansi.nama === "Diterima") {
            // buat akun instansi
            const createUser = await auth.api.createUser({
                body: {
                    name: updateRegistrasiInstansi.nama,
                    email: updateRegistrasiInstansi.email,
                    password: updateRegistrasiInstansi.password,
                    role: "admin",
                    data: {
                        peranId: 2
                    }
                }
            })

            try {
                // buat data instansi berelasi dengan akun/user
                const createInstansi = await prisma.instansi.create({
                    data: {
                        userId: createUser.user.id,
                        nomorTelepon: updateRegistrasiInstansi.nomorTelepon,
                        registrasiInstansiId: updateRegistrasiInstansi.id,
                        desaKelurahan: updateRegistrasiInstansi.desaKelurahan,
                        kecamatan: updateRegistrasiInstansi.kecamatan,
                        kabupatenKota: updateRegistrasiInstansi.kabupatenKota,
                        desaKelurahnKode: updateRegistrasiInstansi.desaKelurahanKode,
                        kecamatanKode: updateRegistrasiInstansi.kecamatanKode,
                        kabupatenKotaKode: updateRegistrasiInstansi.kabupatenKotaKode,
                        alamat: updateRegistrasiInstansi.alamat
                    }
                })

                // buat data pic instansi berelasi dengan instansi
                await prisma.picInstansi.create({
                    data: {
                        instansiId: createInstansi.id,
                        registrasiPicInstansiId: updateRegistrasiInstansi.registrasiPicInstansi?.id ?? 0,
                        nama: updateRegistrasiInstansi.registrasiPicInstansi?.nama ?? "-",
                        email: updateRegistrasiInstansi.registrasiPicInstansi?.email ?? "-",
                        nomorTelepon: updateRegistrasiInstansi.registrasiPicInstansi?.nomorTelepon ?? "-",
                        jabatan: updateRegistrasiInstansi.registrasiPicInstansi?.jabatan ?? "-"
                    }
                })
            } catch (error) {
                console.log(error)

                // Hapus akun instansi (karena data instansi gagal dibuat)
                await auth.api.deleteUser({ body: { password: updateRegistrasiInstansi.password } })
            }
        }

        messageData.namaInstansi = updateRegistrasiInstansi.nama
        messageData.status = updateRegistrasiInstansi.statusRegistrasiInstansi.nama

        let message = '';

        if (messageData.status === "Diterima") {
            message = `Registrasi instansi pada ${messageData.namaInstansi} berhasil diterima. Silahkan cek di halaman daftar instansi.`;
        } else if (messageData.status === "Ditolak") {
            message = `Registrasi instansi pada ${messageData.namaInstansi} berhasil ditolak.`;
        }

        revalidatePath('/admin/dashboard/verifikasi-registrasi-instansi')

        return {
            success: true,
            message: message,
        }
    } catch (error) {
        console.log(error);

        return {
            success: false
        }
    }
}

export async function deleteRegistrasiInstansiAction(id: string) {
    try {
        await prisma.registrasiInstansi.delete({ where: { id: id } });

        return { success: true }
    } catch (error) {
        console.log(error)

        return { success: false }
    }
}