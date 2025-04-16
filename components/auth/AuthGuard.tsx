"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const isTokenExpired = (token: string) => {
            try {
                const payload = JSON.parse(atob(token.split(".")[1]));
                const exp = payload.exp;
                const now = Math.floor(Date.now() / 1000);
                return exp < now;
            } catch (err) {
                return true; // Se der erro ao decodificar, trata como expirado
            }
        };

        const token = localStorage.getItem("token");

        if (!token || isTokenExpired(token)) {
            localStorage.removeItem("token");
            router.replace("/auth");
        } else {
            setIsLoading(false);
        }
    }, [router]);

    if (isLoading) {
        return null;
    }

    return <>{children}</>;
}
