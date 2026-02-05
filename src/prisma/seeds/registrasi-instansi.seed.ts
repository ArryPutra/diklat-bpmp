import prisma from "@/lib/prisma"

export default async function registrasiInstansiSeed() {
    for (let i = 0; i < 11; i++) {
        const instansi = await prisma.registrasiInstansi.create({
            data: {
                nama: `Instansi ${i + 1}`,
                email: `instansi${i + 1}@gmail.com`,
                nomorTelepon: `081234567890${i + 1}`,
                kabupatenKota: `Kabupaten ${i + 1}`,
                kecamatan: `Kecamatan ${i + 1}`,
                desaKelurahan: `Desa ${i + 1}`,
                kabupatenKotaKode: `Kabupaten ${i + 1}`,
                kecamatanKode: `Kecamatan ${i + 1}`,
                desaKelurahanKode: `Desa ${i + 1}`,
                password: "password123",
                alamat: `Alamat ${i + 1}`
            }
        })

        await prisma.registrasiPicInstansi.createMany({
            data: {
                nama: `Pic Instansi ${i + 1}`,
                email: `picinstansi${i + 1}@gmail.com`,
                nomorTelepon: `081234567890${i + 1}`,
                jabatan: `Jabatan ${i + 1}`,
                registrasiInstansiId: instansi.id
            }
        })
    }
}