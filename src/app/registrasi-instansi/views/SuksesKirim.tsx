import { Button } from '@/components/ui/button';
import { Check, Copy, Download } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import { useEffect, useRef, useState } from 'react';

export default function SuksesKirim({
    emailInstansi,
    passwordInstansi,
    emailPicInstansi,
    nomorTeleponInstansi,
    nomorTeleponPicInstansi,
    kodeTiketRegistrasi
}: {
    emailInstansi: string,
    passwordInstansi: string,
    emailPicInstansi: string,
    nomorTeleponInstansi: string,
    nomorTeleponPicInstansi: string,
    kodeTiketRegistrasi: string
}) {
    const router = useRouter();
    const [copied, setCopied] = useState(false);
    const hasDownloadedRef = useRef(false);

    const downloadAkunPdf = async () => {
        const pdfDoc = await PDFDocument.create();
        const page = pdfDoc.addPage([595.28, 841.89]);
        const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);
        const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

        const marginX = 56;
        let cursorY = 785;

        page.drawText('Data Akun Registrasi Instansi', {
            x: marginX,
            y: cursorY,
            size: 20,
            font: helveticaBold,
            color: rgb(0.1, 0.2, 0.4),
        });

        cursorY -= 34;
        page.drawText('Berikut data akun yang dapat digunakan untuk login dan pemantauan status registrasi.', {
            x: marginX,
            y: cursorY,
            size: 11,
            font: helvetica,
            color: rgb(0.25, 0.25, 0.25),
        });

        cursorY -= 40;

        const rows: Array<{ label: string; value: string }> = [
            { label: 'Email Instansi', value: emailInstansi || '-' },
            { label: 'Password', value: passwordInstansi || '-' },
            { label: 'Nomor Telepon Instansi', value: nomorTeleponInstansi || '-' },
            { label: 'Email PIC Instansi', value: emailPicInstansi || '-' },
            { label: 'Nomor Telepon PIC Instansi', value: nomorTeleponPicInstansi || '-' },
            { label: 'Kode Tiket Registrasi', value: kodeTiketRegistrasi || '-' },
            { label: 'Tanggal Unduh', value: new Date().toLocaleString('id-ID') },
        ];

        rows.forEach((row) => {
            page.drawText(`${row.label}:`, {
                x: marginX,
                y: cursorY,
                size: 11,
                font: helveticaBold,
                color: rgb(0.12, 0.12, 0.12),
            });

            page.drawText(row.value, {
                x: marginX + 170,
                y: cursorY,
                size: 11,
                font: helvetica,
                color: rgb(0.18, 0.18, 0.18),
            });

            cursorY -= 24;
        });

        cursorY -= 8;
        page.drawText('Simpan file ini dengan aman dan jangan bagikan password kepada pihak lain.', {
            x: marginX,
            y: cursorY,
            size: 10,
            font: helvetica,
            color: rgb(0.45, 0.08, 0.08),
        });

        const bytes = await pdfDoc.save();
        const buffer = new ArrayBuffer(bytes.length);
        new Uint8Array(buffer).set(bytes);
        const blob = new Blob([buffer], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');

        link.href = url;
        link.download = `data-akun-registrasi-instansi-${kodeTiketRegistrasi || 'tanpa-kode'}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }

    useEffect(() => {
        if (hasDownloadedRef.current) return;
        hasDownloadedRef.current = true;

        downloadAkunPdf();
    }, [emailInstansi, passwordInstansi, nomorTeleponInstansi, emailPicInstansi, nomorTeleponPicInstansi, kodeTiketRegistrasi]);

    const handleCopy = () => {
        navigator.clipboard.writeText(kodeTiketRegistrasi)
            .then(() => {
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            })
            .catch(() => {
                alert('Gagal menyalin kode.');
            });
    }

    return (
        <div className='flex flex-col items-center text-center'>
            <Image
                src='/images/illustrations/undraw_done_i0ak.png'
                alt='Undraw Done i0ak'
                width={1000}
                height={1000}
                className='w-72 animate-float' />
            <h1 className='font-bold text-xl animate-fade-in-up'>
                Pendaftaran Instansi <span className='gradient-text'>Berhasil</span> Dikirim!
            </h1>
            <p className='mb-6 text-muted-foreground animate-fade-in-up delay-100'>
                Saat ini akun sedang menunggu proses verifikasi oleh Admin.
            </p>

            <div className='border py-3 px-4 text-sm mb-6 rounded-xl w-full animate-fade-in-up delay-200 hover-lift transition-all duration-300'>
                <h1>Informasi hasil verifikasi akan dikirimkan melalui:</h1>
                <p className='mt-2'>
                    Email: <b>{emailPicInstansi}</b>
                </p>

                <div className='mt-6'>
                    <p className='mb-2'>Kode Tiket Registrasi:</p>
                    <div className='flex items-center justify-center gap-2'>
                        <div className='font-bold bg-gray-100 p-2 w-fit rounded-md'>
                            {kodeTiketRegistrasi}
                        </div>
                        <Button
                            size='sm'
                            variant='outline'
                            onClick={handleCopy}
                            className='hover-lift p-2 rounded-md'
                        >
                            {copied ? <Check className='w-4 h-4 text-green-500' /> : <Copy className='w-4 h-4' />}
                        </Button>
                    </div>
                    <p className='text-xs text-gray-500 mt-2 mb-4'>Kode Tiket Registrasi dapat digunakan untuk melacak status verifikasi.</p>
                    <Button variant='outline' onClick={downloadAkunPdf} className='hover-lift'>
                        <Download className='w-4 h-4' /> Unduh Data Akun (PDF)
                    </Button>
                </div>
            </div>

            <div className='flex gap-3 flex-wrap justify-center animate-fade-in-up delay-300'>
                <Button variant='secondary' onClick={() => router.push('/')} className='hover-lift'>
                    Halaman Utama
                </Button>
                <Button onClick={() => router.push('/registrasi-instansi/cek-status')} className='hover-lift'>
                    Cek Status
                </Button>
            </div>
        </div>
    )
}
