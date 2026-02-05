import prisma from "@/lib/prisma"
import randomInt from "@/utils/randomInt"

export default async function diklatSeed() {
    for (let i = 0; i < 100; i++) {
        await prisma.diklat.create({
            data: {
                judul: `Diklat ${i + 1}`,
                metodeDiklatId: randomInt(1, 3),
                maksimalKuota: 100,
                tanggalMulaiAcara: new Date(),
                tanggalSelesaiAcara: new Date(),
                tanggalBukaPendaftaran: new Date(),
                tanggalTutupPendaftaran: new Date(),
                deskripsi: `Deskripsi diklat ${i + 1}`,
                tujuan: `Tujuan diklat ${i + 1}`,
                targetSasaran: `Target Sasaran diklat ${i + 1}`
            }
        })
    }
}