"use client";
import Table from "@/components/table/Table";
import Box from "@/components/UI/Box";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import { headersMapProduct, Product } from "../produtos/page";

export interface Sell {
    id: string;
    type: string;
    clientName: string;
    totalProducts: number;
    date: Date;
    products: Product[];
}

const headersMapSell: Record<string, string> = {
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
                    ref={null}
                    columnKeys={["id", "type", "clientName", "totalProducts", "date"]}
                    formatColumns={{
                        type: (x) => {
                            if (x === "sell") return "Venda";
                            else if (x === "donation") return "Doação";
                            else return "Devolução";
                        },
                    }}
                    url="sells"
                    headersMap={headersMapSell}
                    canExpand={true}
                    expandedComponent={(id: string) => (
                        <Table<Product>
                            columnKeys={[
                                "id",
                                "price",
                                "type",
                                "brand",
                                "size",
                                "color",
                                "providerName",
                                "description",
                                "entryDate",
                            ]}
                            ref={null}
                            url={`sells/${id}/products`}
                            headersMap={headersMapProduct}
                            canPaginate={false}
                            canSelect={false}
                            canFilter={false}
                        />
                    )}
                    expandedTitle="Produtos"
                />
            </QueryClientProvider>
        </Box>
    );
}
