import { ContentCanvas } from "@/components/layouts/auth-layout";
import BackButton from "@/components/shared/back-button";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import toDateInputValue from "@/utils/toDateInputValue";

export default function KelolaDiklatForm({
    daftarMetodeDiklat,
    actionState,
    diklat
}: {
    daftarMetodeDiklat: any[]
    actionState: {
        state: any
        formAction: (formData: FormData) => void
        pending: boolean
    }
    diklat?: any
}) {

    return (
        <ContentCanvas>
            <div>
                <BackButton url="/admin/kelola-diklat/daftar-diklat" />
            </div>

            <form action={actionState.formAction}>
                <FieldSet>

                    <Field>
                        <FieldLabel>Judul</FieldLabel>
                        <Input
                            placeholder="Masukkan judul"
                            name="judul"
                            defaultValue={actionState.state?.values?.judul ?? diklat?.judul} />
                        {
                            actionState.state?.errors?.judul &&
                            <FieldError>{actionState.state?.errors?.judul}</FieldError>
                        }
                    </Field>

                    <Field>
                        <FieldLabel>Deskripsi (opsional)</FieldLabel>
                        <Textarea
                            placeholder="Masukkan deskripsi"
                            name="deskripsi"
                            defaultValue={actionState.state?.values?.deskripsi ?? diklat?.deskripsi} />
                        {
                            actionState.state?.errors?.deskripsi &&
                            <FieldError>{actionState.state?.errors?.deskripsi}</FieldError>
                        }
                    </Field>

                    <Field>
                        <FieldLabel>Tujuan</FieldLabel>
                        <Input
                            placeholder="Masukkan tujuan"
                            name="tujuan"
                            defaultValue={actionState.state?.values?.tujuan ?? diklat?.tujuan} />
                        {
                            actionState.state?.errors?.tujuan &&
                            <FieldError>{actionState.state?.errors?.tujuan}</FieldError>
                        }
                    </Field>

                    <Field>
                        <FieldLabel>Target/Sasaran</FieldLabel>
                        <Input
                            placeholder="Masukkan target atau sasaran"
                            name="targetSasaran"
                            defaultValue={actionState.state?.values?.targetSasaran ?? diklat?.targetSasaran} />
                        {
                            actionState.state?.errors?.targetSasaran &&
                            <FieldError>{actionState.state?.errors?.targetSasaran}</FieldError>
                        }
                    </Field>

                    <Field>
                        <FieldLabel>Lokasi</FieldLabel>
                        <Input
                            placeholder="Masukkan lokasi"
                            name="lokasi"
                            defaultValue={actionState.state?.values?.lokasi ?? diklat?.lokasi} />
                        {
                            actionState.state?.errors?.lokasi &&
                            <FieldError>{actionState.state?.errors?.lokasi}</FieldError>
                        }
                    </Field>

                    <Field>
                        <FieldLabel>Metode Diklat</FieldLabel>
                        <Select name="metodeDiklatId" defaultValue={actionState.state?.values?.metodeDiklatId ?? diklat?.metodeDiklat.id.toString()}>
                            <SelectTrigger>
                                <SelectValue placeholder="Pilih Metode" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Metode Diklat</SelectLabel>
                                    {
                                        daftarMetodeDiklat.map((metodeDiklat: any, index: number) => (
                                            <SelectItem key={index} value={metodeDiklat.id.toString()}>
                                                {metodeDiklat.nama}
                                            </SelectItem>
                                        ))
                                    }
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                        {
                            actionState.state?.errors?.metodeDiklatId &&
                            <FieldError>{actionState.state?.errors?.metodeDiklatId}</FieldError>
                        }
                    </Field>

                    <Field>
                        <FieldLabel>Maksimal Kuota</FieldLabel>
                        <Input
                            placeholder="Masukkan kuota peserta"
                            name="maksimalKuota"
                            inputMode="numeric"
                            defaultValue={actionState.state?.values?.maksimalKuota ?? diklat?.maksimalKuota}
                            min={1} />
                        {
                            actionState.state?.errors?.maksimalKuota &&
                            <FieldError>{actionState.state?.errors?.maksimalKuota}</FieldError>
                        }
                    </Field>

                    <FieldSet className="grid grid-cols-2 max-md:grid-cols-1">
                        <Field>
                            <FieldLabel>Tanggal Buka Pendaftaran</FieldLabel>
                            <Input
                                type="date"
                                name="tanggalBukaPendaftaran"
                                defaultValue={actionState.state?.values?.tanggalBukaPendaftaran ?? toDateInputValue(diklat?.tanggalBukaPendaftaran)} />
                            {
                                actionState.state?.errors?.tanggalBukaPendaftaran &&
                                <FieldError>{actionState.state?.errors?.tanggalBukaPendaftaran}</FieldError>
                            }
                        </Field>

                        <Field>
                            <FieldLabel>Tanggal Tutup Pendaftaran</FieldLabel>
                            <Input
                                type="date"
                                name="tanggalTutupPendaftaran"
                                defaultValue={actionState.state?.values?.tanggalTutupPendaftaran ?? toDateInputValue(diklat?.tanggalTutupPendaftaran)} />
                            {
                                actionState.state?.errors?.tanggalTutupPendaftaran &&
                                <FieldError>{actionState.state?.errors?.tanggalTutupPendaftaran}</FieldError>
                            }
                        </Field>

                        <Field>
                            <FieldLabel>Tanggal Mulai Diklat</FieldLabel>
                            <Input
                                type="date"
                                name="tanggalMulaiAcara"
                                defaultValue={actionState.state?.values?.tanggalMulaiAcara ?? toDateInputValue(diklat?.tanggalMulaiAcara)} />
                            {
                                actionState.state?.errors?.tanggalMulaiAcara &&
                                <FieldError>{actionState.state?.errors?.tanggalMulaiAcara}</FieldError>
                            }
                        </Field>

                        <Field>
                            <FieldLabel>Tanggal Selesai Diklat</FieldLabel>
                            <Input
                                type="date"
                                name="tanggalSelesaiAcara"
                                defaultValue={actionState.state?.values?.tanggalSelesaiAcara ?? toDateInputValue(diklat?.tanggalSelesaiAcara)} />
                            {
                                actionState.state?.errors?.tanggalSelesaiAcara &&
                                <FieldError>{actionState.state?.errors?.tanggalSelesaiAcara}</FieldError>
                            }
                        </Field>
                    </FieldSet>

                    <Field>
                        <FieldLabel>Persyaratan Peserta</FieldLabel>
                        <Textarea
                            placeholder="Masukkan persyaratan peserta"
                            name="persyaratanPeserta"
                            defaultValue={actionState.state?.values?.persyaratanPeserta ?? diklat?.persyaratanPeserta} />
                        {
                            actionState.state?.errors?.persyaratanPeserta &&
                            <FieldError>{actionState.state?.errors?.persyaratanPeserta}</FieldError>
                        }
                    </Field>
                </FieldSet>

                <div className="w-full flex">
                    <Button type="submit" className="mt-8 ml-auto">
                        {diklat ? "Perbarui" : "Tambah"} Diklat {actionState.pending && <Spinner />}
                    </Button>
                </div>
            </form>
        </ContentCanvas>
    )
}
