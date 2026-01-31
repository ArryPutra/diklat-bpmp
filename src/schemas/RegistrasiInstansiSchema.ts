import { z } from "zod";

export const RegistrasiInstansiSchema = z.object({
    nama: z.string().nonempty("Nama wajib diisi"),
    email: z.string().email("Email tidak valid"),
    nomorTelepon: z.string().min(10, "Nomor telepon minimum 10 karakter").max(12, "Nomor telepon maksimum 12 karakter"),
    desaKelurahan: z.string().nonempty("Desa/Kelurahan wajib diisi"),
    kecamatan: z.string().nonempty("Kecamatan wajib diisi"),
    kabupatenKota: z.string().nonempty("Kabupaten/Kota wajib diisi"),
    desaKelurahanKode: z.string().nonempty("Kode Desa/Kelurahan wajib diisi"),
    kecamatanKode: z.string().nonempty("Kode Kecamatan wajib diisi"),
    kabupatenKotaKode: z.string().nonempty("Kode Kabupaten/Kota wajib diisi"),
    password: z.string().min(8, "Password minimal 8 karakter").max(32, "Password maksimal 32 karakter").nonempty("Password wajib diisi"),
    konfirmasiPassword: z.string().nonempty("Konfirmasi password wajib diisi"),
    alamat: z.string().nonempty("Alamat wajib diisi"),
}).refine((data) => data.password === data.konfirmasiPassword, {
    message: "Password dan konfirmasi password harus sama",
    path: ["konfirmasiPassword"],
});

export default RegistrasiInstansiSchema;