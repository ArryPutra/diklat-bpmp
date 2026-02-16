"use client"

import { ContentCanvas } from "@/components/layouts/auth-layout"
import { PaginationWithLinks } from "@/components/shared/pagination-with-links"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { BiPlus } from "react-icons/bi"
import KelolaNarasumberTable from "./components/kelola-narasumber-table"

export default function AdminKelolaNarasumberView({
    daftarNarasumber,
    totalNarasumber,
    newMessage
}: {
    daftarNarasumber: any[]
    totalNarasumber: number
    newMessage?: string
}) {
    const params = new URLSearchParams(useSearchParams().toString());

    return (
        <ContentCanvas>
            <Link href='/admin/kelola-narasumber/create'>
                <Button>Tambah Narasumber <BiPlus /></Button>
            </Link>

            {
                newMessage &&
                <Alert>
                    <AlertTitle>Pesan:</AlertTitle>
                    <AlertDescription>{newMessage}</AlertDescription>
                </Alert>
            }

            <KelolaNarasumberTable
                daftarNarasumber={daftarNarasumber} />

            {
                totalNarasumber !== 0 &&
                <div className="mt-6">
                    <PaginationWithLinks
                        page={parseInt(params.get("page") ?? "1")}
                        pageSize={10}
                        totalCount={totalNarasumber} />
                </div>
            }
        </ContentCanvas>
    )
}

