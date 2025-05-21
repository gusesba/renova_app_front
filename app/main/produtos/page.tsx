"use client";
import { AddProductModal } from "@/components/products/AddProductModal";
import Table, { TablesRef } from "@/components/table/Table";
import Box from "@/components/UI/Box";
import Button from "@/components/UI/Button";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React, { useRef, useState } from "react";
import { FaTrash } from "react-icons/fa";

export interface Product {
    id: string;
    codeRef: string;
    price: number;
    type: string;
    brand: string;
    size: string;
    color: string;
    providerName: string;
    description: string;
    entryDate?: Date;
}

export const headersMapProduct: Record<string, string> = {
    id: "Id",
    codeRef: "Código",
    price: "Preço",
    type: "Produto",
    brand: "Marca",
    size: "Tamanho",
    color: "Cor",
    providerName: "Fornecedor",
    description: "Descrição",
    entryDate: "Entrada",
};

const queryClient = new QueryClient();
export default function Produtos() {
    const [modalOpen, setModalOpen] = useState(false);

    const tablesRef = useRef<TablesRef>({});

    const handleDeleteAll = () => {
        // @ts-ignore
        Object.values(tablesRef.current).forEach((action) => {
            action.deleteSelectedItems();
        });
    };

    return (
        <Box>
            <div className="flex justify-between items-center mb-4 ">
                <h2 className="text-xl font-bold">Em Estoque</h2>
                <div className="flex gap-1 mb-2">
                    <Button variant="error" onClick={handleDeleteAll}>
                        <FaTrash />
                    </Button>
                    <Button onClick={() => setModalOpen(true)}>Novo</Button>
                </div>
            </div>
            <QueryClientProvider client={queryClient}>
                <Table<Product>
                    columnKeys={[
                        "id",
                        "codeRef",
                        "price",
                        "type",
                        "brand",
                        "size",
                        "color",
                        "providerName",
                        "description",
                        "entryDate",
                    ]}
                    url="products/unsold"
                    headersMap={headersMapProduct}
                    ref={tablesRef}
                />
            </QueryClientProvider>

            <AddProductModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                onAddProduct={() => {
                    queryClient.invalidateQueries({
                        predicate: (query) => {
                            return query.queryKey[0] === `products/unsold`;
                        },
                        refetchType: "active",
                    });
                }}
            />
        </Box>
    );
}
