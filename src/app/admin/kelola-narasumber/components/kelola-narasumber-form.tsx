import { ContentCanvas } from "@/components/layouts/auth-layout";
import BackButton from "@/components/shared/back-button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";

export default function KelolaNarasumberForm({
    actionState,
    narasumber
}: {
    actionState: {
        state: any
        formAction: (formData: FormData) => void
        pending: boolean
    }
    narasumber?: any
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
                            defaultValue={actionState.state?.values?.nama ?? narasumber?.user.name} />
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
                            defaultValue={actionState.state?.values?.email ?? narasumber?.user.email} />
                        {
                            actionState.state?.errors?.email &&
                            <FieldError>{actionState.state?.errors?.email}</FieldError>
                        }
                    </Field>

                    <Field>
                        <FieldLabel>Nomor Telepon</FieldLabel>
                        <Input
                            type="tel"
                            placeholder="Masukkan nomor telepon"
                            name="nomorTelepon"
                            defaultValue={actionState.state?.values?.nomorTelepon ?? narasumber?.nomorTelepon} />
                        {
                            actionState.state?.errors?.nomorTelepon &&
                            <FieldError>{actionState.state?.errors?.nomorTelepon}</FieldError>
                        }
                    </Field>

                    <Field>
                        <FieldLabel>Jenis Kelamin</FieldLabel>
                        <Select
                            name="jenisKelamin"
                            defaultValue={actionState.state?.values?.jenisKelamin ?? narasumber?.jenisKelamin ?? ""}>
                            <SelectTrigger>
                                <SelectValue placeholder="Pilih Jenis Kelamin" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Pria">Pria</SelectItem>
                                <SelectItem value="Wanita">Wanita</SelectItem>
                            </SelectContent>
                        </Select>
                        {
                            actionState.state?.errors?.jenisKelamin &&
                            <FieldError>{actionState.state?.errors?.jenisKelamin}</FieldError>
                        }
                    </Field>

                    <Field>
                        <FieldLabel>Password</FieldLabel>
                        <PasswordInput
                            placeholder="Masukkan password"
                            name="password"
                            defaultValue={actionState.state?.values?.password ?? narasumber?.password} />
                        {
                            actionState.state?.errors?.password &&
                            <FieldError>{actionState.state?.errors?.password}</FieldError>
                        }
                    </Field>

                    <Field>
                        <FieldLabel>Konfirmasi Password</FieldLabel>
                        <PasswordInput
                            placeholder="Masukkan konfirmasi password"
                            name="konfirmasiPassword"
                            defaultValue={actionState.state?.values?.konfirmasiPassword ?? narasumber?.password} />
                        {
                            actionState.state?.errors?.konfirmasiPassword &&
                            <FieldError>{actionState.state?.errors?.konfirmasiPassword}</FieldError>
                        }
                    </Field>

                    {
                        actionState.state?.message &&
                        <Alert variant='destructive'>
                            <AlertTitle>Pesan:</AlertTitle>
                            <AlertDescription>{actionState.state?.message}</AlertDescription>
                        </Alert>
                    }

                </FieldSet>

                <div className="w-full flex">
                    <Button type="submit" className="mt-8 ml-auto">
                        {narasumber ? "Perbarui" : "Tambah"} Narasumber {actionState.pending && <Spinner />}
                    </Button>
                </div>
            </form>
        </ContentCanvas>
    )
}
