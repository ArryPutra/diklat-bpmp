import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertDialogAction } from '@radix-ui/react-alert-dialog'
import { AlertTriangleIcon } from 'lucide-react'
import React from 'react'
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../../ui/alert-dialog'

type ActionDialogProps = {
    title: string
    description: string
    sections: { title: string, fields: { label: string, value: string }[] }[]
    triggerButton: React.ReactNode
    actionButton: React.ReactNode
    content?: React.ReactNode

}

export default function ActionDialog({
    title,
    description,
    sections,
    triggerButton,
    actionButton,
    content
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

                {content}

                <AlertDialogFooter className='flex-row justify-end'>
                    <AlertDialogCancel>Tutup</AlertDialogCancel>
                    <AlertDialogAction asChild>
                        {actionButton}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}