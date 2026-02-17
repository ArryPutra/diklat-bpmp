import { z } from "zod";

export const CreateNarasumberSchema = z
    .object({
        nama: z.string().min(1, "Nama wajib diisi"),
        email: z.string().email("Email tidak valid"),
        nomorTelepon: z
            .string()
            .min(10, "Nomor telepon minimum 10 karakter")
            .max(15, "Nomor telepon maksimum 15 karakter"),
        jenisKelamin: z.enum(["Pria", "Wanita"], {
            errorMap: () => ({ message: "Jenis kelamin wajib diisi" }),
        }),
        password: z.string().min(8, "Password minimal 8 karakter"),
        konfirmasiPassword: z
            .string()
            .min(8, "Konfirmasi password minimal 8 karakter"),
    })
    .refine((data) => data.password === data.konfirmasiPassword, {
        message: "Password dan konfirmasi password tidak sama",
        path: ["konfirmasiPassword"], // error akan muncul di field konfirmasiPassword
    });

export const UpdateNarasumberSchema = z
    .object({
        nama: z.string().min(1, "Nama wajib diisi"),
        email: z.string().email("Email tidak valid"),
        nomorTelepon: z
            .string()
            .min(10, "Nomor telepon minimum 10 karakter")
            .max(15, "Nomor telepon maksimum 15 karakter"),
        jenisKelamin: z.enum(["Pria", "Wanita"], {
            errorMap: () => ({ message: "Jenis kelamin wajib diisi" }),
        }),
        password: z.string().min(8, "Password minimal 8 karakter").optional().or(z.literal("")),
        konfirmasiPassword: z.string().optional().or(z.literal("")),
    })
    .refine((data) => {
        // Jika password kosong, abaikan validasi
        if (!data.password) {
            return true;
        }
        // Jika password diisi, maka konfirmasiPassword harus diisi dan sama
        return data.password === data.konfirmasiPassword;
    }, {
        message: "Password dan konfirmasi password harus sama",
        path: ["konfirmasiPassword"],
    });
