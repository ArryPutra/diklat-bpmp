import { z } from "zod";

export const CreateMateriDiklatSchema = z
    .object({
        judul: z.string().min(1, "Judul materi wajib diisi"),
        deskripsi: z.string().min(1, "Deskripsi materi wajib diisi"),
        narasumberId: z.string().min(1, "Narasumber wajib dipilih"),
        linkMateri: z.string().optional().nullable(),
        lokasi: z.string().optional().nullable(),
        tanggalPelaksanaan: z.coerce.date({
            invalid_type_error: "Tanggal pelaksanaan tidak valid",
        }),
        waktuMulai: z.string().min(1, "Waktu mulai wajib diisi"),
        waktuSelesai: z.string().min(1, "Waktu selesai wajib diisi"),
    })
    .superRefine((data, ctx) => {
        // Validasi format waktu (HH:mm)
        const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;

        if (!timeRegex.test(data.waktuMulai)) {
            ctx.addIssue({
                path: ["waktuMulai"],
                message: "Format waktu mulai tidak valid (gunakan HH:mm)",
                code: z.ZodIssueCode.custom,
            });
        }

        if (!timeRegex.test(data.waktuSelesai)) {
            ctx.addIssue({
                path: ["waktuSelesai"],
                message: "Format waktu selesai tidak valid (gunakan HH:mm)",
                code: z.ZodIssueCode.custom,
            });
        }

        // Validasi waktu selesai harus lebih besar dari waktu mulai
        if (timeRegex.test(data.waktuMulai) && timeRegex.test(data.waktuSelesai)) {
            if (data.waktuMulai >= data.waktuSelesai) {
                ctx.addIssue({
                    path: ["waktuMulai"],
                    message: `Waktu mulai harus lebih kecil dari waktu selesai`,
                    code: z.ZodIssueCode.custom,
                });
            }
        }
    });

export const UpdateMateriDiklatSchema = z
    .object({
        judul: z.string().min(1, "Judul materi wajib diisi"),
        deskripsi: z.string().min(1, "Deskripsi materi wajib diisi"),
        narasumberId: z.string().min(1, "Narasumber wajib dipilih"),
        linkMateri: z.string().optional().nullable(),
        lokasi: z.string().optional().nullable(),
        tanggalPelaksanaan: z.coerce.date({
            invalid_type_error: "Tanggal pelaksanaan tidak valid",
        }),
        waktuMulai: z.string().min(1, "Waktu mulai wajib diisi"),
        waktuSelesai: z.string().min(1, "Waktu selesai wajib diisi"),
    })
    .superRefine((data, ctx) => {
        // Validasi format waktu (HH:mm)
        const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;

        if (!timeRegex.test(data.waktuMulai)) {
            ctx.addIssue({
                path: ["waktuMulai"],
                message: "Format waktu mulai tidak valid (gunakan HH:mm)",
                code: z.ZodIssueCode.custom,
            });
        }

        if (!timeRegex.test(data.waktuSelesai)) {
            ctx.addIssue({
                path: ["waktuSelesai"],
                message: "Format waktu selesai tidak valid (gunakan HH:mm)",
                code: z.ZodIssueCode.custom,
            });
        }

        // Validasi waktu selesai harus lebih besar dari waktu mulai
        if (timeRegex.test(data.waktuMulai) && timeRegex.test(data.waktuSelesai)) {
            if (data.waktuMulai >= data.waktuSelesai) {
                ctx.addIssue({
                    path: ["waktuMulai"],
                    message: `Waktu mulai harus lebih kecil dari waktu selesai`,
                    code: z.ZodIssueCode.custom,
                });
            }
        }
    });