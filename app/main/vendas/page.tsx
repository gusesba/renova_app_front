"use client";
import Table from "@/components/sells/table/Table";
import Box from "@/components/UI/Box";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import { Product } from "../produtos/page";

export interface Sell {
    id: string;
    type: string;
    clientName: string;
    totalProducts: number;
    date: Date;
    products: Product[];
}

const headersMap: Record<string, string> = {
    id: "Id",
    type: "Tipo",
    clientName: "Cliente",
    totalProducts: "QTD Produtos",
    date: "Data",
};

const queryClient = new QueryClient();
export default function Vendas() {
    return (
        <Box>
            <div className="flex justify-between items-center mb-4 ">
                <h2 className="text-xl font-bold">Vendas</h2>
            </div>
            <QueryClientProvider client={queryClient}>
                <Table
                    columnKeys={["id", "type", "clientName", "totalProducts", "date"]}
                    url="sells"
                    headersMap={headersMap}
                />
            </QueryClientProvider>
        </Box>
    );
}
