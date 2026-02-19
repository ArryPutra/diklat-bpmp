"use client"

import { Button } from '@/components/ui/button'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { BiInfoCircle } from 'react-icons/bi'

type InfoDialogProps = {
    title: string
    description: string
    sections: { title: string, fields: { label: string, value: string, isLink?: boolean }[] }[]
}

export default function InfoDialog({ title, description, sections }: InfoDialogProps) {

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant='outline' size='icon-sm'>
                    <BiInfoCircle />
                </Button>
            </DialogTrigger>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>{description}</DialogDescription>
                </DialogHeader>

                <div className='space-y-4 max-h-96 overflow-y-auto'>
                    {sections.map((section, index) =>
                        <div key={index} className='border rounded-lg p-4'>
                            <h3 className='font-semibold mb-3'>{section.title}</h3>
                            <div className='grid grid-cols-1 gap-3 text-sm max-md:grid-cols-1'>
                                {section.fields.map((field: any) => (
                                    <div key={field.label}>
                                        <p className='text-gray-500 text-xs'>{field.label}</p>
                                        {field.isLink ? (
                                            <a href={field.value} target="_blank" rel="noopener noreferrer" className="font-medium text-blue-600 hover:underline">
                                                {field.value || '-'}
                                            </a>
                                        ) : (
                                            <p className='font-medium'>{field.value || '-'}</p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant='outline'>Tutup</Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}