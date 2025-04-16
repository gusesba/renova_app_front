"use client";
import Table from "@/components/clients/Table";
import Box from "@/components/UI/Box";
import Button from "@/components/UI/Button";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";

const queryClient = new QueryClient();
export default function TabelaEstilizada() {
    return (
        <Box>
            <div className="flex justify-between items-center mb-4 shadow-md">
                <h2 className="text-xl font-bold">Tabela de Usuários</h2>
                <div className="mb-2">
                    <Button>Configurações</Button>
                </div>
            </div>
            <QueryClientProvider client={queryClient}>
                <Table />
            </QueryClientProvider>
        </Box>
    );
}
