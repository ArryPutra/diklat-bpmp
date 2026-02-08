import { format } from "date-fns";
import { id } from "date-fns/locale";

export function formatDateId(date: string) {
    return format(new Date(date), "EEEE, dd MMMM yyyy", { locale: id })
}

export function dateRangeFormatted(startDate: string, endDate: string) {
    const start = new Date(startDate)
    const end = new Date(endDate)

    if (
        start.getFullYear() === end.getFullYear() &&
        start.getMonth() === end.getMonth()
    ) {
        return `${format(start, "d", { locale: id })} - ${format(
            end,
            "d MMMM yyyy",
            { locale: id }
        )}`
    }

    if (start.getFullYear() === end.getFullYear()) {
        return `${format(start, "d MMMM", { locale: id })} - ${format(
            end,
            "d MMMM yyyy",
            { locale: id }
        )}`
    }

    return `${format(start, "d MMMM yyyy", { locale: id })} - ${format(
        end,
        "d MMMM yyyy",
        { locale: id }
    )}`
}
