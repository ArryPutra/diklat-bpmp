"use server"

import logger from "@/lib/logger";
import prisma from "@/lib/prisma";
import { z } from "zod";

const GetSertifikasiSchema = z.object({
    kodeSertifikasi: z.string().min(1, "Kode sertifikasi wajib diisi")
})

export async function getSertifikasiAction(_prev: any, formData: FormData) {
    const result = GetSertifikasiSchema.safeParse(Object.fromEntries(formData));

    if (!result.success) {
        return {
            success: false,
            message: "Kode Sertifikasi wajib diisi",
        };
    }

    const kodeSertifikasi = result.data.kodeSertifikasi.trim().toUpperCase();

    try {
        const data = await prisma.kelulusanPesertaDiklat.findFirst({
            where: {
                kodeSertifikasi: kodeSertifikasi
            },
            include: {
                pesertaDiklat: {
                    include: {
                        peserta: {
                            include: {
                                user: {
                                    select: {
                                        name: true,
                                        email: true
                                    }
                                }
                            }
                        },
                        diklat: {
                            include: {
                                metodeDiklat: true
                            }
                        },
                        statusKelulusanPesertaDiklat: true
                    }
                }
            }
        });

        if (!data) {
            return {
                success: false,
                message: "Sertifikat tidak ditemukan dengan kode ini"
            };
        }

        return {
            success: true,
            data: data
        };
    } catch (error) {
        logger.error("Gagal fetch sertifikasi", "sertifikasi-action", error)
        return {
            success: false,
            message: "Terjadi kesalahan pada server"
        };
    }
}
