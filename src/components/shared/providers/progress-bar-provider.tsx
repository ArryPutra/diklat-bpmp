"use client"

import { ProgressProvider } from "@bprogress/next/app";

export default function ProgressBarProvider({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <ProgressProvider
            height="3px"
            options={{ showSpinner: false }}
            shallowRouting
            stopDelay={200}
        >
            {children}
        </ProgressProvider>
    );
}