"use client"

import { useRouter } from "next/navigation";
import { BiLeftArrowAlt } from "react-icons/bi";
import { Button } from "../ui/button";

export default function BackButton({ url }: { url?: string }) {
    const router = useRouter();

    function handleBack() {
        if (url) {
            router.push(url);
        } else {
            router.back();
        }
    }

    return (
        <Button variant='secondary'
            onClick={handleBack} className="w-fit">
            <BiLeftArrowAlt /> Kembali
        </Button>
    )
}
