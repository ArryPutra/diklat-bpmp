"use client"

import { updateStatusBannedAction } from '@/actions/user-action'
import { ContentCanvas } from '@/components/layouts/auth-layout'
import LoadingScreen from '@/components/shared/loading-screen'
import { PaginationWithLinks } from '@/components/shared/pagination-with-links'
import Search from '@/components/shared/search'
import SelectDropdown from '@/components/shared/select-dropdown'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { useSearchParams } from 'next/navigation'
import { useActionState } from 'react'
import { BiInfoCircle } from 'react-icons/bi'
import KelolaInstansiTable from './components/kelola-instansi-table'

type AdminInstansiViewProps = {
    daftarInstansi: any[]
    totalDaftarInstansi: number
    newMessage?: string
}

export default function AdminInstansiView({
    daftarInstansi,
    totalDaftarInstansi,
    newMessage
}: AdminInstansiViewProps) {

    const [stateUpdateStatusUserAction, formActionUpdateStatusUser, pendingUpdateStatusUser] =
        useActionState(updateStatusBannedAction, null);

    const params = new URLSearchParams(useSearchParams().toString());

    const currentPage = parseInt(params.get("page") ?? "1");
    const _newMessage = stateUpdateStatusUserAction?.message ?? newMessage;

    return (
        <ContentCanvas>

            <LoadingScreen isLoading={pendingUpdateStatusUser} />

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

            {
                _newMessage &&
                <Alert className='mb-4'>
                    <BiInfoCircle />
                    <AlertTitle>Pesan:</AlertTitle>
                    <AlertDescription>
                        {_newMessage}
                    </AlertDescription>
                </Alert>
            }

            <KelolaInstansiTable
                daftarInstansi={daftarInstansi}
                currentPage={currentPage}
                formActionUpdateStatusUser={formActionUpdateStatusUser} />

            {
                totalDaftarInstansi > 0 &&
                <div className='mt-6'>
                    <PaginationWithLinks
                        page={currentPage}
                        pageSize={10}
                        totalCount={totalDaftarInstansi} />
                </div>
            }
        </ContentCanvas>
    )
}