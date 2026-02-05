"use client"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { format } from "date-fns"
import { id } from "date-fns/locale"
import { ChevronDownIcon } from "lucide-react"
import * as React from "react"

export function DatePicker({
    onChange,
}: {
    onChange: (date: Date) => void
}) {
    const [date, setDate] = React.useState<Date>()

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    data-empty={!date}
                    className="data-[empty=true]:text-muted-foreground w-[212px] justify-between text-left font-normal"
                >
                    {date ? format(date, "EEEE, dd MMMM yyyy", { locale: id }) : <span>Pick a date</span>}
                    <ChevronDownIcon />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(value) => {
                        setDate(value)
                        onChange(value ?? new Date())
                    }}
                    defaultMonth={date}
                />
            </PopoverContent>
        </Popover>
    )
}
