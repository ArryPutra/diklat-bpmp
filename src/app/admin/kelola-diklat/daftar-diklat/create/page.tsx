"use server"

import { getAllMetodeDiklatAction } from "@/actions/metode-diklat";
import KelolaDiklatCreateView from "./view";

export default async function KelolaDiklatCreatePage() {
    return (
        <KelolaDiklatCreateView
            daftarMetodeDiklat={await getAllMetodeDiklatAction()} />
    )
}
