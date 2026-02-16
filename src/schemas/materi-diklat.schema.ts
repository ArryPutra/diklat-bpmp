import { z } from "zod";

export const CreateMateriDiklatSchema = z
    .object({
        judul: z.string().min(1, "Judul materi wajib diisi"),
        deskripsi: z.string().min(1, "Deskripsi materi wajib diisi"),
        narasumberId: z.string().min(1, "Narasumber wajib dipilih"),
        fileMateri: z.string().optional().nullable(),
        lokasi: z.string().optional().nullable(),
        waktuMulai: z.coerce.date({
            invalid_type_error: "Waktu mulai tidak valid",
        }),
        waktuSelesai: z.coerce.date({
            invalid_type_error: "Waktu selesai tidak valid",
        }),
    })
    .superRefine((data, ctx) => {
        // Validasi waktu selesai harus lebih besar dari waktu mulai
        if (data.waktuMulai >= data.waktuSelesai) {
            ctx.addIssue({
                path: ["waktuMulai"],
                message:
                    `Waktu mulai harus lebih kecil dari waktu selesai`,
                code: z.ZodIssueCode.custom,
            });
        }
    });

export const UpdateMateriDiklatSchema = z
    .object({
        judul: z.string().min(1, "Judul materi wajib diisi"),
        deskripsi: z.string().min(1, "Deskripsi materi wajib diisi"),
        narasumberId: z.string().min(1, "Narasumber wajib dipilih"),
        fileMateri: z.string().optional().nullable(),
        lokasi: z.string().optional().nullable(),
        waktuMulai: z.coerce.date({
            invalid_type_error: "Waktu mulai tidak valid",
        }),
        waktuSelesai: z.coerce.date({
            invalid_type_error: "Waktu selesai tidak valid",
        }),
    })
    .superRefine((data, ctx) => {
        // Validasi waktu selesai harus lebih besar dari waktu mulai
        if (data.waktuMulai >= data.waktuSelesai) {
            ctx.addIssue({
                path: ["waktuMulai"],
                message:
                    `Waktu mulai harus lebih kecil dari waktu selesai`,
                code: z.ZodIssueCode.custom,
            });
        }
    });