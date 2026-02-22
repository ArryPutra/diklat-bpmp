import { z } from "zod";

export const ResetPasswordSchema = z.object({
    passwordSaat: z.string().min(8, "Password minimal 8 karakter"),
    passwordBaru: z.string().min(8, "Password minimal 8 karakter"),
    konfirmasiPassword: z.string()
}).refine((data) => data.passwordBaru === data.konfirmasiPassword, {
    message: "Password tidak cocok",
    path: ["konfirmasiPassword"],
})

export default ResetPasswordSchema