import Layout from "@/components/layout/Layout";
import React from "react";

export default function MainLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return <Layout>{children}</Layout>;
}
