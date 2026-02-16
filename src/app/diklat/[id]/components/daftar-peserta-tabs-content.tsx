"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { TabsContent } from "@/components/ui/tabs"
import { formatDateTimeId } from "@/utils/dateFormatted"

export default function DaftarPesertaTabsContent({
    daftarPesertaDiklat
}: {
    daftarPesertaDiklat: any[]
}) {
    return (
        <TabsContent value="daftarPeserta">

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>No.</TableHead>
                        <TableHead>Nama</TableHead>
                        <TableHead>Asal Instansi</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Waktu Daftar</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {
                        daftarPesertaDiklat.length > 0 ?
                            daftarPesertaDiklat.map((dataPeserta, index) => (
                                <TableRow key={index}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell className="font-semibold">{dataPeserta.peserta.user.name}</TableCell>
                                    <TableCell>{dataPeserta.peserta.instansi.user.name}</TableCell>
                                    <TableCell>{dataPeserta.statusDaftarPesertaDiklat.nama}</TableCell>
                                    <TableCell>{formatDateTimeId(dataPeserta.createdAt)}</TableCell>
                                </TableRow>
                            ))
                            :
                            <TableRow>
                                <TableHead colSpan={99} className="text-center py-6">Tidak Ada Peserta</TableHead>
                            </TableRow>
                    }
                </TableBody>
            </Table>

        </TabsContent>
    )
}
