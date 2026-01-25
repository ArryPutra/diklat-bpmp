import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "@/app/globals.css";
import "@/lib/zod-i18n";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "Diklat BPMP Kalsel",
  description: "Diklat BPMP Kalsel",
  icons: {
    icon: "/icons/logo.svg",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${poppins.className} antialiased`}>
        {children}
      </body>
    </html>
  );
}
