import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

async function main() {
    await prisma.statusRegistrasiInstansi.createMany({
        data: [
            { nama: "Diajukan", warna: "bg-yellow-500 " },
            { nama: "Diterima", warna: "bg-blue-500 " },
            { nama: "Ditolak", warna: "bg-red-500 " },
        ]
    })

    await prisma.peran.createMany({
        data: [
            { nama: "Admin" },
            { nama: "Instansi" },
            { nama: "Peserta" },
            { nama: "Narasumber" },
        ]
    })

    await auth.api.signUpEmail({
        body: {
            name: "Admin BPMP",
            email: "admin@gmail.com",
            password: "password123",
            peranId: 1
        }
    });

    // for (let i = 0; i < 100; i++) {
    //     const instansi = await prisma.registrasiInstansi.create({
    //         data: {
    //             nama: `Instansi ${i + 1}`,
    //             email: `instansi${i + 1}@gmail.com`,
    //             nomorTelepon: `081234567890${i + 1}`,
    //             kabupatenKota: `Kabupaten ${i + 1}`,
    //             kecamatan: `Kecamatan ${i + 1}`,
    //             desaKelurahan: `Desa ${i + 1}`,
    //             kabupatenKotaKode: `Kabupaten ${i + 1}`,
    //             kecamatanKode: `Kecamatan ${i + 1}`,
    //             desaKelurahanKode: `Desa ${i + 1}`,
    //             password: "password123",
    //             alamat: `Alamat ${i + 1}`
    //         }
    //     })

    //     await prisma.registrasiPicInstansi.createMany({
    //         data: {
    //             nama: `Pic Instansi ${i + 1}`,
    //             email: `picinstansi${i + 1}@gmail.com`,
    //             nomorTelepon: `081234567890${i + 1}`,
    //             jabatan: `Jabatan ${i + 1}`,
    //             registrasiInstansiId: instansi.id
    //         }
    //     })
    // }
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })