"use client"

import { useActionState } from "react"

import { uploadPdf } from "@/actions/cloudinary-action"
import { ContentCanvas } from "@/components/layouts/auth-layout"
import BackButton from "@/components/shared/back-button"
import { Button } from "@/components/ui/button"
import { Field, FieldLabel, FieldSet } from "@/components/ui/field"
import { Input } from "@/components/ui/input"

const initialState = {
  success: false,
  message: "",
  url: "",
}

export default function Admin_DiklatSertifikat_View() {
  const [state, formAction, isPending] = useActionState(
    uploadPdf,
    initialState
  )

  return (
    <ContentCanvas>
      <BackButton url="/admin/kelola-diklat/daftar-diklat" />

      <form action={formAction}>
        <FieldSet>
          <Field>
            <FieldLabel>Template Sertifikat Peserta</FieldLabel>

            {/* pastikan name="file" */}
            <Input
              type="file"
              accept="application/pdf"
              name="file"
            />
          </Field>

          {state?.message && (
            <p
              className={`text-sm ${state.success ? "text-green-600" : "text-red-600"
                }`}
            >
              {state.message}
            </p>
          )}

          <div className="flex justify-end">
            <Button type="submit" disabled={isPending}>
              {isPending ? "Mengupload..." : "Simpan"}
            </Button>
          </div>
        </FieldSet>
      </form>
    </ContentCanvas>
  )
}