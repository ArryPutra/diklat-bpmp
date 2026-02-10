import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { admin } from 'better-auth/plugins';
import prisma from "./prisma";

export const auth = betterAuth({
    emailAndPassword: {
        enabled: true,
        autoSignIn: false
    },
    user: {
        additionalFields: {
            peranId: {
                type: "number",
                required: true,
                input: true
            }
        }
    },
    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),

    plugins: [nextCookies(), admin()]
})