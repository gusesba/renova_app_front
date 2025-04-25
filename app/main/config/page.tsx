"use client";
import Table from "@/components/table/Table";
import Box from "@/components/UI/Box";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";

type ProductConfig = {
    value: string;
};

const headersMapColor: Record<string, string> = {
    value: "Cor",
};

const headersMapSize: Record<string, string> = {
    value: "Tamanho",
};

const headersMapBrand: Record<string, string> = {
    value: "Marca",
};

const headersMapType: Record<string, string> = {
    value: "Produto",
};

const queryClient = new QueryClient();
export default function Config() {
    return (
        <Box>
            <div className="flex justify-between items-center mb-4 ">
                <h2 className="text-xl font-bold">Configurações</h2>
            </div>
            <QueryClientProvider client={new QueryClient()}>
                <div className="grid grid-cols-4">
                    <Table<ProductConfig>
                        headersMap={headersMapColor}
                        columnKeys={["value"]}
                        url="config/color"
                        canExpand={false}
                        canPaginate={false}
                        canSelect={false}
                    ></Table>
                    <Table<ProductConfig>
                        headersMap={headersMapSize}
                        columnKeys={["value"]}
                        url="config/size"
                        canExpand={false}
                        canPaginate={false}
                        canSelect={false}
                    ></Table>
                    <Table<ProductConfig>
                        headersMap={headersMapBrand}
                        columnKeys={["value"]}
                        url="config/brand"
                        canExpand={false}
                        canPaginate={false}
                        canSelect={false}
                    ></Table>
                    <Table<ProductConfig>
                        headersMap={headersMapType}
                        columnKeys={["value"]}
                        url="config/type"
                        canExpand={false}
                        canPaginate={false}
                        canSelect={false}
                    ></Table>
                </div>
            </QueryClientProvider>
        </Box>
    );
}
