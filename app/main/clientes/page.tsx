"use client";
import Box from "@/components/UI/Box";
import Button from "@/components/UI/Button";
import React, { useState } from "react";

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

export default function TabelaEstilizada() {
    return (
        <Box>
            <div className="flex justify-between items-center mb-4 shadow-md">
                <h2 className="text-xl font-bold">Tabela de Usuários</h2>
                <div className="mb-2">
                    <Button>Pesquisa Avançada</Button>
                </div>
            </div>

            <table className="min-w-full text-sm text-left">
                <thead>
                    <tr className="bg-gray">
                        {columns.map(({ column }) => (
                            <th key={column} className="px-4 py-2 cursor-pointer select-none">
                                <div className="flex items-center gap-1">
                                    {column.charAt(0).toUpperCase() + column.slice(1)}
                                    <span>↑</span>
                                </div>
                            </th>
                        ))}
                    </tr>
                    <tr>
                        {columns.map(({ column }) => (
                            <th key={column} className="px-4 py-2">
                                <input
                                    type="text"
                                    placeholder={`Buscar ${column}`}
                                    className="w-full px-2 py-1 border border-gray rounded bg-white"
                                />
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.map((row) => (
                        <tr key={row.id} className="hover:bg-gray transition">
                            <td className="px-4 py-2">{row.nome}</td>
                            <td className="px-4 py-2">{row.email}</td>
                            <td className="px-4 py-2">{row.telefone}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </Box>
    );
}
