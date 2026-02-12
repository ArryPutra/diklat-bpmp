import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { dateRangeFormatted, formatDateId } from "@/utils/dateFormatted";
import Link from "next/link";
import { BiBook, BiCalendar, BiLocationPlus, BiRightArrowAlt, BiTargetLock, BiUser } from "react-icons/bi";

export function DiklatCard({
    diklat
}: {
    diklat: any
}) {

    return (
        <Card className={`hover:shadow-lg duration-300 pt-0 overflow-hidden`}>
            <div className={`w-full h-1 ${diklat.statusPendaftaranDiklat.backgroundColor}`}></div>
            <CardHeader>
                <Badge className={`mb-1 ${diklat.statusPendaftaranDiklat.backgroundColor}`}>
                    {diklat.statusPendaftaranDiklat.nama}
                </Badge>
                <CardTitle className="text-xl line-clamp-2">{diklat.judul}</CardTitle>
                <CardDescription className="line-clamp-2">{diklat.tujuan}</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex gap-3 flex-wrap mb-5">
                    <Badge variant='outline'>
                        <BiBook /> {diklat.metodeDiklat.nama}
                    </Badge>
                    <Badge variant='outline'>
                        <BiTargetLock /> {diklat.targetSasaran}
                    </Badge>
                    <Badge variant='outline'>
                        <BiUser /> {diklat.maksimalKuota} Peserta
                    </Badge>
                </div>
                <div className="space-y-2 border p-4 rounded-xl mb-4">
                    <div className="flex items-center gap-2 text-xs font-semibold">
                        <BiCalendar /> <span>Kegiatan: {dateRangeFormatted(diklat.tanggalMulaiAcara, diklat.tanggalSelesaiAcara)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-semibold">
                        <BiLocationPlus /> <span>Lokasi: {diklat.lokasi}</span>
                    </div>
                </div>
                {
                    diklat.statusPendaftaranDiklat.id === 1 &&
                    <Alert className="mb-4">
                        <BiCalendar />
                        <AlertDescription>Tanggal buka pendaftaran</AlertDescription>
                        <AlertTitle>{formatDateId(diklat.tanggalBukaPendaftaran)}</AlertTitle>
                    </Alert>
                }
                {
                    diklat.statusPendaftaranDiklat.id === 2 &&
                    <Alert className="mb-4" variant='danger'>
                        <BiCalendar />
                        <AlertDescription>Tanggal terakhir pendaftaran</AlertDescription>
                        <AlertTitle>{formatDateId(diklat.tanggalTutupPendaftaran)}</AlertTitle>
                    </Alert>
                }
                {
                    diklat.statusPendaftaranDiklat.id === 3 &&
                    <Alert className="mb-4" variant='destructive'>
                        <BiCalendar />
                        <AlertDescription>Tanggal terakhir pendaftaran</AlertDescription>
                        <AlertTitle>{formatDateId(diklat.tanggalTutupPendaftaran)}</AlertTitle>
                    </Alert>
                }
            </CardContent>
            <CardFooter className="flex justify-between mt-auto">
                <Link href={`/diklat/${diklat.id}`}>
                    <Button className={`w-full ${diklat.statusPendaftaranDiklat.backgroundColor} hover:${diklat.statusPendaftaranDiklat.backgroundColor}`}>
                        Lihat Detail <BiRightArrowAlt />
                    </Button>
                </Link>
            </CardFooter>
        </Card >
    )
}
