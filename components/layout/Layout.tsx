"use client";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import React, { useState } from "react";

export default function Layout({ children }: React.PropsWithChildren) {
    const [sidebarOpen, setSidebarOpen] = useState(true);

    const toggleSidebar = () => setSidebarOpen((prev) => !prev);

    return (
        <div className="h-screen w-screen overflow-hidden font-sans">
            <Header onToggleSidebar={toggleSidebar} sidebarOpen={sidebarOpen} />
            <Sidebar isOpen={sidebarOpen} />

            <main
                className={`pt-16 transition-all duration-300 ${sidebarOpen ? "pl-56" : "pl-16"}`}
            >
                {children}
            </main>
        </div>
    );
}
