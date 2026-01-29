"use server"

import prisma from "@/lib/prisma";
import RegistrasiInstansi from "@/models/RegistrasiInstansi";
import { z } from "zod";

const schemaRegistrasiInstansi = z.object({
    kodeRegistrasi: z.string().nonempty("Kode Registrasi wajib diisi"),
});

// Fungsi untuk cek status registrasi (tanpa data sensitif seperti password)
export async function getRegistrasiInstansiStatus(_prev: any, formData: FormData) {
    const result = schemaRegistrasiInstansi.safeParse(Object.fromEntries(formData));

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
                // Hanya pilih field yang aman untuk ditampilkan
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
                // TIDAK menyertakan password untuk keamanan
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
                        // TIDAK menyertakan data sensitif lainnya
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
    const result = schemaRegistrasiInstansi.safeParse(Object.fromEntries(formData));

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

const RegistrasiInstansiSchema = z.object({
    nama: z.string().nonempty("Nama wajib diisi"),
    email: z.string().email("Email tidak valid"),
    nomorTelepon: z.string().min(10, "Nomor telepon minimum 10 karakter").max(12, "Nomor telepon maksimum 12 karakter"),
    desaKelurahan: z.string().nonempty("Desa/Kelurahan wajib diisi"),
    kecamatan: z.string().nonempty("Kecamatan wajib diisi"),
    kabupatenKota: z.string().nonempty("Kabupaten/Kota wajib diisi"),
    password: z.string().min(8, "Password minimal 8 karakter").max(32, "Password maksimal 32 karakter").nonempty("Password wajib diisi"),
    konfirmasiPassword: z.string().nonempty("Konfirmasi password wajib diisi"),
    alamat: z.string().nonempty("Alamat wajib diisi"),
}).refine((data) => data.password === data.konfirmasiPassword, {
    message: "Password dan konfirmasi password harus sama",
    path: ["konfirmasiPassword"], // error akan muncul di field konfirmasiPassword
});

export async function createRegistrasiInstansi(instansi: RegistrasiInstansi) {
    const resultData = RegistrasiInstansiSchema.safeParse(instansi);

    if (!resultData.success) {
        const errors = resultData.error.flatten().fieldErrors;

        return {
            success: false,
            message: errors
        }
    }

    try {
        // Simpan password tanpa hash - akan di-hash oleh better-auth saat approve
        // Ini aman karena hanya digunakan sekali untuk membuat akun user
        const data = await prisma.registrasiInstansi.create(
            {
                data: {
                    nama: resultData.data.nama,
                    email: resultData.data.email,
                    nomorTelepon: resultData.data.nomorTelepon,
                    desaKelurahan: resultData.data.desaKelurahan,
                    kecamatan: resultData.data.kecamatan,
                    kabupatenKota: resultData.data.kabupatenKota,
                    password: resultData.data.password, // Plain text - akan di-hash oleh better-auth
                    alamat: resultData.data.alamat,

                }
            }
        );

        return { success: true, data: data }
    } catch (error) {
        console.log(error)

        return { success: false, message: "Terjadi kesalahan" }
    }
}