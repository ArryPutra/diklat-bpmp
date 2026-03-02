import { APP_TIMEZONE } from "@/lib/timezone"

function toDate(date: Date | string) {
    return date instanceof Date ? date : new Date(date)
}

function getDateParts(date: Date | string) {
    const parts = new Intl.DateTimeFormat("en-CA", {
        timeZone: APP_TIMEZONE,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    }).formatToParts(toDate(date))

    return {
        year: parts.find((part) => part.type === "year")?.value ?? "",
        month: parts.find((part) => part.type === "month")?.value ?? "",
        day: parts.find((part) => part.type === "day")?.value ?? "",
    }
}

export function formatDateId(date: Date | string) {
    return new Intl.DateTimeFormat("id-ID", {
        timeZone: APP_TIMEZONE,
        weekday: "long",
        day: "2-digit",
        month: "long",
        year: "numeric",
    }).format(toDate(date))
}

export function dateRangeFormatted(startDate: Date | string, endDate: Date | string) {
    const start = toDate(startDate)
    const end = toDate(endDate)

    const startParts = getDateParts(start)
    const endParts = getDateParts(end)

    const startDay = new Intl.DateTimeFormat("id-ID", {
        timeZone: APP_TIMEZONE,
        day: "numeric",
    }).format(start)

    const startDayMonth = new Intl.DateTimeFormat("id-ID", {
        timeZone: APP_TIMEZONE,
        day: "numeric",
        month: "long",
    }).format(start)

    const endDayMonthYear = new Intl.DateTimeFormat("id-ID", {
        timeZone: APP_TIMEZONE,
        day: "numeric",
        month: "long",
        year: "numeric",
    }).format(end)

    const startDayMonthYear = new Intl.DateTimeFormat("id-ID", {
        timeZone: APP_TIMEZONE,
        day: "numeric",
        month: "long",
        year: "numeric",
    }).format(start)

    if (startParts.year === endParts.year && startParts.month === endParts.month) {
        return `${startDay} - ${endDayMonthYear}`
    }

    if (startParts.year === endParts.year) {
        return `${startDayMonth} - ${endDayMonthYear}`
    }

    return `${startDayMonthYear} - ${endDayMonthYear}`
}

export function formatDateTimeId(date: Date | string) {
    return new Intl.DateTimeFormat("id-ID", {
        timeZone: APP_TIMEZONE,
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
    }).format(toDate(date))
}