import type { Metadata } from "next";
import { Quicksand } from "next/font/google";
import "./globals.css";

export const metadata: Metadata = {
    title: "RenovaApp",
    description: "RenovaApp é um app de gerenciamento de brechó",
};

const quicksand = Quicksand({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"],
    display: "swap",
    variable: "--font-quicksand",
});

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className={`${quicksand.variable}`}>
            <body className={`antialiased`}>{children}</body>
        </html>
    );
}
