"use client"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Spinner } from "@/components/ui/spinner";
import { useEffect, useRef, useState, useTransition } from "react";

type FormDialogProps = {
    title: string
    description: string
    // sections?: { title: string, fields: { label: string, value: string }[] }[]
    triggerButton: React.ReactNode
    actionButtonLabel: string
    formContent: React.ReactNode
    isSuccess: boolean | undefined
    // sectionsGrid?: 1 | 2
    formAction: (formData: FormData) => void
    message?: string
}

export default function FormDialog({
    triggerButton,
    title,
    description,
    formContent,
    actionButtonLabel,
    isSuccess,
    formAction,
    message
}: FormDialogProps) {
    const [isPending, startTransition] = useTransition()
    const [isOpenDialog, setIsOpenDialog] = useState(false)

    const formRef = useRef<HTMLFormElement>(null)

    useEffect(() => {
        if (isSuccess && !isPending) {
            setIsOpenDialog(false)
        }
    }, [isSuccess, isPending])

    function onSubmitForm() {
        if (formRef.current) {
            const formData = new FormData(formRef.current)
            startTransition(() => {
                formAction(formData)
            })
        }
    }

    return (
        <Dialog open={isOpenDialog} onOpenChange={setIsOpenDialog}>
            <DialogTrigger asChild>
                {triggerButton}
            </DialogTrigger>

            <DialogContent className="max-h-[90vh] overflow-hidden">
                <DialogHeader className="pb-4">
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>{description}</DialogDescription>
                    {
                        !isSuccess && message &&
                        <Alert variant='destructive' className="mt-4">
                            <AlertTitle>Pesan:</AlertTitle>
                            <AlertDescription>{message}</AlertDescription>
                        </Alert>
                    }
                </DialogHeader>

                <div className="overflow-auto h-[50vh] mb-4 -m-4 p-4">
                    <form ref={formRef}>
                        {formContent}
                    </form>
                </div>

                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant='outline'>
                            Tutup
                        </Button>
                    </DialogClose>
                    <div onClick={onSubmitForm}>
                        <Button className="w-full" type="submit">{actionButtonLabel} {isPending && <Spinner />}</Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog >
    )
}
