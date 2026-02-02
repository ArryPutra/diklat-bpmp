"use client"

import { getDesaKelurahanAction, getKabupatenKotaAction, getKecamatanAction } from "@/actions/data-wilayah-action";
import { createRegistrasiInstansiAction, deleteRegistrasiInstansiAction } from "@/actions/registrasi-instansi-action";
import { createRegistrasiPicInstansi } from "@/actions/registrasi-pic-instansi-action";
import { sendEmailAction } from "@/actions/send-email-action";
import { CreateRegistrasiInstansiSchema } from "@/schemas/registrasi-instansi.schema";
import { RegistrasiPicInstansiSchema } from "@/schemas/registrasi-pic-instansi.schema";
import { useEffect, useState } from "react";
import RegistrasiInstansi from "../../models/RegistrasiInstansi";
import RegistrasiPicInstansi from "../../models/RegistrasiPicInstansi";

export function useDaftarInstansi() {
    const maxStep = 4;
    const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

    const [daftarKabupatenKota, setDaftarKabupatenKota] =
        useState<Array<{ code: string, name: string }>>([]);
    const [kabupatenKotaKode, setKabupatenKotaKode] = useState<string>("");

    const [daftarKecamatan, setDaftarKecamatan] =
        useState<Array<{ code: string, name: string }>>([]);
    const [kecamatanKode, setKecamatanKode] = useState<string>("");

    const [daftarDesaKelurahan, setDaftarDesaKelurahan] =
        useState<Array<{ code: string, name: string }>>([]);

    function showPicForm() {
        setStep(1);
    }

    function showInstansiForm() {
        setStep(2);
        setKonfirmasiDataErrorMessage("");
    }

    const emptyRegistrasiPicInstansiObject: RegistrasiPicInstansi = {
        nama: "Arry Kusuma Putra",
        email: "arrykusumaputra@gmail.com",
        nomorTelepon: "081350445065",
        jabatan: "Pranata Komputer"
    }

    const emptyRegistrasiInstansiObject: RegistrasiInstansi = {
        nama: "BPMP Provinsi Kalsel",
        email: "bpmpkalsel@kemendikdasmen.ac.id",
        nomorTelepon: "08123456789",
        desaKelurahan: "",
        kecamatan: "",
        kabupatenKota: "",
        desaKelurahanKode: "",
        kecamatanKode: "",
        kabupatenKotaKode: "",
        password: "password123",
        konfirmasiPassword: "password123",
        alamat: "Jl. Gotong Royong"
    }

    const [picInstansi, setPicInstansi] = useState<RegistrasiPicInstansi>(emptyRegistrasiPicInstansiObject);
    const [picInstansiErrorMessages, setPicInstansiErrorMessages] = useState<RegistrasiPicInstansi>(emptyRegistrasiPicInstansiObject);

    const [instansi, setInstansi] = useState<RegistrasiInstansi>(emptyRegistrasiInstansiObject);
    const [instansiErrorMessages, setInstansiErrorMessages] = useState<RegistrasiInstansi>(emptyRegistrasiInstansiObject);

    const [konfirmasiDataLoading, setKonfirmasiDataLoading] = useState<boolean>(false);
    const [konfirmasiDataErrorMessage, setKonfirmasiDataErrorMessage] = useState<string>("");

    const [kodeTiketRegistrasi, setKodeTiketRegistrasi] = useState<string>("");

    useEffect(() => {
        async function loadKabupatenKota() {
            const data = await getKabupatenKotaAction();
            setDaftarKabupatenKota(data)
        }
        loadKabupatenKota()
    }, [])

    useEffect(() => {
        setInstansi(prev => ({
            ...prev,
            kecamatan: "",
            kecamatanKode: "",
            desaKelurahan: "",
            desaKelurahanKode: ""
        }));
        setDaftarKecamatan([]);
        setDaftarDesaKelurahan([]);
        async function loadKecamatan() {
            const data = await getKecamatanAction(kabupatenKotaKode!);
            setDaftarKecamatan(data)
        }
        loadKecamatan()
    }, [kabupatenKotaKode])

    useEffect(() => {
        setInstansi(prev => ({
            ...prev,
            desaKelurahan: "",
            desaKelurahanKode: ""
        }));
        setDaftarDesaKelurahan([]);
        async function loadDesaKelurahan() {
            setPicInstansi(prev => ({
                ...prev,
                desaKelurahan: "",
                desaKelurahanKode: ""
            }));
            const data = await getDesaKelurahanAction(kecamatanKode!);
            setDaftarDesaKelurahan(data)
        }
        loadDesaKelurahan()
    }, [kecamatanKode])

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

        setPicInstansiErrorMessages(emptyRegistrasiPicInstansiObject);
        setStep(2);
    }

    function onSubmitInstansiForm() {
        const resultData = CreateRegistrasiInstansiSchema.safeParse(instansi);

        if (!resultData.success) {
            const errors = resultData.error.flatten().fieldErrors;

            setInstansiErrorMessages({
                nama: errors.nama?.[0] || "",
                email: errors.email?.[0] || "",
                nomorTelepon: errors.nomorTelepon?.[0] || "",
                desaKelurahan: errors.desaKelurahan?.[0] || "",
                kecamatan: errors.kecamatan?.[0] || "",
                kabupatenKota: errors.kabupatenKota?.[0] || "",
                desaKelurahanKode: errors.desaKelurahanKode?.[0] || "",
                kecamatanKode: errors.kecamatanKode?.[0] || "",
                kabupatenKotaKode: errors.kabupatenKotaKode?.[0] || "",
                password: errors.password?.[0] || "",
                konfirmasiPassword: errors.konfirmasiPassword?.[0] || "",
                alamat: errors.alamat?.[0] || ""
            });

            return;
        }

        setInstansiErrorMessages(emptyRegistrasiInstansiObject);
        setStep(3);
    }

    async function onSubmitKonfirmasiData() {
        if (konfirmasiDataLoading) return; // mencegah double click

        setKonfirmasiDataLoading(true);

        const createRegistrasiInstansi = await createRegistrasiInstansiAction(instansi);
        // jika registrasi instansi berhasil dibuat
        if (createRegistrasiInstansi.success) {
            // buat registrasi pic instansi
            const createPicInstansi = await createRegistrasiPicInstansi(picInstansi, createRegistrasiInstansi.data?.id!);

            // jika registrasi pic instansi gagal dibuat
            if (!createPicInstansi.success) {
                // hapus registrasi instansi tadi
                await deleteRegistrasiInstansiAction(createRegistrasiInstansi.data?.id!);

                setKonfirmasiDataErrorMessage(createRegistrasiInstansi.message ?? "Terjadi kesalahan");
                setKonfirmasiDataLoading(false);

                return;
            }
        }
        // jika registrasi instansi gagal
        else {
            setKonfirmasiDataErrorMessage(createRegistrasiInstansi.message ?? "Terjadi kesalahan");
            setKonfirmasiDataLoading(false);

            return;
        }


        setStep(4);

        setKodeTiketRegistrasi(createRegistrasiInstansi.data?.id ?? "-");

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
        ${createRegistrasiInstansi.data?.id}
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
        kodeTiketRegistrasi,

        daftarKabupatenKota,
        setKabupatenKotaKode,
        daftarKecamatan,
        setKecamatanKode,
        daftarDesaKelurahan,
    }
} 