import { z } from "zod";

export const JenisKelaminSchema = z.enum([
    "Pria",
    "Wanita",
], {
    required_error: "Jenis kelamin wajib diisi",
});

export const CreatePesertaSchema = z.object({
    nama: z.string().min(1, "Nama wajib diisi"),
    email: z.string().email("Email tidak valid"),
    nomorTelepon: z
        .string()
        .min(10, "Nomor telepon minimum 10 karakter")
        .max(15, "Nomor telepon maksimum 15 karakter"),
    nik: z
        .string()
        .min(16, "NIK harus 18 digit")
        .max(16, "NIK harus 18 digit"),

    jabatan: z
        .string()
        .min(1, "Jabatan wajib diisi"),

    jenisKelamin: JenisKelaminSchema,

    tanggalLahir: z.coerce.date({
        invalid_type_error: "Tanggal lahir tidak valid",
    }),

    tempatLahir: z
        .string()
        .min(1, "Tempat lahir wajib diisi"),

    alamat: z
        .string()
        .min(1, "Alamat wajib diisi"),

    password: z.string().min(8, "Password minimal 8 karakter").max(32, "Password maksimal 32 karakter").nonempty("Password wajib diisi"),
    konfirmasiPassword: z.string().nonempty("Konfirmasi password wajib diisi"),

}).refine((data) => data.password === data.konfirmasiPassword, {
    message: "Password dan konfirmasi password harus sama",
    path: ["konfirmasiPassword"],
});

export const UpdatePesertaSchema = z.object({
    nama: z.string().min(1, "Nama wajib diisi"),
    email: z.string().email("Email tidak valid"),
    nomorTelepon: z
        .string()
        .min(10, "Nomor telepon minimum 10 karakter")
        .max(15, "Nomor telepon maksimum 15 karakter"),
    nik: z
        .string()
        .min(16, "NIK harus 18 digit")
        .max(16, "NIK harus 18 digit"),
    jabatan: z.string().min(1, "Jabatan wajib diisi"),
    jenisKelamin: JenisKelaminSchema,
    tanggalLahir: z.coerce.date({
        invalid_type_error: "Tanggal lahir tidak valid",
    }),
    tempatLahir: z.string().min(1, "Tempat lahir wajib diisi"),
    alamat: z.string().min(1, "Alamat wajib diisi"),
    password: z
        .string()
        .min(8, "Password minimal 8 karakter")
        .max(32, "Password maksimal 32 karakter")
        .optional()
        .or(z.literal("")),
    konfirmasiPassword: z.string().optional().or(z.literal("")),
}).refine(
    (data) => {
        // Jika password diisi, konfirmasi password harus sama
        if (data.password && data.password.length > 0) {
            return data.password === data.konfirmasiPassword;
        }
        return true;
    },
    {
        message: "Password dan konfirmasi password harus sama",
        path: ["konfirmasiPassword"],
    }
);