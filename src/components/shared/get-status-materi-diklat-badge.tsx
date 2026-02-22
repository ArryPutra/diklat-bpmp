"use client"

import { Badge } from "@/components/ui/badge";
import { getStatusMateriDiklat } from "@/utils/getStatusMateriDiklat";

export default function GetStatusMateriDiklatBadge({
    materi,
}: {
    materi: any
}) {
    const status = getStatusMateriDiklat(materi);

    if (!status) return null;

    if (status === "sedang-berlangsung") {
        return <Badge className="bg-green-500">Sedang Berlangsung</Badge>;
    }

    if (status === "dijadwalkan") {
        return <Badge className="bg-amber-500">Dijadwalkan</Badge>;
    }

    return <Badge className="bg-blue-500">Sudah Selesai</Badge>;
}
