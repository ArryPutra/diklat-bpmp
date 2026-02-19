"use client"

import { Badge } from "@/components/ui/badge";
import { getCurrentHourMinute } from "@/utils/getCurrentHourMinute";

export default function GetStatusMateriDiklatBadge({
    materi,
}: {
    materi: any
}) {
    if (!materi) return null;

    const today = new Date();
    const materiDate = new Date(materi.tanggalPelaksanaan);

    // Normalize date (tanpa jam)
    today.setHours(0, 0, 0, 0);
    materiDate.setHours(0, 0, 0, 0);

    const currentTime = getCurrentHourMinute(); // format misal: "14:30"

    const isToday = materiDate.getTime() === today.getTime();
    const isFuture = materiDate.getTime() > today.getTime();

    if (
        isToday &&
        materi.waktuMulai <= currentTime &&
        materi.waktuSelesai >= currentTime
    ) {
        return <Badge className="bg-green-500">Sedang Berlangsung</Badge>;
    }

    if (
        (isToday && materi.waktuMulai > currentTime) ||
        isFuture
    ) {
        return <Badge className="bg-amber-500">Dijadwalkan</Badge>;
    }

    return <Badge className="bg-blue-500">Sudah Selesai</Badge>;
}
