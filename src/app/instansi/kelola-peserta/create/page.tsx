"use server"

import { getCurrentUser } from "@/actions/auth-action";
import prisma from "@/lib/prisma";
import KelolaPesertaCreateView from "./view";

export default async function KelolaPesertaCreatePage() {
    return (
        <KelolaPesertaCreateView />
    )
}
