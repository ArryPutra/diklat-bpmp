import { z } from "@/lib/zod-i18n";

export const PicInstansiSchema = z.object({
    nama: z.string().nonempty("Nama wajib diisi"),
    email: z.string().email("Email tidak valid"),
    nomorTelepon: z.string().min(10, "Nomor telepon minimum 10 karakter").max(12, "Nomor telepon maksimum 12 karakter"),
    jabatan: z.string().nonempty("Jabatan wajib diisi"),
});

export default PicInstansiSchema;