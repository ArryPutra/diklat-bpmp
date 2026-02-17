"use client"

import { ContentCanvas } from "@/components/layouts/auth-layout";
import LoadingScreen from "@/components/shared/loading-screen";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTransition } from "react";
import { BiBookOpen, BiUser } from "react-icons/bi";

export default function Instansi_DiklatPeserta_View({
    daftarDiklatDiikuti
}: {
    daftarDiklatDiikuti: any[]
}) {
    const [isPending, startTransition] = useTransition()
    const router = useRouter()

    function handleDiklatClick(diklatId: string) {
        startTransition(() => {
            router.push(`/instansi/diklat/peserta/${diklatId}`)
        })
    }

    return (
        <ContentCanvas>
            <LoadingScreen isLoading={isPending}/>
            <div>
                <h1 className="font-semibold">Daftar Diklat Diikuti</h1>
                <p className="text-sm text-gray-500">Berikut daftar diklat yang pernah atau sedang diikuti</p>
            </div>

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>No.</TableHead>
                        <TableHead>Judul</TableHead>
                        <TableHead>Peserta</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Aksi</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {
                        daftarDiklatDiikuti.length > 0 ?
                            daftarDiklatDiikuti.map((dataDiklat, index) => (
                                <TableRow key={index}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell className="font-semibold">{dataDiklat.judul}</TableCell>
                                    <TableCell>{dataDiklat.pesertaDiklat.length} Peserta</TableCell>
                                    <TableCell>
                                        <Badge className={`${dataDiklat.statusPendaftaranDiklat.backgroundColor}`}>
                                            {dataDiklat.statusPendaftaranDiklat.nama}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="space-x-2">
                                        <Button
                                            size='sm'
                                            onClick={() => handleDiklatClick(dataDiklat.id)}>
                                            <BiUser /> Peserta
                                        </Button>
                                        <Link href={`/diklat/${dataDiklat.id}`} target="_blank">
                                            <Button size='sm' variant='outline'><BiBookOpen /> Diklat</Button>
                                        </Link>
                                    </TableCell>
                                </TableRow>
                            ))
                            :
                            <TableRow>
                                <TableCell colSpan={4} className="text-center">Tidak ada diklat diikuti</TableCell>
                            </TableRow>
                    }
                </TableBody>
            </Table>
        </ContentCanvas>
    )
}
