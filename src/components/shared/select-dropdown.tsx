"use client"

import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { Field, FieldLabel } from "../ui/field";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import LoadingScreen from "./loading-screen";

type SelectDropdownProps = {
  label: string
  query: {
    name: string,
    values: {
      label: string,
      value: string
    }[],
    defaultValue?: string
    deleteValue?: string
  }
}

export default function SelectDropdown({
  label,
  query
}: SelectDropdownProps) {
  const router = useRouter();
  const params = new URLSearchParams(useSearchParams().toString());
  const [isPending, startTransition] = useTransition();

  function onChange(value: string) {
    startTransition(() => {
      params.set(query.name, value)

      if (query.defaultValue === value) {
        params.delete(query.name)
      }

      router.push(`?${params}`)
    })
  }

  return (
    <>
      <LoadingScreen isLoading={isPending} />

      <Field className="w-fit">
        <FieldLabel>{label}</FieldLabel>
        <Select defaultValue={params.get(query.name) ?? query.defaultValue} onValueChange={onChange}>
          <SelectTrigger>
            <SelectValue placeholder="Pilih Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {
                query.values.map((value) => (
                  <SelectItem key={value.value} value={value.value}>{value.label}</SelectItem>
                ))
              }
            </SelectGroup>
          </SelectContent>
        </Select>
      </Field>
    </>
  )
}
