"use server";

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

        console.info(result)
    } catch (err) {
        console.error("Gagal mengirim email:", err);
        throw new Error("Email gagal dikirim");
    }
}
