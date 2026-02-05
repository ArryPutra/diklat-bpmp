"use client"

import { ContentCanvas } from "@/components/layouts/auth-layout";
import InfoDialog from "@/components/shared/dialog/info-dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function InstansiPesertaView() {
    return (
        <ContentCanvas>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>No.</TableHead>
                        <TableHead>Nama Peserta</TableHead>
                        <TableHead>Aksi</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    <TableRow>
                        <TableCell>1</TableCell>
                        <TableCell>Arry</TableCell>
                        <TableCell className="space-x-2">
                            <InfoDialog
                                title='Detail Peserta'
                                description='Detail Peserta'
                                sections={
                                    [
                                        {
                                            title: 'Informasi Peserta',
                                            fields: [
                                                { label: 'Nama Peserta', value: 'Arry' },
                                            ]
                                        },
                                    ]
                                } />
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </ContentCanvas>
    )
}
