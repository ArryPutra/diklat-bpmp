"use server"

import { Prisma } from "@/generated/prisma/client";
import { auth } from "@/lib/auth";
import logger from "@/lib/logger";
import prisma from "@/lib/prisma";
import RegistrasiInstansi from "@/models/RegistrasiInstansi";
import { CreateRegistrasiInstansiSchema, GetRegistrasiInstansiSchema, UpdateRegistrasiInstansiStatusSchema } from "@/schemas/registrasi-instansi.schema";
import { revalidatePath } from "next/cache";
import { sendEmailAction } from "./send-email-action";

function maskEmail(email: string): string {
    const [localPart, domain] = email.split("@");

    if (!domain) return "***";
    if (localPart.length <= 2) return `${localPart[0] ?? "*"}***@${domain}`;

    return `${localPart.slice(0, 2)}${"*".repeat(Math.min(localPart.length - 2, 5))}@${domain}`;
}

function maskPhone(phone: string): string {
    if (phone.length <= 4) return phone;

    const maskedLength = Math.max(phone.length - 7, 0);
    return `${phone.slice(0, 4)}${"*".repeat(maskedLength)}${phone.slice(-3)}`;
}

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

        const maskedData = {
            ...data,
            email: maskEmail(data.email),
            nomorTelepon: maskPhone(data.nomorTelepon),
            registrasiPicInstansi: data.registrasiPicInstansi
                ? {
                    ...data.registrasiPicInstansi,
                    email: maskEmail(data.registrasiPicInstansi.email),
                    nomorTelepon: maskPhone(data.registrasiPicInstansi.nomorTelepon),
                }
                : null,
        };

        return { success: true, data: maskedData };
    } catch (error) {
        logger.error("Gagal fetch status registrasi instansi", "registrasi-instansi-action", error)
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
        logger.error("Gagal buat registrasi instansi", "registrasi-instansi-action", error)

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
                logger.error("Gagal buat data instansi setelah approve", "registrasi-instansi-action", error)

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

        const picEmail = updateRegistrasiInstansi.registrasiPicInstansi?.email;

        if (picEmail && ["Diterima", "Ditolak"].includes(messageData.status)) {
            const subject = messageData.status === "Diterima"
                ? "Status Registrasi Instansi Anda: Diterima"
                : "Status Registrasi Instansi Anda: Ditolak";

            const html = messageData.status === "Diterima"
                ? `
                <div style="font-family: Arial, sans-serif; max-width: 620px; margin: auto; border: 1px solid #e5e7eb; border-radius: 14px; overflow: hidden; background-color: #ffffff;">
                    <div style="background: linear-gradient(135deg, #0ea5e9, #2563eb); color: #ffffff; padding: 26px 24px; text-align: center;">
                        <h1 style="margin: 0; font-size: 24px;">Registrasi Instansi Diterima 🎉</h1>
                        <p style="margin: 10px 0 0 0; font-size: 14px; opacity: .95;">Diklat BPMP Kalsel</p>
                    </div>

                    <div style="padding: 24px; color: #1f2937;">
                        <p style="font-size: 16px; margin: 0 0 14px 0;">Halo <strong>${updateRegistrasiInstansi.registrasiPicInstansi?.nama ?? "PIC Instansi"}</strong> 👋</p>

                        <p style="font-size: 15px; line-height: 1.6; margin: 0 0 14px 0;">
                            Registrasi instansi <strong>${messageData.namaInstansi}</strong> telah <strong>diterima</strong>.
                        </p>

                        <div style="background-color: #f0f9ff; border: 1px solid #bae6fd; border-radius: 10px; padding: 14px; margin: 0 0 18px 0;">
                            <p style="margin: 0; font-size: 14px; color: #0c4a6e;">
                                Akun instansi Anda sudah aktif. Anda dapat login melalui tautan berikut:
                            </p>
                        </div>

                        <div style="text-align: center; margin: 22px 0;">
                            <a href="https://diklat.bpmpkalsel.web.id/login" style="display: inline-block; background-color: #2563eb; color: #ffffff; text-decoration: none; padding: 12px 22px; border-radius: 8px; font-weight: 700; font-size: 14px;">
                                Login Akun Instansi
                            </a>
                        </div>

                        <p style="font-size: 13px; color: #6b7280; margin: 0; text-align: center;">
                            Jika tombol tidak berfungsi, buka link ini: <br/>
                            <a href="https://diklat.bpmpkalsel.web.id/login" style="color: #2563eb;">https://diklat.bpmpkalsel.web.id/login</a>
                        </p>
                    </div>
                </div>
                `
                : `
                <div style="font-family: Arial, sans-serif; max-width: 620px; margin: auto; border: 1px solid #e5e7eb; border-radius: 14px; overflow: hidden; background-color: #ffffff;">
                    <div style="background: linear-gradient(135deg, #f97316, #dc2626); color: #ffffff; padding: 26px 24px; text-align: center;">
                        <h1 style="margin: 0; font-size: 24px;">Registrasi Instansi Ditolak</h1>
                        <p style="margin: 10px 0 0 0; font-size: 14px; opacity: .95;">Diklat BPMP Kalsel</p>
                    </div>

                    <div style="padding: 24px; color: #1f2937;">
                        <p style="font-size: 16px; margin: 0 0 14px 0;">Halo <strong>${updateRegistrasiInstansi.registrasiPicInstansi?.nama ?? "PIC Instansi"}</strong> 👋</p>

                        <p style="font-size: 15px; line-height: 1.6; margin: 0 0 14px 0;">
                            Registrasi instansi <strong>${messageData.namaInstansi}</strong> saat ini berstatus <strong>ditolak</strong>.
                        </p>

                        <div style="background-color: #fff7ed; border: 1px solid #fed7aa; border-radius: 10px; padding: 14px; margin: 0 0 18px 0;">
                            <p style="margin: 0; font-size: 14px; color: #9a3412;">
                                Jika ingin mengajukan kembali, Anda bisa menghubungi layanan BPMP Kalsel melalui web utama.
                            </p>
                        </div>

                        <p style="font-size: 13px; color: #6b7280; margin: 0; text-align: center;">
                            Email ini dikirim otomatis oleh sistem Diklat BPMP.
                        </p>
                    </div>
                </div>
                `;

            try {
                await sendEmailAction({
                    toEmail: picEmail,
                    subject,
                    html,
                });
            } catch (error) {
                logger.error("Gagal kirim email status registrasi instansi ke PIC", "registrasi-instansi-action", error, {
                    registrasiInstansiId: updateRegistrasiInstansi.id,
                    status: messageData.status,
                    picEmail,
                });
            }
        }

        revalidatePath('/admin/dashboard/verifikasi-registrasi-instansi')

        return {
            success: true,
            message: message,
        }
    } catch (error) {
        logger.error("Gagal update status registrasi instansi", "registrasi-instansi-action", error)

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
        logger.error("Gagal hapus registrasi instansi", "registrasi-instansi-action", error)

        return { success: false }
    }
}