import { APP_TIMEZONE, getDateKeyInTimeZone } from "@/lib/timezone";
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

    const today = getDateKeyInTimeZone(tanggalAcuan, APP_TIMEZONE);
    const materiDate = getDateKeyInTimeZone(materi.tanggalPelaksanaan, APP_TIMEZONE);

    const currentTime = getCurrentHourMinute(tanggalAcuan);

    const isToday = materiDate === today;
    const isFuture = materiDate > today;

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
