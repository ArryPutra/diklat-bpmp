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

    try {
        session = await auth.api.signInEmail({
            body: {
                email: result.data.email,
                password: result.data.password,
            },
        });
    } catch (error: any) {
        console.log(error);

        let message: string = "Email atau password salah"

        if (error.statusCode === 403) {
            message = "Akun anda telah diblokir"
        }

        return {
            success: false,
            message: message,
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
export async function getCurrentUser(select?: any) {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session?.user?.id) {
        return null;
    }

    const query: any = {
        where: {
            id: session.user.id,
        },
    };

    if (select) {
        query.select = select;
    } else {
        query.include = {
            peran: true,
        };
    }

    const user = await prisma.user.findUnique(query);

    return user;
}


export async function logoutAction() {
    await auth.api.signOut({
        headers: await headers()
    });

    return redirect("/");
}