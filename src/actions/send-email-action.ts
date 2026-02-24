"use server";

import logger from "@/lib/logger";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmailAction({
    toEmail,
    subject,
    html,
}: {
    toEmail: string,
    subject: string,
    html: string,
}) {
    try {
        const result = await resend.emails.send({
            from: "no-reply@bpmpkalsel.web.id",
            to: toEmail,
            subject: subject,
            html: html,
        });

        logger.info("Email terkirim", "send-email-action", { to: toEmail, subject })
    } catch (err) {
        logger.error("Gagal mengirim email", "send-email-action", err, { toEmail, subject })
        throw new Error("Email gagal dikirim");
    }
}
