import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { BiBookOpen, BiCheckDouble, BiDownload, BiSolidGraduation } from "react-icons/bi";

export default function Peserta_DiklatHasilAkhir_View({
  diklatId,
  dataRekap
}: {
  diklatId: string
  dataRekap: {
    totalKehadiran: string
    totalMateriSelesai: string
    statusKelulusan: string
  }
}) {
  return (
    <>
      <div className='flex gap-3 flex-wrap'>
        <Link href={`/peserta/diklat/${diklatId}/materi-diklat`}>
          <Button size='sm' variant='outline'>Materi Diklat</Button>
        </Link>
        <Button size='sm'>Hasil Akhir</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Rekap Hasil Akhir Diklat</CardTitle>
          <CardDescription>Ringkasan hasil akhir keikutsertaan Anda dalam diklat ini.</CardDescription>
        </CardHeader>
        <CardContent>

          <div className="grid grid-cols-3 gap-4 max-lg:grid-cols-2 max-sm:grid-cols-1">
            <Card>
              <CardHeader>
                <CardAction>
                  <BiCheckDouble />
                </CardAction>
                <CardDescription>Kehadiran</CardDescription>
                <CardTitle>{dataRekap.totalKehadiran}</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardAction>
                  <BiBookOpen />
                </CardAction>
                <CardDescription>Materi Selesai</CardDescription>
                <CardTitle>{dataRekap.totalMateriSelesai}</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardAction>
                  <BiSolidGraduation />
                </CardAction>
                <CardDescription>Status Kelulusan</CardDescription>
                <CardTitle>{dataRekap.statusKelulusan}</CardTitle>
              </CardHeader>
            </Card>
          </div>
        </CardContent>

        <CardFooter>
          <Button>
            <BiDownload />
            Download Sertifikat
          </Button>
        </CardFooter>
      </Card>
    </>
  )
}
