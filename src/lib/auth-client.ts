import { createAuthClient } from "better-auth/react" // make sure to import from better-auth/react

export const authClient = createAuthClient({
    // better-auth akan otomatis menggunakan window.location.origin di client
    // Jika perlu, bisa set baseURL: process.env.NEXT_PUBLIC_APP_URL
})