"use client"

import { useRouter } from "next/navigation";
import { BiLeftArrowAlt } from "react-icons/bi";
import { Button } from "../ui/button";

export default function BackButton() {
    const router = useRouter();

    return (
        <Button variant='secondary' className="mb-8"
            onClick={() => router.back()}>
            <BiLeftArrowAlt /> Kembali
        </Button>
    )
}
