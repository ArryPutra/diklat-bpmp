import Instansi from "@/models/Instansi";
import PicInstansi from "@/models/PicInstansi";
import InstansiSchema from "@/schemas/Instansi";
import PicInstansiSchema from "@/schemas/PicInstansi";
import { useState } from "react";

export function useDaftarInstansi() {
    const [step, setStep] = useState(1);

    function onBackStep() {
        setStep(1);
    }

    const picObject: PicInstansi = {
        nama: "",
        email: "",
        nomorTelepon: "",
        jabatan: ""
    }

    const instansiObject: Instansi = {
        nama: "",
        email: "",
        nomorTelepon: "",
        desaKelurahan: "",
        kecamatan: "",
        kabupatenKota: "",
        password: "",
        konfirmasiPassword: "",
        alamat: ""
    }

    const [picInstansi, setPicInstansi] = useState<PicInstansi>(picObject);
    const [picInstansiErrorMessages, setPicInstansiErrorMessages] = useState<PicInstansi>(picObject);

    const [instansi, setInstansi] = useState<Instansi>(instansiObject);
    const [instansiErrorMessages, setInstansiErrorMessages] = useState<Instansi>(instansiObject);

    function onSubmitPicForm() {
        const resultData = PicInstansiSchema.safeParse(picInstansi);

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

        setStep(2);
    }

    function onSubmitInstansiForm() {
        const resultData = InstansiSchema.safeParse(instansi);

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
    }

    return {
        step,
        onBackStep,

        picInstansi,
        setPicInstansi,
        picInstansiErrorMessages,
        onSubmitPicForm,

        instansi,
        setInstansi,
        instansiErrorMessages,
        onSubmitInstansiForm
    }
} 