"use server"

import cloudinary from "@/lib/cloudinary"

type State = {
    success?: boolean
    message?: string
    url?: string
}

export async function uploadPdf(
prevState: State,
    formData: FormData
): Promise<State> {
    try {
        const file= formData.get("file") as File

        if (!file || file.size === 0) {
            return { success: false, message: "File tidak ditemukan" }
        }

        if (file.type !== "application/pdf") {
            return { success: false, message: "File harus PDF" }
        }

        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)

        const result: any = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream(
                {
                    resource_type: "raw",
                    folder: "templates-sertifikat",
                    use_filename: true,
                    format: "pdf"
                },
                (error, result) => {
                    if (error) reject(error)
                    else resolve(result)
                }
            ).end(buffer)
        })

        return {
            success: true,
            message: "Berhasil upload template",
            url: result.secure_url,
        }
    } catch (error) {
        return {
            success: false,
            message: "Terjadi kesalahan saat upload",
        }
    }
}