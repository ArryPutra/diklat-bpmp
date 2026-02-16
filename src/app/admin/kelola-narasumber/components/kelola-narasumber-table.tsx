"use client"

import { deleteDiklatAction } from "@/actions/diklat-action";
import LoadingScreen from "@/components/shared/loading-screen";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getRowNumber } from "@/utils/getRowNumber";
import Link from "next/link";
import { useActionState } from "react";
import { BiInfoCircle } from "react-icons/bi";

export default function KelolaNarasumberTable({
    daftarNarasumber
}: {
    daftarNarasumber: any[]
}) {

    const [stateDeleteDiklat, formActionDeleteDiklat, pendingDeleteDiklat] =
        useActionState(deleteDiklatAction, null);

    return (
        <>
            <LoadingScreen isLoading={pendingDeleteDiklat} />

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>No.</TableHead>
                        <TableHead>Nama</TableHead>
                        <TableHead>Kontak</TableHead>
                        <TableHead>Jenis Kelamin</TableHead>
                        <TableHead>Aksi</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {daftarNarasumber.length > 0 ?
                        daftarNarasumber.map((narasumber: any, index: number) =>
                            <TableRow key={index}>
                                <TableCell>{getRowNumber(index, 1, 10)}</TableCell>
                                <TableCell className="font-semibold">
                                    {narasumber.user.name}
                                </TableCell>
                                <TableCell>
                                    <span className="font-semibold">{narasumber.nomorTelepon}</span>
                                    <br />
                                    {narasumber.user.email}
                                </TableCell>
                                <TableCell>
                                    {narasumber.jenisKelamin}
                                </TableCell>
                                <TableCell className="space-x-2">
                                    <Link href={`/admin/kelola-narasumber/${narasumber.id}`}>
                                        <Button size='icon-sm' variant='outline'><BiInfoCircle /></Button>
                                    </Link>
                                </TableCell>
                            </TableRow>
                        )
                        :
                        <TableRow>
                            <TableCell colSpan={99} className="text-center py-4">
                                Tidak ada data
                            </TableCell>
                        </TableRow>
                    }
                </TableBody>
            </Table>

            {/* <PaginationWithLinks
            page={}/> */}
        </>
    )
}
