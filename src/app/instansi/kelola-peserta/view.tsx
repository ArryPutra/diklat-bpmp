"use client"

import { updateStatusBannedPesertaAction } from "@/actions/peserta-action"
import { ContentCanvas } from "@/components/layouts/auth-layout"
import LoadingScreen from "@/components/shared/loading-screen"
import { PaginationWithLinks } from "@/components/shared/pagination-with-links"
import Search from "@/components/shared/search"
import SelectDropdown from "@/components/shared/select-dropdown"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { useActionState } from "react"
import { BiPlus } from "react-icons/bi"
import KelolaPesertaTable from "./components/kelola-peserta-table"

export default function KelolaPesertaView({
    daftarPeserta,
    totalDaftarPeserta,
    newMessage
}: {
    daftarPeserta: any[]
    totalDaftarPeserta: number
    newMessage?: string
}) {
    const params = new URLSearchParams(useSearchParams().toString());

    const [stateUpdateStatusUserAction, formActionUpdateStatusUser, pendingUpdateStatusUser] =
        useActionState(updateStatusBannedPesertaAction, null);

    const _newMessage = stateUpdateStatusUserAction?.message ?? newMessage;

    return (
        <ContentCanvas>

            <LoadingScreen isLoading={pendingUpdateStatusUser} />

            <div className="flex flex-col flex-wrap gap-6 mb-6">
                <Link href='/instansi/kelola-peserta/create'>
                    <Button>Tambah Peserta <BiPlus /></Button>
                </Link>
                <div className='flex gap-3 flex-wrap items-end justify-between mb-6'>
                    {/* Select Status Akun */}
                    <SelectDropdown
                        label='Status Akun'
                        query={{
                            name: "banned",
                            values: [
                                { label: "Aktif", value: "false" },
                                { label: "Nonaktif", value: "true" }
                            ],
                            defaultValue: "false"
                        }} />
                    {/* Search */}
                    <Search />
                </div>
            </div>

            {
                _newMessage &&
                <Alert className="mb-6">
                    <AlertTitle>Pesan:</AlertTitle>
                    <AlertDescription>{_newMessage}</AlertDescription>
                </Alert>
            }

            <KelolaPesertaTable
                daftarPeserta={daftarPeserta}
                formActionUpdateStatusUser={formActionUpdateStatusUser} />

            {
                totalDaftarPeserta > 0 &&
                <div className="mt-6">
                    <PaginationWithLinks
                        page={parseInt(params.get("page") ?? "1")}
                        pageSize={10}
                        totalCount={totalDaftarPeserta} />
                </div>
            }
        </ContentCanvas>
    )
}

