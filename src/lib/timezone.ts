export const APP_TIMEZONE = "Asia/Makassar"

function toDate(value: Date | string): Date {
    return value instanceof Date ? value : new Date(value)
}

export function getDateKeyInTimeZone(
    date: Date | string,
    timeZone: string = APP_TIMEZONE
): string {
    const parts = new Intl.DateTimeFormat("en-CA", {
        timeZone,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    }).formatToParts(toDate(date))

    const year = parts.find((part) => part.type === "year")?.value
    const month = parts.find((part) => part.type === "month")?.value
    const day = parts.find((part) => part.type === "day")?.value

    return `${year}-${month}-${day}`
}

export function getCurrentHourMinuteInTimeZone(
    date: Date = new Date(),
    timeZone: string = APP_TIMEZONE
): string {
    return new Intl.DateTimeFormat("en-GB", {
        timeZone,
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
    }).format(date)
}

export function getUtcDayBoundsForUtcPlus8(date: Date = new Date()): {
    start: Date
    end: Date
} {
    const offsetMs = 8 * 60 * 60 * 1000
    const shifted = new Date(date.getTime() + offsetMs)

    const year = shifted.getUTCFullYear()
    const month = shifted.getUTCMonth()
    const day = shifted.getUTCDate()

    const start = new Date(Date.UTC(year, month, day, 0, 0, 0, 0) - offsetMs)
    const end = new Date(Date.UTC(year, month, day, 23, 59, 59, 999) - offsetMs)

    return { start, end }
}
