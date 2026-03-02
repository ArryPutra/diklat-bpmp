import { APP_TIMEZONE, getCurrentHourMinuteInTimeZone } from "@/lib/timezone"

export function getCurrentHourMinute(date: Date = new Date()) {
    return getCurrentHourMinuteInTimeZone(date, APP_TIMEZONE)
}
