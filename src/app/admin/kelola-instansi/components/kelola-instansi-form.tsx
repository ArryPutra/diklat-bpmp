import { ContentCanvas } from "@/components/layouts/auth-layout";
import BackButton from "@/components/shared/back-button";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel, FieldSet } from "@/components/ui/field";
import { PasswordInput } from "@/components/ui/password-input";
import { Spinner } from "@/components/ui/spinner";

export default function KelolaInstansiForm({
  actionState,
  instansi
}: {
  actionState: {
    state: any
    formAction: (formData: FormData) => void
    pending: boolean
  }
  instansi?: any
}) {

  return (
    <ContentCanvas>
      <BackButton />

      <form action={actionState.formAction}>
        <FieldSet>

          <Field>
            <FieldLabel>Password Baru</FieldLabel>
            <PasswordInput
              placeholder="Masukkan password"
              name="password"
              defaultValue={actionState.state?.values?.password ?? instansi?.password} />
            {
              actionState.state?.errors?.password &&
              <FieldError>{actionState.state?.errors?.password}</FieldError>
            }
          </Field>

          <Field>
            <FieldLabel>Konfirmasi Password Baru</FieldLabel>
            <PasswordInput
              placeholder="Masukkan konfirmasi password"
              name="konfirmasiPassword"
              defaultValue={actionState.state?.values?.konfirmasiPassword ?? instansi?.konfirmasiPassword} />
            {
              actionState.state?.errors?.konfirmasiPassword &&
              <FieldError>{actionState.state?.errors?.konfirmasiPassword}</FieldError>
            }
          </Field>

        </FieldSet>

        <div className="w-full flex">
          <Button type="submit" className="mt-8 ml-auto">
            {instansi ? "Perbarui" : "Tambah"} instansi {actionState.pending && <Spinner />}
          </Button>
        </div>
      </form>
    </ContentCanvas>
  )
}
