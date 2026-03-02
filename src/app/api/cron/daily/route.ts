import prisma from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
    const cronSecret = process.env.CRON_SECRET;
    const authorization = req.headers.get("authorization");
    const isAuthorizedBySecret = Boolean(
        cronSecret && authorization === `Bearer ${cronSecret}`
    );
    const isLegacyCronHeader = req.headers.get("x-vercel-cron") === "1";
    const isDev = process.env.NODE_ENV === "development";
    const isCron = isAuthorizedBySecret || isLegacyCronHeader || isDev;

    if (!isCron) {
        return new Response("Forbidden", { status: 403 });
    }

    try {
        const now = new Date(); // waktu sekarang (UTC)
        const startOfToday = new Date(now);
        startOfToday.setUTCHours(0, 0, 0, 0);

        const endOfToday = new Date(now);
        endOfToday.setUTCHours(23, 59, 59, 999);

        const result = await prisma.$transaction([
            // ======================
            // DIJADWALKAN (1)
            // ======================
            prisma.diklat.updateMany({
                where: {
                    tanggalBukaPendaftaran: { gt: endOfToday },
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
                    tanggalBukaPendaftaran: { lte: endOfToday },
                    tanggalTutupPendaftaran: { gte: startOfToday },
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
                    tanggalTutupPendaftaran: { lt: startOfToday },
                    statusPendaftaranDiklatId: { not: 3 },
                },
                data: {
                    statusPendaftaranDiklatId: 3,
                },
            }),

            // ======================
            // BELUM DIMULAI (1)
            // ======================
            prisma.diklat.updateMany({
                where: {
                    tanggalMulaiAcara: { gt: endOfToday },
                    statusPelaksanaanAcaraDiklatId: { not: 1 },
                },
                data: {
                    statusPelaksanaanAcaraDiklatId: 1,
                },
            }),

            // ======================
            // SEDANG BERLANGSUNG (2)
            // ======================
            prisma.diklat.updateMany({
                where: {
                    tanggalMulaiAcara: { lte: endOfToday },
                    tanggalSelesaiAcara: { gte: startOfToday },
                    statusPelaksanaanAcaraDiklatId: { not: 2 },
                },
                data: {
                    statusPelaksanaanAcaraDiklatId: 2,
                },
            }),

            // ======================
            // SELESAI (3)
            // ======================
            prisma.diklat.updateMany({
                where: {
                    tanggalSelesaiAcara: { lt: startOfToday },
                    statusPelaksanaanAcaraDiklatId: { not: 3 },
                },
                data: {
                    statusPelaksanaanAcaraDiklatId: 3,
                },
            }),
        ]);

        return Response.json({
            ok: true,
            updated: {
                scheduled: result[0].count,
                opened: result[1].count,
                closed: result[2].count,
                notStarted: result[3].count,
                running: result[4].count,
                finished: result[5].count,
            },
            executedAt: now,
        });
    } catch (error) {
        console.error("[CRON_DAILY_ERROR]", error);
        return Response.json({ ok: false, message: "Cron failed" }, { status: 500 });
    }
}
