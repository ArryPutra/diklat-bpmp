import React from 'react'
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../../ui/alert-dialog'

type InfoDialogProps = {
    title: string
    description: string
    sections: { title: string, fields: { label: string, value: string }[] }[]
    triggerButton: React.ReactNode
    actionButton?: React.ReactNode
}

export default function InfoDialog({ title, description, sections, triggerButton, actionButton }: InfoDialogProps) {

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

                <div className='space-y-4 max-h-96 overflow-y-auto'>
                    {sections.map((section, index) =>
                        <div key={index} className='border rounded-lg p-4'>
                            <h3 className='font-semibold mb-3'>{section.title}</h3>
                            <div className='grid grid-cols-2 gap-3 text-sm max-md:grid-cols-1'>
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

                <AlertDialogFooter>
                    <AlertDialogCancel>Tutup</AlertDialogCancel>
                    {actionButton}
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}