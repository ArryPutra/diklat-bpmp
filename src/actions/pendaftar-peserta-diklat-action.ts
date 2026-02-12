"use server"

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getCurrentInstansi } from "./instansi-action";

export async function createPendaftarPesertaDiklatAction(
    daftarPesertaId: any[],
    diklatId: string,
    prevState: any,
) {
    // pastikan daftar peserta ada data
    if (daftarPesertaId.length === 0) {
        return {
            success: false,
            message: "Daftar peserta tidak boleh kosong"
        };
    }

    const currentInstansi = await getCurrentInstansi();

    // cek diklat masih buka pendaftaran
    const diklat = await prisma.diklat.findUnique({
        where: {
            id: diklatId,
            statusPendaftaranDiklatId: 2
        }
    });

    if (!diklat) {
        return {
            success: false,
            message: "Pendaftaran diklat ditutup"
        };
    }

    // cek peserta berasal dari instansi yang sama
    for (const pesertaId of daftarPesertaId) {
        const pesertaData = await prisma.peserta.findUnique({
            where: {
                id: pesertaId,
                instansiId: currentInstansi.id
            }
        });

        if (!pesertaData) {
            return {
                success: false,
                message: "Pendaftaran diklat hanya dapat dilakukan melalui instansi masing-masing peserta"
            };
        }
    }

    // cek daftar peserta bahwa belum pernah daftar diklat ini
    for (const pesertaId of daftarPesertaId) {
        const pendaftarPesertaDiklat = await prisma.pendaftarPesertaDiklat.findFirst({
            where: {
                diklatId: diklatId,
                pesertaId: pesertaId
            },
            select: {
                peserta: {
                    select: {
                        nik: true,
                        user: {
                            select: {
                                name: true
                            }
                        }
                    }
                }
            }
        });

        if (pendaftarPesertaDiklat) {
            return {
                success: false,
                message: `Peserta "${pendaftarPesertaDiklat.peserta.user.name} | ${pendaftarPesertaDiklat.peserta.nik}" sudah mendaftar diklat ini, silahkan hapus peserta ini dari daftar.`
            };
        }
    }

    try {
        const x = await prisma.pendaftarPesertaDiklat.createMany({
            data: daftarPesertaId.map((pesertaId) => ({
                diklatId: diklatId,
                pesertaId: pesertaId,
            }))
        });

        revalidatePath("/diklat/" + diklatId);

        return {
            success: true,
            message: "Peserta berhasil didaftarkan, silahkan cek menu pada daftar peserta diklat"
        };
    } catch (error) {
        console.error(error)

        return {
            success: false,
            message: "Terjadi kesalahan saat mendaftar peserta"
        };
    }
}
