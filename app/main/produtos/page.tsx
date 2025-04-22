"use client";
import { AddProductModal } from "@/components/products/AddProductModal";
import Table from "@/components/table/Table";
import Box from "@/components/UI/Box";
import Button from "@/components/UI/Button";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React, { useState } from "react";

export interface Product {
    id: string;
    price: number;
    type: string;
    brand: string;
    size: string;
    color: string;
    providerId: string;
    description: string;
    entryDate?: Date;
}

const headersMap: Record<string, string> = {
    id: "Id",
    price: "Preço",
    type: "Produto",
    brand: "Marca",
    size: "Tamanho",
    color: "Cor",
    providerId: "Fornecedor",
    description: "Descrição",
    entryDate: "Entrada",
};

const queryClient = new QueryClient();
export default function Produtos() {
    const [modalOpen, setModalOpen] = useState(false);
    return (
        <Box>
            <div className="flex justify-between items-center mb-4 ">
                <h2 className="text-xl font-bold">Em Estoque</h2>
                <div className="mb-2">
                    <Button onClick={() => setModalOpen(true)}>Novo</Button>
                </div>
            </div>
            <QueryClientProvider client={queryClient}>
                <Table<Product>
                    columnKeys={[
                        "id",
                        "price",
                        "type",
                        "brand",
                        "size",
                        "color",
                        "providerId",
                        "description",
                        "entryDate",
                    ]}
                    url="products"
                    headersMap={headersMap}
                />
            </QueryClientProvider>

            <AddProductModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                onAddProduct={() => {}}
            />
        </Box>
    );
}
