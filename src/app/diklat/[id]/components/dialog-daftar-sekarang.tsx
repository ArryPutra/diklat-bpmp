"use client"

import { MultiSelect } from "@/components/shared/multi-select";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Field, FieldLabel, FieldSet } from "@/components/ui/field";
import { useState } from "react";

export default function DialogDaftarSekarang({
    diklat,
    isInstansi,
    daftarPeserta
}: {
    diklat: any,
    isInstansi: boolean,
    daftarPeserta: any[]
}) {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button
                    className="w-full mb-2"
                    variant={diklat.statusPendaftaranDiklat.id === 2 ? 'default' : 'secondary'}
                    disabled={diklat.statusPendaftaranDiklat.id !== 2}>
                    {
                        diklat.statusPendaftaranDiklat.id === 2
                            ? 'Daftar Sekarang'
                            : 'Pendaftaran Ditutup'
                    }
                </Button>
            </DialogTrigger>
            {
                isInstansi
                    ? <DialogForInstansi
                        daftarPeserta={daftarPeserta} />
                    : <DialogForPeserta />
            }
        </Dialog>
    )
}

function DialogForInstansi({
    daftarPeserta
}: {
    daftarPeserta: any[]
}) {

    const [selectedValues, setSelectedValues] = useState<string[]>([]);

    const _daftarPeserta = daftarPeserta.map((peserta) =>
        ({ value: peserta.id, label: peserta.user.name + ' | ' + peserta.nik }));

    return (
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Informasi Pendaftaran</DialogTitle>
                <DialogDescription>
                    Silahkan masukkan data peserta diklat
                </DialogDescription>
            </DialogHeader>
            <FieldSet>
                <Field>
                    <FieldLabel>Daftar Nama Peserta</FieldLabel>
                    <MultiSelect
                        options={_daftarPeserta}
                        onValueChange={setSelectedValues}
                        defaultValue={selectedValues}
                    />
                </Field>
            </FieldSet>
            <DialogFooter>
                <DialogClose asChild>
                    <Button variant='outline'>Tutup</Button>
                </DialogClose>
                <Button>Daftar Sekarang</Button>
            </DialogFooter>
        </DialogContent>
    )
}

function DialogForPeserta() {
    return (
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Informasi Pendaftaran</DialogTitle>
                <DialogDescription>
                    Pendaftaran peserta diklat hanya dapat dilakukan melalui instansi masing-masing peserta. Silahkan masuk/login sebagai instansi.
                </DialogDescription>
            </DialogHeader>
            <DialogFooter>
                <DialogClose asChild>
                    <Button variant='outline'>Tutup</Button>
                </DialogClose>
            </DialogFooter>
        </DialogContent>
    )
}