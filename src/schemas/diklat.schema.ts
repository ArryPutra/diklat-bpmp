import { z } from "zod";


export const DiklatSchema = z
    .object({
        metodeDiklatId: z.coerce
            .number()
            .int()
            .positive("Metode Diklat wajib diisi"),

        judul: z.string().min(1, "Judul wajib diisi"),

        deskripsi: z.string().nullable().optional(),

        tujuan: z.string().min(1, "Tujuan wajib diisi"),

        targetSasaran: z.string().min(1, "Target Sasaran wajib diisi"),
        lokasi: z.string().min(1, "Lokasi wajib diisi"),

        maksimalKuota: z.coerce
            .number()
            .int()
            .positive("Kuota harus lebih dari 0"),

        tanggalBukaPendaftaran: z.coerce.date({
            invalid_type_error: "Tanggal Buka Pendaftaran tidak valid",
        }),
        tanggalTutupPendaftaran: z.coerce.date({
            invalid_type_error: "Tanggal Tutup Pendaftaran tidak valid",
        }),
        tanggalMulaiAcara: z.coerce.date({
            invalid_type_error: "Tanggal Mulai tidak valid",
        }),
        tanggalSelesaiAcara: z.coerce.date({
            invalid_type_error: "Tanggal Selesai tidak valid",
        }),

        persyaratanPeserta: z.string().min(1, "Persyaratan wajib diisi"),
    })
    .superRefine((data, ctx) => {

        // 2️⃣ buka <= tutup
        if (data.tanggalBukaPendaftaran > data.tanggalTutupPendaftaran) {
            ctx.addIssue({
                path: ["tanggalBukaPendaftaran"],
                message:
                    "Tanggal buka pendaftaran tidak boleh lebih dari tanggal tutup",
                code: z.ZodIssueCode.custom,
            });

            ctx.addIssue({
                path: ["tanggalTutupPendaftaran"],
                message:
                    "Tanggal tutup pendaftaran harus setelah tanggal buka",
                code: z.ZodIssueCode.custom,
            });
        }

        // 1️⃣ mulai <= selesai
        if (data.tanggalMulaiAcara > data.tanggalSelesaiAcara) {
            ctx.addIssue({
                path: ["tanggalMulaiAcara"],
                message: "Tanggal mulai diklat tidak boleh lebih dari tanggal selesai",
                code: z.ZodIssueCode.custom,
            });

            ctx.addIssue({
                path: ["tanggalSelesaiAcara"],
                message: "Tanggal selesai harus setelah tanggal mulai",
                code: z.ZodIssueCode.custom,
            });
        }

        // 3️⃣ tutup <= mulai diklat
        if (data.tanggalTutupPendaftaran > data.tanggalMulaiAcara) {
            ctx.addIssue({
                path: ["tanggalTutupPendaftaran"],
                message:
                    "Tanggal tutup pendaftaran harus sebelum tanggal mulai diklat",
                code: z.ZodIssueCode.custom,
            });
        }
    });
