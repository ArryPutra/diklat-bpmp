import { ContentCanvas } from "@/components/layouts/auth-layout";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function VerifikasiPesertaDiklatCanvas() {
    return (
        <ContentCanvas>
            <div className='flex justify-between flex-wrap mb-4 gap-3'>
                <div>
                    <h1 className='font-bold'>Verifikasi Peserta Diklat</h1>
                    <p className='text-sm'>Daftar peserta diklat yang perlu diverifikasi</p>
                </div>
            </div>

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>No</TableHead>
                        <TableHead>Nama Peserta</TableHead>
                        <TableHead>Asal Instansi</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    <TableRow>
                        <TableCell>1</TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </ContentCanvas>
    )
}
