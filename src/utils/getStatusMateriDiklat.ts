import { getCurrentHourMinute } from "@/utils/getCurrentHourMinute";

type MateriDiklatLike = {
    tanggalPelaksanaan: Date | string;
    waktuMulai: string;
    waktuSelesai: string;
}

export type StatusMateriDiklat = "sedang-berlangsung" | "dijadwalkan" | "sudah-selesai";

export function getStatusMateriDiklat(
    materi?: MateriDiklatLike | null,
    tanggalAcuan: Date = new Date()
): StatusMateriDiklat | null {
    if (!materi) return null;

    const today = new Date(tanggalAcuan);
    const materiDate = new Date(materi.tanggalPelaksanaan);

    today.setHours(0, 0, 0, 0);
    materiDate.setHours(0, 0, 0, 0);

    const currentTime = getCurrentHourMinute(tanggalAcuan);

    const isToday = materiDate.getTime() === today.getTime();
    const isFuture = materiDate.getTime() > today.getTime();

    if (
        isToday &&
        materi.waktuMulai <= currentTime &&
        materi.waktuSelesai >= currentTime
    ) {
        return "sedang-berlangsung";
    }

    if ((isToday && materi.waktuMulai > currentTime) || isFuture) {
        return "dijadwalkan";
    }

    return "sudah-selesai";
}
