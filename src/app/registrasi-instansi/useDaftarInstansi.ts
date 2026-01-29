import { createRegistrasiInstansi } from "@/actions/registrasi-instansi-action";
import { createRegistrasiPicInstansi } from "@/actions/registrasi-pic-instansi-action";
import { sendEmailAction } from "@/actions/send-email-action";
import RegistrasiInstansi from "@/models/RegistrasiInstansi";
import RegistrasiPicInstansi from "@/models/RegistrasiPicInstansi";
import { useState } from "react";
import { z } from "zod";

const RegistrasiInstansiSchema = z.object({
    nama: z.string().nonempty("Nama wajib diisi"),
    email: z.string().email("Email tidak valid"),
    nomorTelepon: z.string().min(10, "Nomor telepon minimum 10 karakter").max(12, "Nomor telepon maksimum 12 karakter"),
    desaKelurahan: z.string().nonempty("Desa/Kelurahan wajib diisi"),
    kecamatan: z.string().nonempty("Kecamatan wajib diisi"),
    kabupatenKota: z.string().nonempty("Kabupaten/Kota wajib diisi"),
    password: z.string().min(8, "Password minimal 8 karakter").max(32, "Password maksimal 32 karakter").nonempty("Password wajib diisi"),
    konfirmasiPassword: z.string().nonempty("Konfirmasi password wajib diisi"),
    alamat: z.string().nonempty("Alamat wajib diisi"),
}).refine((data) => data.password === data.konfirmasiPassword, {
    message: "Password dan konfirmasi password harus sama",
    path: ["konfirmasiPassword"], // error akan muncul di field konfirmasiPassword
});

const RegistrasiPicInstansiSchema = z.object({
    nama: z.string().nonempty("Nama wajib diisi"),
    email: z.string().email("Email tidak valid"),
    nomorTelepon: z.string().min(10, "Nomor telepon minimum 10 karakter").max(12, "Nomor telepon maksimum 12 karakter"),
    jabatan: z.string().nonempty("Jabatan wajib diisi"),
});

export function useDaftarInstansi() {
    const maxStep = 4;
    const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

    function showPicForm() {
        setStep(1);
    }

    function showInstansiForm() {
        setStep(2);
    }

    const emptyPicObject: RegistrasiPicInstansi = {
        nama: "Arry",
        email: "arry@gmail.com",
        nomorTelepon: "081350445065",
        jabatan: "Pranata Komputer"
    }

    const emptyInstansiObject: RegistrasiInstansi = {
        nama: "BPMP Kalsel",
        email: "bpmp@gmail.com",
        nomorTelepon: "08123456789",
        desaKelurahan: "Landasan Ulin Timur",
        kecamatan: "Landasan Ulin",
        kabupatenKota: "Banjarbaru",
        password: "password123",
        konfirmasiPassword: "password123",
        alamat: "Jl."
    }

    const [picInstansi, setPicInstansi] = useState<RegistrasiPicInstansi>(emptyPicObject);
    const [picInstansiErrorMessages, setPicInstansiErrorMessages] = useState<RegistrasiPicInstansi>(emptyPicObject);

    const [instansi, setInstansi] = useState<RegistrasiInstansi>(emptyInstansiObject);
    const [instansiErrorMessages, setInstansiErrorMessages] = useState<RegistrasiInstansi>(emptyInstansiObject);

    const [konfirmasiDataLoading, setKonfirmasiDataLoading] = useState(false);
    const [konfirmasiDataErrorMessage, setKonfirmasiDataErrorMessage] = useState("");

    const [kodeTiketRegistrasi, setKodeTiketRegistrasi] = useState("");

    function onSubmitPicForm() {
        const resultData = RegistrasiPicInstansiSchema.safeParse(picInstansi);

        if (!resultData.success) {
            const errors = resultData.error.flatten().fieldErrors;

            setPicInstansiErrorMessages({
                nama: errors.nama?.[0] || "",
                email: errors.email?.[0] || "",
                nomorTelepon: errors.nomorTelepon?.[0] || "",
                jabatan: errors.jabatan?.[0] || ""
            });

            return;
        }

        setPicInstansiErrorMessages(emptyPicObject);
        setStep(2);
    }

    function onSubmitInstansiForm() {
        const resultData = RegistrasiInstansiSchema.safeParse(instansi);

        if (!resultData.success) {
            const errors = resultData.error.flatten().fieldErrors;

            setInstansiErrorMessages({
                nama: errors.nama?.[0] || "",
                email: errors.email?.[0] || "",
                nomorTelepon: errors.nomorTelepon?.[0] || "",
                desaKelurahan: errors.desaKelurahan?.[0] || "",
                kecamatan: errors.kecamatan?.[0] || "",
                kabupatenKota: errors.kabupatenKota?.[0] || "",
                password: errors.password?.[0] || "",
                konfirmasiPassword: errors.konfirmasiPassword?.[0] || "",
                alamat: errors.alamat?.[0] || ""
            });

            return;
        }

        setInstansiErrorMessages(emptyInstansiObject);
        setStep(3);
    }

    async function onSubmitKonfirmasiData() {
        if (konfirmasiDataLoading) return;

        setKonfirmasiDataLoading(true);

        const registrasiInstansi = await createRegistrasiInstansi(instansi);
        createRegistrasiPicInstansi(picInstansi, registrasiInstansi.data?.id!);

        setKonfirmasiDataLoading(false);

        if (!registrasiInstansi.success) {
            setKonfirmasiDataErrorMessage("Terjadi kesalahan saat mendaftar, silahkan hubungi admin.");

            return;
        }

        setStep(4);

        setKodeTiketRegistrasi(registrasiInstansi.data?.id ?? "-");

        await sendEmailAction({
            toEmail: picInstansi.email,
            subject: "Kode Tiket Registrasi Anda di Diklat BPMP",
            html: `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; background-color: #f9f9f9;">
    <h1 style="color: #2c3e50; text-align: center;">Halo ${instansi.nama} 👋</h1>
    
    <p style="font-size: 16px; color: #333; text-align: center;">
      Terima kasih telah melakukan registrasi. Berikut adalah <strong>Kode Tiket Registrasi</strong> Anda:
    </p>
    
    <div style="text-align: center; margin: 20px 0;">
      <span style="font-size: 24px; font-weight: bold; color: #1abc9c; padding: 10px 20px; border: 2px dashed #1abc9c; border-radius: 6px;">
        ${registrasiInstansi.data?.id}
      </span>
    </div>
    
    <p style="font-size: 16px; color: #333; text-align: center;">
      Silakan cek status registrasi Anda melalui link berikut:
    </p>
    
    <p style="text-align: center; margin: 20px 0;">
      <a href="https://diklatbpmp.web.id/daftar-instansi/cek-status" 
         style="background-color: #1abc9c; color: white; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: bold;">
        Cek Status Registrasi
      </a>
    </p>
    
    <p style="font-size: 14px; color: #777; text-align: center; margin-top: 30px;">
      Jika Anda tidak melakukan registrasi ini, silakan abaikan email ini.
    </p>
  </div>
  `
        });

    }

    return {
        maxStep,
        step,
        showPicForm,
        showInstansiForm,

        picInstansi,
        setPicInstansi,
        picInstansiErrorMessages,
        onSubmitPicForm,

        instansi,
        setInstansi,
        instansiErrorMessages,
        onSubmitInstansiForm,

        onSubmitKonfirmasiData,
        konfirmasiDataErrorMessage,
        konfirmasiDataLoading,
        kodeTiketRegistrasi
    }
} 