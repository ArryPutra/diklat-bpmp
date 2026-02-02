"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { LoginSchema } from "@/schemas/auth.schema";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export async function loginAction(prev: any, formData: FormData) {
    const result = LoginSchema.safeParse(Object.fromEntries(formData));

    if (!result.success) {
        const fieldErrors = result.error.flatten().fieldErrors;

        return {
            success: false,
            errors: {
                field: {
                    email: fieldErrors.email?.[0],
                    password: fieldErrors.password?.[0],
                },
            },
            values: {
                email: formData.get("email")?.toString(),
                password: formData.get("password")?.toString(),
            }
        };
    }

    let session = null;

    const getUser = await prisma.user.findUnique({
        where: {
            email: result.data.email
        },
        select: {
            apakahNonaktif: true
        }
    });

    if (getUser?.apakahNonaktif) {
        return {
            success: false,
            message: "Akun anda telah dinonaktifkan",
        }
    }

    try {
        session = await auth.api.signInEmail({
            body: {
                email: result.data.email,
                password: result.data.password,
            },
        });
    } catch (error) {
        console.log(error);

        return {
            success: false,
            message: "Email atau password salah",
            values: {
                email: formData.get("email")?.toString(),
                password: formData.get("password")?.toString(),
            }
        };
    }

    switch (session.user.peranId) {
        case 1:
            redirect("/admin/dashboard");
        case 2:
            redirect("/instansi/dashboard");
        case 3:
            redirect("/peserta/dashboard");
        case 4:
            redirect("/narasumber/dashboard");
        default:
            redirect("/login");
    }
}

// fungsi mendapatkan data login pengguna
export async function getCurrentSession() {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    return session;
}

// fungsi mendapatkan data login pengguna (user) lebih spesifik
export async function getCurrentUser() {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    const user = await prisma.user.findUnique({
        where: {
            id: session?.user.id,
        },
        include: {
            peran: true
        }
    });

    return user;
}

export async function logoutAction() {
    await auth.api.signOut({
        headers: await headers()
    });

    return redirect("/");
}