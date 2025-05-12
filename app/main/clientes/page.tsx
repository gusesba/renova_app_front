"use client";
import { AddClientModal } from "@/components/clients/AddClientModal";
import Table from "@/components/table/Table";
import Box from "@/components/UI/Box";
import Button from "@/components/UI/Button";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React, { useState } from "react";

export interface Client {
    id: string;
    name: string;
    phone: string;
}

const headersMap: Record<string, string> = {
    id: "ID",
    name: "Nome",
    phone: "Telefone",
};

const queryClient = new QueryClient();
export default function Clientes() {
    const [modalOpen, setModalOpen] = useState(false);

    return (
        <>
            <Box>
                <div className="flex justify-between items-center mb-4 ">
                    <h2 className="text-xl font-bold">Tabela de Clientes</h2>
                    <div className="flex gap-1 mb-2">
                        <Button onClick={() => setModalOpen(true)}>Novo</Button>
                    </div>
                </div>
                <QueryClientProvider client={queryClient}>
                    <Table<Client>
                        columnKeys={["id", "name", "phone"]}
                        url="clients"
                        headersMap={headersMap}
                    />
                </QueryClientProvider>
            </Box>
            <AddClientModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                onAddClient={() => {}}
            />
        </>
    );
}
