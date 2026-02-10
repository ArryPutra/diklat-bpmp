import { z } from "zod";

export const UpdateInstansiSchema = z.object({
    password: z.string().min(8, "Password minimal 8 karakter").max(32, "Password maksimal 32 karakter").optional().or(z.literal("")),
    konfirmasiPassword: z.string().nonempty("Konfirmasi password wajib diisi"),
}).refine((data) => data.password === data.konfirmasiPassword, {
    message: "Password dan konfirmasi password harus sama",
    path: ["konfirmasiPassword"],
});