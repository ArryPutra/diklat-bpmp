"use client"

import { Field, FieldError, FieldLabel, FieldSet } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function DialogFormMateri({
  state,
  daftarNarasumber,
  materiDiklat
}: {
  state: any
  daftarNarasumber: any[]
  materiDiklat?: any
}) {
  return (
    <FieldSet>
      <Field>
        <FieldLabel>Judul Materi</FieldLabel>
        <Input name="judul" type="text" placeholder="Masukkan judul materi diklat" defaultValue={materiDiklat?.judul ?? ''} />
        {
          state?.errors?.judul &&
          <FieldError>{state?.errors?.judul}</FieldError>
        }
      </Field>
      <Field>
        <FieldLabel>Deskripsi</FieldLabel>
        <Input name="deskripsi" type="text" placeholder="Masukkan deskripsi materi diklat" defaultValue={materiDiklat?.deskripsi ?? ''} />
        {
          state?.errors?.deskripsi &&
          <FieldError>{state?.errors?.deskripsi}</FieldError>
        }
      </Field>
      <Field>
        <FieldLabel>Pilih Narasumber</FieldLabel>
        <Select name="narasumberId" defaultValue={materiDiklat?.narasumberId?.toString() ?? ''}>
          <SelectTrigger>
            <SelectValue placeholder="Narasumber" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Narasumber</SelectLabel>
              {daftarNarasumber.map((narasumber) => (
                <SelectItem
                  key={narasumber.id}
                  value={narasumber.id.toString()}>
                  {narasumber.user.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        {
          state?.errors?.narasumberId &&
          <FieldError>{state?.errors?.narasumberId}</FieldError>
        }
      </Field>
      <Field>
        <FieldLabel>Waktu Mulai</FieldLabel>
        <Input name="waktuMulai" type="datetime-local" defaultValue={
          materiDiklat?.waktuMulai ? formatDatetimeLocal(materiDiklat.waktuMulai) : ''
        } />
        {
          state?.errors?.waktuMulai &&
          <FieldError>{state?.errors?.waktuMulai}</FieldError>
        }
      </Field>
      <Field>
        <FieldLabel>Waktu Selesai</FieldLabel>
        <Input name="waktuSelesai" type="datetime-local" defaultValue={
          materiDiklat?.waktuSelesai ? formatDatetimeLocal(materiDiklat.waktuSelesai) : ''
        } />
        {
          state?.errors?.waktuSelesai &&
          <FieldError>{state?.errors?.waktuSelesai}</FieldError>
        }
      </Field>
    </FieldSet>
  )
}

function formatDatetimeLocal(date: Date) {
  const pad = (n: number) => n.toString().padStart(2, '0');

  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

