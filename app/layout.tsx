import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
    title: "RenovaApp",
    description: "RenovaApp é um app de gerenciamento de brechó",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={`antialiased`}>{children}</body>
        </html>
    );
}
