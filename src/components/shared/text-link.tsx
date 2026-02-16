import Link from "next/link";

export default function TextLink({
    url,
    targetBlank,
    children
}: {
    url: string
    targetBlank?: boolean
    children: React.ReactNode
}) {
    return (
        <Link href={url} target={targetBlank ? "_blank" : undefined}
            className="hover:text-blue-500 hover:underline">
            {children}
        </Link>
    )
}
