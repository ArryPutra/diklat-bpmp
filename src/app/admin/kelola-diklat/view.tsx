"use client"

import { ContentCanvas } from "@/components/layouts/auth-layout"
import { PaginationWithLinks } from "@/components/shared/pagination-with-links"
import Search from "@/components/shared/search"
import SelectDropdown from "@/components/shared/select-dropdown"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { BiPlus } from "react-icons/bi"
import KelolaDiklatTable from "./components/kelola-diklat-table"

export default function AdminDiklatView({
    daftarDiklat,
    totalDaftarDiklat,
    newMessage
}: {
    daftarDiklat: any[]
    totalDaftarDiklat: number
    newMessage?: string
}) {
    const params = new URLSearchParams(useSearchParams().toString());

    return (
        <ContentCanvas>
            <Link href='/admin/kelola-diklat/create'>
                <Button>Tambah Diklat <BiPlus /></Button>
            </Link>
            <div className="my-6 flex justify-between items-end flex-wrap gap-3">
                <SelectDropdown
                    label='Metode Diklat'
                    query={{
                        name: "metodeDiklatId",
                        values: [
                            { label: "Semua", value: "0" },
                            { label: "Offline/Luar Jaringan", value: "1" },
                            { label: "Online/Dalam Jaringan", value: "2" },
                            { label: "Hybrid", value: "3" }
                        ],
                    }} />
                <Search />
            </div>

            {
                newMessage &&
                <Alert className="mb-6">
                    <AlertTitle>Pesan:</AlertTitle>
                    <AlertDescription>{newMessage}</AlertDescription>
                </Alert>
            }

            <KelolaDiklatTable
                daftarDiklat={daftarDiklat} />

            <div className="mt-6">
                <PaginationWithLinks
                    page={parseInt(params.get("page") ?? "1")}
                    pageSize={10}
                    totalCount={totalDaftarDiklat} />
            </div>
        </ContentCanvas>
    )
}

