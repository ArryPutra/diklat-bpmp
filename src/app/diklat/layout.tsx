import React from 'react'
import { Header } from '../view'

export default function Diklat_Layout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <>
            <Header activeMenuLabel="Diklat" />

            {children}
        </>
    )
}
