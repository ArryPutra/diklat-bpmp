import prisma from "@/lib/prisma";

export async function GET(req: Request) {
    const isCron = req.headers.get("x-vercel-cron") ||
        process.env.NODE_ENV === "development";

    if (!isCron) {
        return new Response("Forbidden", { status: 403 });
    }

    const now = new Date(); // pastikan UTC di DB

    const result = await prisma.$transaction([
        // ======================
        // DIJADWALKAN (1)
        // ======================
        prisma.diklat.updateMany({
            where: {
                tanggalBukaPendaftaran: { gt: now },
                statusPendaftaranDiklatId: { not: 1 },
            },
            data: {
                statusPendaftaranDiklatId: 1,
            },
        }),

        // ======================
        // DIBUKA (2)
        // ======================
        prisma.diklat.updateMany({
            where: {
                tanggalBukaPendaftaran: { lte: now },
                tanggalTutupPendaftaran: { gte: now },
                statusPendaftaranDiklatId: { not: 2 },
            },
            data: {
                statusPendaftaranDiklatId: 2,
            },
        }),

        // ======================
        // DITUTUP (3)
        // ======================
        prisma.diklat.updateMany({
            where: {
                tanggalTutupPendaftaran: { lt: now },
                statusPendaftaranDiklatId: { not: 3 },
            },
            data: {
                statusPendaftaranDiklatId: 3,
            },
        }),
    ]);

    return Response.json({
        ok: true,
        updated: {
            scheduled: result[0].count,
            opened: result[1].count,
            closed: result[2].count,
        },
        executedAt: now,
    });
}
