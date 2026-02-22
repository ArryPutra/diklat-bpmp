"use client"

import { ContentCanvas } from "@/components/layouts/auth-layout";
import LoadingScreen from "@/components/shared/loading-screen";
import { PaginationWithLinks } from "@/components/shared/pagination-with-links";
import Search from "@/components/shared/search";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { BiDetail, BiUser } from "react-icons/bi";

export default function Admin_VerifikasiPeserta_View({
    daftarDiklatStatusDibuka,
    totalDaftarDiklat
}: {
    daftarDiklatStatusDibuka: any[]
    totalDaftarDiklat: number
}) {
    const router = useRouter()
    const [isPending, startTransition] = useTransition()

    const params = new URLSearchParams(useSearchParams().toString());
    const currentPage = parseInt(params.get("page") ?? "1");

    return (
        <ContentCanvas>
            <LoadingScreen isLoading={isPending} />

            <div className='flex justify-between flex-wrap gap-3'>
                <div>
                    <h1 className='font-bold'>Registrasi Peserta Diklat</h1>
                    <p className='text-sm'>Daftar registrasi peserta diklat yang perlu ditinjau</p>
                </div>
            </div>

            <div className="flex">
                <Search />
            </div>

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>No</TableHead>
                        <TableHead>Judul Diklat</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Jumlah Peserta</TableHead>
                        <TableHead>Aksi</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {
                        daftarDiklatStatusDibuka.length > 0 ?
                            daftarDiklatStatusDibuka.map((diklat, index) => (
                                <TableRow key={index}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell className="font-semibold">{diklat.judul}</TableCell>
                                    <TableCell>
                                        <Badge className={`${diklat.statusPendaftaranDiklat.backgroundColor}`}>{diklat.statusPendaftaranDiklat.nama}</Badge>
                                    </TableCell>
                                    <TableCell>{diklat.pesertaDiklat.length} dari {diklat.maksimalKuota} peserta</TableCell>
                                    <TableCell className="space-x-2">
                                        <Button size='sm'
                                            onClick={() => {
                                                startTransition(() => {
                                                    router.push(`/admin/kelola-diklat/verifikasi-peserta/${diklat.id}`)
                                                })
                                            }}>
                                            <BiUser /> Peserta
                                        </Button>
                                        <Link href={`../diklat/${diklat.id}`} target="_blank">
                                            <Button size='sm' variant='outline'><BiDetail /> Detail</Button>
                                        </Link>
                                    </TableCell>
                                </TableRow>
                            ))
                            :
                            <TableRow>
                                <TableCell colSpan={5} className="text-center">Tidak ada data</TableCell>
                            </TableRow>
                    }
                </TableBody>
                <TableCaption>
                    Menampilkan daftar diklat dengan status Dibuka
                </TableCaption>
            </Table>

            {
                totalDaftarDiklat > 0 &&
                <PaginationWithLinks
                    page={currentPage}
                    pageSize={10}
                    totalCount={totalDaftarDiklat} />
            }
        </ContentCanvas>
    )
}
