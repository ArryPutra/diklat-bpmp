"use client"

import { createPendaftarPesertaDiklatAction } from "@/actions/pendaftar-peserta-diklat-action";
import { MultiSelect } from "@/components/shared/multi-select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Field, FieldLabel, FieldSet } from "@/components/ui/field";
import { Spinner } from "@/components/ui/spinner";
import { useActionState, useState, useTransition } from "react";

export default function DialogDaftarSekarang({
    diklat,
    isInstansi,
    daftarPesertaDariInstansi
}: {
    diklat: any,
    isInstansi: boolean,
    daftarPesertaDariInstansi: any[]
}) {
    if (isInstansi) {
        return (
            <DialogForInstansi
                daftarPesertaDariInstansi={daftarPesertaDariInstansi}
                diklat={diklat} />
        )
    } else {
        return (
            <DialogForPeserta
                diklat={diklat} />
        )
    }
}

function DialogForInstansi({
    daftarPesertaDariInstansi,
    diklat
}: {
    daftarPesertaDariInstansi: any[]
    diklat: any
}) {
    const [isOpen, setIsOpen] = useState(false);

    const [selectedValues, setSelectedValues] = useState<string[]>([]);

    const _daftarPesertaDariInstansi = daftarPesertaDariInstansi.map((peserta) =>
        ({ value: peserta.id, label: peserta.user.name + ' | ' + peserta.nik }));

    const [state, formAction] =
        useActionState(createPendaftarPesertaDiklatAction.bind(null, selectedValues, diklat.id), null);
    const [isPending, startTransition] = useTransition();

    function onSubmit() {
        if (isPending) return

        startTransition(async () => {
            formAction()
        })
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
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
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Informasi Pendaftaran</DialogTitle>
                    <DialogDescription>
                        Silahkan masukkan data peserta diklat
                    </DialogDescription>
                </DialogHeader>
                {
                    !state?.success &&
                    <FieldSet>
                        <Field>
                            <FieldLabel>Daftar Nama Peserta</FieldLabel>
                            <MultiSelect
                                options={_daftarPesertaDariInstansi}
                                onValueChange={setSelectedValues}
                                defaultValue={selectedValues}
                            />
                        </Field>
                    </FieldSet>
                }
                {
                    state &&
                    <Alert variant={!state?.success ? 'destructive' : 'default'}>
                        <AlertTitle>Pesan:</AlertTitle>
                        <AlertDescription>
                            {state.message}
                        </AlertDescription>
                    </Alert>
                }
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant='outline'>Tutup</Button>
                    </DialogClose>
                    {
                        !state?.success &&
                        <Button onClick={() => onSubmit()}
                            disabled={isPending}>
                            Daftarkan Sekarang {isPending && <Spinner />}
                        </Button>
                    }
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

function DialogForPeserta({
    diklat
}: {
    diklat: any
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
        </Dialog>
    )
}