"use server"

import prisma from "@/lib/prisma";
import RegistrasiPicInstansi from "@/models/RegistrasiPicInstansi";
import { z } from "zod";

const RegistrasiPicInstansiSchema = z.object({
    nama: z.string().nonempty("Nama wajib diisi"),
    email: z.string().email("Email tidak valid"),
    nomorTelepon: z.string().min(10, "Nomor telepon minimum 10 karakter").max(12, "Nomor telepon maksimum 12 karakter"),
    jabatan: z.string().nonempty("Jabatan wajib diisi"),
});

export async function createRegistrasiPicInstansi(
    picInstansi: RegistrasiPicInstansi,
    idRegistrasiInstansi: string
) {
    const resultData = RegistrasiPicInstansiSchema.safeParse(picInstansi);

    if (!resultData.success) {
        const errors = resultData.error.flatten().fieldErrors;

        return {
            success: false,
            message: errors
        }
    }

    try {
        const data = await prisma.registrasiPicInstansi.create(
            {
                data: {
                    nama: resultData.data.nama,
                    email: resultData.data.email,
                    nomorTelepon: resultData.data.nomorTelepon,
                    jabatan: resultData.data.jabatan,
                    registrasiInstansiId: idRegistrasiInstansi,
                }
            }
        );

        return { success: true, data: data }
    } catch (error) {
        console.log(error)

        return { success: false, message: "Terjadi kesalahan" }
    }
}