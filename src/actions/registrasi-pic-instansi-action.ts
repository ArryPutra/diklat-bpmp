"use server"

import prisma from "@/lib/prisma";
import RegistrasiPicInstansi from "@/models/RegistrasiPicInstansi";
import RegistrasiPicInstansiSchema from "@/schemas/RegistrasiPicInstansiSchema";

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