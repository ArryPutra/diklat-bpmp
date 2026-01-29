"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";

const LoginSchema = z.object({
    email: z.string().nonempty("Email wajib diisi").email("Email tidak valid"),
    password: z.string().nonempty("Password wajib diisi"),
});

export async function loginAction(prev: any, formData: FormData) {
    const result = LoginSchema.safeParse(Object.fromEntries(formData));

    if (!result.success) {
        const fieldErrors = result.error.flatten().fieldErrors;

        return {
            success: false,
            message: result.error.message,
            errors: {
                field: {
                    email: fieldErrors.email?.[0],
                    password: fieldErrors.password?.[0],
                }
            },
            values: {
                email: formData.get("email")?.toString(),
                password: formData.get("password")?.toString(),
            }
        };
    }

    let session;
    try {
        session = await auth.api.signInEmail({
            body: {
                email: result.data.email,
                password: result.data.password
            }
        });
    } catch (error) {
        console.log(error);

        return {
            success: false,
            errors: {
                message: "Email atau password salah",
            },
            values: {
                email: formData.get("email")?.toString(),
                password: formData.get("password")?.toString(),
            }
        };
    }

    // Determine redirect based on role
    let redirectUrl = "/dashboard";

    if (session?.user) {
        // Check if user's email is associated with any PIC instansi
        const picInstansi = await prisma.registrasiPicInstansi.findFirst({
            where: { email: session.user.email }
        });

        if (picInstansi) {
            // User is PIC instansi - check if instansi is approved
            const instansi = await prisma.registrasiInstansi.findFirst({
                where: {
                    registrasiPicInstansi: {
                        email: session.user.email
                    },
                    statusRegistrasiInstansi: {
                        nama: "DISETUJUI"
                    }
                }
            });

            if (instansi) {
                // Instansi PIC with approved instansi - redirect to instansi dashboard
                redirectUrl = "/dashboard/instansi";
            }
            // If not approved yet, go to selector/info page
        } else {
            // Not a PIC instansi - must be admin
            redirectUrl = "/dashboard/admin";
        }
    }

    return redirect(redirectUrl);
}

export async function getCurrentSession() {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    return session;
}

export async function checkIsAdmin(userId: string) {
    // Get user email
    const user = await prisma.user.findUnique({
        where: { id: userId }
    });

    if (!user) return false;

    // Check if this user's email is associated with any PIC instansi
    const picInstansi = await prisma.registrasiPicInstansi.findFirst({
        where: { email: user.email }
    });

    // User is admin if they are NOT associated with any instansi PIC
    // (Admin accounts are created manually/seeded, not from instansi registration)
    return !picInstansi;
}

export async function getApprovedInstansi(email: string) {
    const instansi = await prisma.registrasiInstansi.findFirst({
        where: {
            registrasiPicInstansi: {
                email: email
            },
            statusRegistrasiInstansi: {
                nama: "DISETUJUI"
            }
        },
        include: {
            statusRegistrasiInstansi: true,
            registrasiPicInstansi: true
        }
    });

    return instansi;
}

export async function logoutAction() {
    await auth.api.signOut({
        headers: await headers()
    });

    return redirect("/login");
}

const ChangePasswordSchema = z.object({
    currentPassword: z.string().min(1, "Password saat ini wajib diisi"),
    newPassword: z.string().min(8, "Password baru minimal 8 karakter"),
    confirmPassword: z.string().min(1, "Konfirmasi password wajib diisi"),
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: "Konfirmasi password tidak cocok",
    path: ["confirmPassword"],
});

export async function changePasswordAction(prev: any, formData: FormData) {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session?.user) {
        return {
            success: false,
            message: "Anda harus login terlebih dahulu"
        };
    }

    const result = ChangePasswordSchema.safeParse({
        currentPassword: formData.get("currentPassword"),
        newPassword: formData.get("newPassword"),
        confirmPassword: formData.get("confirmPassword"),
    });

    if (!result.success) {
        const fieldErrors = result.error.flatten().fieldErrors;
        return {
            success: false,
            errors: {
                currentPassword: fieldErrors.currentPassword?.[0],
                newPassword: fieldErrors.newPassword?.[0],
                confirmPassword: fieldErrors.confirmPassword?.[0],
            }
        };
    }

    try {
        await auth.api.changePassword({
            body: {
                currentPassword: result.data.currentPassword,
                newPassword: result.data.newPassword
            },
            headers: await headers()
        });

        return {
            success: true,
            message: "Password berhasil diubah"
        };
    } catch (error: any) {
        return {
            success: false,
            message: error?.message || "Gagal mengubah password. Pastikan password saat ini benar."
        };
    }
}