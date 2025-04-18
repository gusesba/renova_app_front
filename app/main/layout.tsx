import AuthGuard from "@/components/auth/AuthGuard";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import React from "react";

export default function MainLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <AuthGuard>
            <div className="h-screen w-screen overflow-hidden font-sans">
                <Header />
                <Sidebar />

                <main className="pl-56 pt-16 h-full">{children}</main>
            </div>
        </AuthGuard>
    );
}
