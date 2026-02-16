"use client"

import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import React from 'react'

type ActionDialogProps = {
    title: string
    description: string
    sections?: { title: string, fields: { label: string, value: string }[] }[]
    triggerButton: React.ReactNode
    actionButton: React.ReactNode
    content?: React.ReactNode
    sectionsGrid?: 1 | 2
}

export default function ActionDialog({
    title,
    description,
    sections,
    triggerButton,
    actionButton,
    content,
    sectionsGrid = 1
}: ActionDialogProps) {
    return (

        <AlertDialog>
            <AlertDialogTrigger asChild>
                {triggerButton}
            </AlertDialogTrigger>

            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{title}</AlertDialogTitle>
                    <AlertDialogDescription>{description}</AlertDialogDescription>
                </AlertDialogHeader>

                {
                    sections &&
                    <div className='space-y-4 max-h-96 overflow-y-auto'>
                        {sections.map((section, index) =>
                            <div key={index} className='border rounded-lg p-4'>
                                <h3 className='font-semibold mb-3'>{section.title}</h3>
                                <div className={`grid grid-cols-${sectionsGrid} gap-3 text-sm max-md:grid-cols-1`}>
                                    {section.fields.map((field: any) => (
                                        <div key={field.label}>
                                            <p className='text-gray-500 text-xs'>{field.label}</p>
                                            <p className='font-medium'>{field.value || '-'}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                }

                {content}

                <AlertDialogFooter className='flex-row justify-end'>
                    <AlertDialogCancel asChild>
                        <Button variant='outline'>Tutup</Button>
                    </AlertDialogCancel>
                    {actionButton}
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}