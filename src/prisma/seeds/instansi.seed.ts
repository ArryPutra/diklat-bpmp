import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export default async function instansiSeed() {
    const registrasiInstansiList = await prisma.registrasiInstansi.findMany({
        orderBy: {
            createdAt: "asc",
        },
    });

    for (let i = 0; i < registrasiInstansiList.length; i++) {
        const registrasiInstansi = registrasiInstansiList[i];
        const registrasiPicInstansi = await prisma.registrasiPicInstansi.findUnique({
            where: {
                registrasiInstansiId: registrasiInstansi.id,
            },
        });

        const userInstansi = await auth.api.createUser({
            body: {
                name: registrasiInstansi.nama,
                email: registrasiInstansi.email,
                password: "password123",
                data: {
                    peranId: 2,
                },
            },
        });

        const instansi = await prisma.instansi.create({
            data: {
                registrasiInstansiId: registrasiInstansi.id,
                userId: userInstansi.user.id,
                nomorTelepon: registrasiInstansi.nomorTelepon,
                desaKelurahan: registrasiInstansi.desaKelurahan,
                kecamatan: registrasiInstansi.kecamatan,
                kabupatenKota: registrasiInstansi.kabupatenKota,
                desaKelurahnKode: registrasiInstansi.desaKelurahanKode,
                kecamatanKode: registrasiInstansi.kecamatanKode,
                kabupatenKotaKode: registrasiInstansi.kabupatenKotaKode,
                alamat: registrasiInstansi.alamat,
            },
        });

        if (registrasiPicInstansi) {
            await prisma.picInstansi.create({
                data: {
                    instansiId: instansi.id,
                    registrasiPicInstansiId: registrasiPicInstansi.id,
                    nama: registrasiPicInstansi.nama,
                    email: registrasiPicInstansi.email,
                    nomorTelepon: registrasiPicInstansi.nomorTelepon,
                    jabatan: registrasiPicInstansi.jabatan,
                },
            });
        }

        for (let j = 0; j < 2; j++) {
            const nomorUrutPeserta = j + 1;
            const pesertaUser = await auth.api.createUser({
                body: {
                    name: `Peserta ${i + 1}-${nomorUrutPeserta}`,
                    email: `peserta.instansi${i + 1}.${nomorUrutPeserta}@gmail.com`,
                    password: "password123",
                    data: {
                        peranId: 3,
                    },
                },
            });

            await prisma.peserta.create({
                data: {
                    userId: pesertaUser.user.id,
                    instansiId: instansi.id,
                    nik: `6301${String(i + 1).padStart(2, "0")}${String(nomorUrutPeserta).padStart(2, "0")}12345678`,
                    jabatan: `Staf ${nomorUrutPeserta}`,
                    nomorTelepon: `081300${String(i + 1).padStart(3, "0")}${String(nomorUrutPeserta).padStart(3, "0")}`,
                    jenisKelamin: nomorUrutPeserta % 2 === 0 ? "Wanita" : "Pria",
                    tanggalLahir: new Date("1995-01-01"),
                    tempatLahir: "Banjarmasin",
                    alamat: `Alamat Peserta ${i + 1}-${nomorUrutPeserta}`,
                },
            });
        }
    }
}