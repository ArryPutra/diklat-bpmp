import { format } from "date-fns";
import { id } from "date-fns/locale";

export default function dateFormatted(date: string) {
    return format(new Date(date), "EEEE, dd MMMM yyyy", { locale: id })
}