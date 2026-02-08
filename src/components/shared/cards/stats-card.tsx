import React from 'react'
import { Card, CardContent, CardDescription, CardTitle } from '../../ui/card'

type StatsCardProps = {
    icon: React.ReactNode
    label: string
    value: string
    variant?: 'default' | 'small'
}

export default function StatsCard({ icon, label, value, variant = 'default' }: StatsCardProps) {

    return (
        <Card className={`shadow-none! ${variant === 'small' && 'py-5'}`}>
            <CardContent className={`flex gap-6 items-center ${variant === 'small' && 'px-5!'}`}>
                <div className='text-2xl text-primary'>
                    {icon}
                </div>
                <div className='flex flex-col'>
                    <CardDescription>{label}</CardDescription>
                    <CardTitle className={`text-lg ${variant === 'small' && 'text-base'}`}>{value}</CardTitle>
                </div>
            </CardContent>
        </Card>
    )
}