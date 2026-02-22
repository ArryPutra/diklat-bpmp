"use client";

import { logoutAction, resetPasswordAction } from "@/actions/auth-action";
import { ContentCanvas } from "@/components/layouts/auth-layout";
import { Button } from "@/components/ui/button";
import { PasswordInput } from "@/components/ui/password-input";
import { formatDateTimeId } from "@/utils/dateFormatted";
import { useActionState } from "react";
import { BiLock, BiLogOut } from "react-icons/bi";
import LoadingScreen from "../shared/loading-screen";
import { Field, FieldLabel, FieldSet } from "../ui/field";
import { Table, TableBody, TableCell, TableHead, TableRow } from "../ui/table";

type ProfileField = {
    label: string
    value: string
}

export default function Profil_Layout({
    dataUser,
    fields
}: {
    dataUser: {
        nama: string
        namaPeran: string
        createdAt: any
        updatedAt: any
    }
    fields?: ProfileField[]
}) {
    const [resetState, resetFormAction, resetPending] = useActionState(resetPasswordAction, null);
    const [logoutState, logoutFormAction, logoutPending] = useActionState(logoutAction, null);

    return (
        <div className="space-y-6">
            <LoadingScreen isLoading={resetPending || logoutPending} />

            <ContentCanvas>
                <div className="flex items-center gap-4 max-md:flex-col max-md:items-start">
                    <div className="size-16 rounded-full bg-primary text-white font-bold text-xl flex items-center justify-center">
                        {dataUser.nama.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <h2 className="text-xl font-bold">{dataUser.nama}</h2>
                        <p className="text-sm text-muted-foreground">{dataUser.namaPeran}</p>
                    </div>
                </div>
            </ContentCanvas>

            <ContentCanvas>
                <h3 className="text-base font-semibold">Informasi Profil</h3>

                <Table className="-mx-2">
                    <TableBody>

                        {
                            fields &&
                            fields.map((field, index) => (
                                <TableRow key={index} className="h-12">
                                    <TableCell>{field.label}</TableCell>
                                    <TableHead>{field.value}</TableHead>
                                </TableRow>
                            ))}
                        <TableRow className="h-12">
                            <TableCell>Tanggal Dibuat</TableCell>
                            <TableHead>{formatDateTimeId(dataUser.createdAt)}</TableHead>
                        </TableRow>
                        <TableRow className="h-12">
                            <TableCell>Tanggal Diperbarui</TableCell>
                            <TableHead>{formatDateTimeId(dataUser.updatedAt)}</TableHead>
                        </TableRow>
                    </TableBody>
                </Table>

                <form action={logoutFormAction} className="pt-2 space-y-3">
                    <Button variant="destructive" type="submit" disabled={logoutPending} className="w-fit">
                        <BiLogOut />
                        {logoutPending ? 'Logging out...' : 'Logout'}
                    </Button>
                </form>
            </ContentCanvas>

            <ContentCanvas>
                <h3 className="text-base font-semibold flex items-center gap-2">
                    <BiLock size={18} />
                    Reset Password
                </h3>

                {resetState?.success && (
                    <div className="p-3 bg-green-50 border border-green-200 rounded-md text-sm text-green-800">
                        {resetState.message}
                    </div>
                )}

                {resetState?.success === false && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-800">
                        {resetState.message}
                    </div>
                )}

                <form action={resetFormAction} className="space-y-3">
                    <FieldSet>
                        <Field>
                            <FieldLabel>Password Saat Ini</FieldLabel>
                            <PasswordInput
                                name="passwordSaat"
                                placeholder="Minimal 8 karakter"
                                aria-invalid={!!resetState?.errors?.passwordSaat}
                            />
                            {resetState?.errors?.passwordSaat && (
                                <p className="text-sm text-red-600 mt-1">{resetState.errors.passwordSaat[0]}</p>
                            )}
                        </Field>

                        <Field>
                            <FieldLabel>Password Baru</FieldLabel>
                            <PasswordInput
                                name="passwordBaru"
                                placeholder="Minimal 8 karakter"
                                aria-invalid={!!resetState?.errors?.passwordBaru}
                            />
                            {resetState?.errors?.passwordBaru && (
                                <p className="text-sm text-red-600 mt-1">{resetState.errors.passwordBaru[0]}</p>
                            )}
                        </Field>

                        <Field>
                            <FieldLabel>Konfirmasi Password</FieldLabel>
                            <PasswordInput
                                name="konfirmasiPassword"
                                placeholder="Ulangi password baru"
                                aria-invalid={!!resetState?.errors?.konfirmasiPassword}
                            />
                            {resetState?.errors?.konfirmasiPassword && (
                                <p className="text-sm text-red-600 mt-1">{resetState.errors.konfirmasiPassword[0]}</p>
                            )}
                        </Field>

                        <Button type="submit" disabled={resetPending} className="w-fit">
                            {resetPending ? 'Mengubah...' : 'Ubah Password'}
                        </Button>
                    </FieldSet>
                </form>
            </ContentCanvas>
        </div>
    )
}