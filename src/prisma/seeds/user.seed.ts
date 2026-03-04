import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export default async function userSeed() {
    // ADMIN
    await auth.api.createUser({
        body: {
            name: "Admin BPMP",
            email: "admin@gmail.com",
            password: "password123",
            role: "admin",
            data: {
                peranId: 1,
            }
        }
    })

    // INSTANSI
    const registrasiInstansi = await prisma.registrasiInstansi.create({
        data: {
            statusRegistrasiInstansiId: 2, // diterima
            nama: `BPMP Provinsi Kalsel`,
            email: `bpmpkalsel@gmail.com`,
            nomorTelepon: `081234567890`,
            kabupatenKota: `Banjarbaru`,
            kecamatan: `Banjarbaru Utara`,
            desaKelurahan: `Loktabat Utara`,
            kabupatenKotaKode: `0`,
            kecamatanKode: `0`,
            desaKelurahanKode: `0`,
            password: "password123",
            alamat: `Jl. Gotong Royong No. 1, Loktabat Utara, Banjarbaru Utara, Kota Banjarbaru, Kalimantan Selatan 70714`
        }
    })

    const registrasiPicInstansi = await prisma.registrasiPicInstansi.create({
        data: {
            nama: `Pic BPMP Kalsel`,
            email: `picinstansi@gmail.com`,
            nomorTelepon: `081234567890`,
            jabatan: `Jabatan Pic Instansi`,
            registrasiInstansiId: registrasiInstansi.id
        }
    })

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

    // PESERTA
    const peserta = await auth.api.createUser({
        body: {
            name: "Arry Kusuma Putra",
            email: "arrykusumaputra@gmail.com",
            password: "password123",
            data: {
                peranId: 3,
            },
        }
    })

    await prisma.peserta.create({
        data: {
            alamat: "Alamat",
            jabatan: "Full Stack Web Developer",
            jenisKelamin: "Pria",
            nik: "1234567891011121",
            nomorTelepon: "081234567890",
            tanggalLahir: new Date("1995-01-01"),
            tempatLahir: "Banjarmasin",
            userId: peserta.user.id,
            instansiId: instansi.id,
        }
    })

    // NARASUMBER
    const narasumber = await auth.api.createUser({
        body: {
            name: "Farhan Aryo Pangetsu",
            email: "farhanaryopangetsu@gmail.com",
            password: "password123",
            data: {
                peranId: 4, // narasumber
            }
        }
    })

    await prisma.narasumber.create({
        data: {
            userId: narasumber.user.id,
            nomorTelepon: "081234567890",
            jenisKelamin: "Pria",
        }
    })
}