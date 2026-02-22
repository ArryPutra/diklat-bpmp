"use client"

import ListDiklatNarasumberCard from './list-diklat-narasumber-card'

export default function NarasumberDiklatContent({
    daftarDiklatSaya,
    title,
    description,
    emptyTitle,
    emptyDescription,
    detailBasePath = '/narasumber/diklat/aktif'
}: {
    daftarDiklatSaya: any[]
    title: string
    description: string
    emptyTitle: string
    emptyDescription: string
    detailBasePath?: string
}) {
    return (
        <ListDiklatNarasumberCard
            daftarDiklatSaya={daftarDiklatSaya}
            title={title}
            description={description}
            emptyTitle={emptyTitle}
            emptyDescription={emptyDescription}
            detailBasePath={detailBasePath}
        />
    )
}
