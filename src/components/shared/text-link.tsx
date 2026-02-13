import Link from "next/link";

export default function TextLink({
    url,
    value
}: {
    url: string
    value: string
}) {
    return (
        <Link href={url}
            className="hover:text-blue-500 hover:underline">
            {value}
        </Link>
    )
}
