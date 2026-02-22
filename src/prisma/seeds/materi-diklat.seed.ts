import prisma from "@/lib/prisma";

export default async function materiDiklatSeed() {
    const daftarDiklat = await prisma.diklat.findMany({
        orderBy: {
            createdAt: "asc",
        },
    });

    const daftarNarasumber = await prisma.narasumber.findMany({
        orderBy: {
            id: "asc",
        },
    });

    if (daftarDiklat.length === 0 || daftarNarasumber.length === 0) {
        return;
    }

    for (let i = 0; i < daftarDiklat.length; i++) {
        const diklat = daftarDiklat[i];

        for (let sesi = 0; sesi < 2; sesi++) {
            const narasumber = daftarNarasumber[(i + sesi) % daftarNarasumber.length];
            const tanggalPelaksanaan = new Date(diklat.tanggalMulaiAcara);
            tanggalPelaksanaan.setDate(tanggalPelaksanaan.getDate() + sesi);

            await prisma.materiDiklat.create({
                data: {
                    diklatId: diklat.id,
                    narasumberId: narasumber.id,
                    judul: `Materi ${sesi + 1} - ${diklat.judul}`,
                    deskripsi: `Pembahasan sesi ${sesi + 1} untuk ${diklat.judul}`,
                    linkMateri: `https://example.com/materi/${diklat.id}/${sesi + 1}`,
                    lokasi: diklat.lokasi,
                    tanggalPelaksanaan,
                    waktuMulai: sesi === 0 ? "08:00" : "13:00",
                    waktuSelesai: sesi === 0 ? "11:00" : "16:00",
                },
            });
        }
    }
}