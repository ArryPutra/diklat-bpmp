import React from 'react'

type GuestLayoutProps = {
    children: React.ReactNode
    className?: string
    parentClassName?: string
} & React.ComponentPropsWithoutRef<'main'>

export default function GuestLayout({ children, className, parentClassName, ...props }: GuestLayoutProps) {
    return (
        <main className={`w-full px-5 ${parentClassName}`} {...props}>
            <div className={`w-full max-w-6xl mx-auto py-12
            max-md:py-6 
                ${className}`}>
                {children}
            </div>
        </main>
    )
}
