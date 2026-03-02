import { APP_TIMEZONE, getDateKeyInTimeZone } from "@/lib/timezone";

export default function toDateInputValue(date?: Date | string | null) {
    if (!date) return undefined;

    return getDateKeyInTimeZone(date, APP_TIMEZONE)
}
