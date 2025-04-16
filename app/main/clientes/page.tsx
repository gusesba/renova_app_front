"use client";
import Table from "@/components/clients/Table";
import Box from "@/components/UI/Box";
import Button from "@/components/UI/Button";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";

type Row = {
    id: number;
    nome: string;
    email: string;
    telefone: string;
};

const columns = [
    { id: "nome", column: "Nome" },
    { id: "email", column: "Email" },
    { id: "telefone", column: "Telefone" },
];

const data: Row[] = [
    { id: 1, nome: "João Silva", email: "joao@email.com", telefone: "(41)99717-3484" },
    { id: 2, nome: "Maria Souza", email: "maria@email.com", telefone: "(41)99874-2498" },
    { id: 3, nome: "Carlos Lima", email: "carlos@email.com", telefone: "(41)3364-7375" },
];
const queryClient = new QueryClient();
export default function TabelaEstilizada() {
    return (
        <Box>
            <div className="flex justify-between items-center mb-4 shadow-md">
                <h2 className="text-xl font-bold">Tabela de Usuários</h2>
                <div className="mb-2">
                    <Button>Pesquisa Avançada</Button>
                </div>
            </div>
            <QueryClientProvider client={queryClient}>
                <Table />
            </QueryClientProvider>
        </Box>
    );
}
