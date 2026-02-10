"use client"

import { ContentCanvas } from "@/components/layouts/auth-layout";
import BackButton from "@/components/shared/back-button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import toDateInputValue from "@/utils/toDateInputValue";

export default function KelolaPesertaForm({
    actionState,
    peserta
}: {
    actionState: {
        state: any
        formAction: (formData: FormData) => void
        pending: boolean
    }
    peserta?: any
}) {

    return (
        <ContentCanvas>
            <BackButton />

            <form action={actionState.formAction}>
                <FieldSet>

                    <Field>
                        <FieldLabel>Nama</FieldLabel>
                        <Input
                            placeholder="Masukkan nama"
                            name="nama"
                            defaultValue={actionState.state?.values?.nama ?? peserta?.user.name} />
                        {
                            actionState.state?.errors?.nama &&
                            <FieldError>{actionState.state?.errors?.nama}</FieldError>
                        }
                    </Field>
                    <Field>
                        <FieldLabel>Email</FieldLabel>
                        <Input
                            placeholder="Masukkan email"
                            name="email"
                            defaultValue={actionState.state?.values?.email ?? peserta?.user.email} />
                        {
                            actionState.state?.errors?.email &&
                            <FieldError>{actionState.state?.errors?.email}</FieldError>
                        }
                    </Field>
                    <Field>
                        <FieldLabel>Nomor Telepon</FieldLabel>
                        <Input
                            placeholder="Masukkan nomor telepon"
                            name="nomorTelepon"
                            defaultValue={actionState.state?.values?.nomorTelepon ?? peserta?.nomorTelepon} />
                        {
                            actionState.state?.errors?.nomorTelepon &&
                            <FieldError>{actionState.state?.errors?.nomorTelepon}</FieldError>
                        }
                    </Field>
                    <Field>
                        <FieldLabel>Jenis Kelamin</FieldLabel>
                        <Select name="jenisKelamin" defaultValue={actionState.state?.values?.jenisKelamin ?? peserta?.jenisKelamin.toString()}>
                            <SelectTrigger>
                                <SelectValue placeholder="Pilih Jenis Kelamin" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Jenis Kelamin</SelectLabel>
                                    <SelectItem value="Pria">
                                        Pria
                                    </SelectItem>
                                    <SelectItem value="Wanita">
                                        Wanita
                                    </SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                        {
                            actionState.state?.errors?.jenisKelamin &&
                            <FieldError>{actionState.state?.errors?.jenisKelamin}</FieldError>
                        }
                    </Field>
                    <Field>
                        <FieldLabel>Jabatan</FieldLabel>
                        <Input
                            placeholder="Masukkan jabatan"
                            name="jabatan"
                            defaultValue={actionState.state?.values?.jabatan ?? peserta?.jabatan} />
                        {
                            actionState.state?.errors?.jabatan &&
                            <FieldError>{actionState.state?.errors?.jabatan}</FieldError>
                        }
                    </Field>
                    <Field>
                        <FieldLabel>NIK</FieldLabel>
                        <Input
                            placeholder="Masukkan nik"
                            name="nik"
                            inputMode="numeric"
                            defaultValue={actionState.state?.values?.nik ?? peserta?.nik} />
                        {
                            actionState.state?.errors?.nik &&
                            <FieldError>{actionState.state?.errors?.nik}</FieldError>
                        }
                    </Field>
                    <Field>
                        <FieldLabel>Tanggal Lahir</FieldLabel>
                        <Input
                            placeholder="Masukkan tanggal lahir"
                            name="tanggalLahir"
                            type="date"
                            defaultValue={actionState.state?.values?.tanggalLahir ?? toDateInputValue(peserta?.tanggalLahir)} />
                        {
                            actionState.state?.errors?.tanggalLahir &&
                            <FieldError>{actionState.state?.errors?.tanggalLahir}</FieldError>
                        }
                    </Field>
                    <Field>
                        <FieldLabel>Tempat Lahir</FieldLabel>
                        <Input
                            placeholder="Masukkan tempatLahir"
                            name="tempatLahir"
                            defaultValue={actionState.state?.values?.tempatLahir ?? peserta?.tempatLahir} />
                        {
                            actionState.state?.errors?.tempatLahir &&
                            <FieldError>{actionState.state?.errors?.tempatLahir}</FieldError>
                        }
                    </Field>
                    <Field>
                        <FieldLabel>Alamat</FieldLabel>
                        <Textarea
                            placeholder="Masukkan alamat"
                            name="alamat"
                            defaultValue={actionState.state?.values?.alamat ?? peserta?.alamat} />
                        {
                            actionState.state?.errors?.alamat &&
                            <FieldError>{actionState.state?.errors?.alamat}</FieldError>
                        }
                    </Field>
                    <Field>
                        <FieldLabel>Password {peserta && "Baru (Opsional)"}</FieldLabel>
                        <PasswordInput
                            placeholder="Masukkan password"
                            name="password"
                            defaultValue={actionState.state?.values?.password ?? peserta?.password} />
                        {
                            actionState.state?.errors?.password &&
                            <FieldError>{actionState.state?.errors?.password}</FieldError>
                        }
                    </Field>
                    <Field>
                        <FieldLabel>Konfirmasi Password {peserta && "Baru (Opsional)"}</FieldLabel>
                        <PasswordInput
                            placeholder="Masukkan konfirmasi password"
                            name="konfirmasiPassword"
                            defaultValue={actionState.state?.values?.konfirmasiPassword ?? peserta?.konfirmasiPassword} />
                        {
                            actionState.state?.errors?.konfirmasiPassword &&
                            <FieldError>{actionState.state?.errors?.konfirmasiPassword}</FieldError>
                        }
                    </Field>

                </FieldSet>

                {
                    actionState.state?.message &&
                    <Alert variant='destructive' className="mt-6">
                        <AlertTitle>Pesan Kesalahan:</AlertTitle>
                        <AlertDescription>{actionState.state?.message}</AlertDescription>
                    </Alert>
                }

                <div className="w-full flex">
                    <Button type="submit" className="mt-8 ml-auto">
                        {peserta ? "Perbarui" : "Tambah"} Peserta {actionState.pending && <Spinner />}
                    </Button>
                </div>
            </form>
        </ContentCanvas>
    )
}
