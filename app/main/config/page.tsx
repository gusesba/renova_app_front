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
    const onClick = async (value: string) => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/config/color`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ value }),
                credentials: "include",
            });

            if (!response.ok) {
                throw new Error("Falha ao criar cor.");
            }
            queryClient.invalidateQueries({
                predicate: (query) => query.queryKey[0] === "config/color",
                refetchType: "active",
            });
        } catch (error) {
            console.error(error);
            alert("Erro ao adicionar cor.");
        }
    };

    return (
        <Box>
            <div className="flex justify-between items-center mb-4 ">
                <h2 className="text-xl font-bold">Configurações</h2>
            </div>
            <QueryClientProvider client={queryClient}>
                <div className="grid grid-cols-4">
                    <Table<ProductConfig>
                        headersMap={headersMapColor}
                        columnKeys={["value"]}
                        url="config/color"
                        canExpand={false}
                        canPaginate={false}
                        canSelect={false}
                        canAddColumn={false}
                        emptyComponent={(value: string) => (
                            <tr
                                className="hover:bg-gray transition cursor-pointer"
                                onClick={() => {
                                    onClick(value);
                                }}
                            >
                                <td className="px-4 py-2">Adicionar</td>
                            </tr>
                        )}
                    />
                    <Table<ProductConfig>
                        headersMap={headersMapSize}
                        columnKeys={["value"]}
                        url="config/size"
                        canExpand={false}
                        canPaginate={false}
                        canAddColumn={false}
                        canSelect={false}
                    />
                    <Table<ProductConfig>
                        headersMap={headersMapBrand}
                        columnKeys={["value"]}
                        url="config/brand"
                        canExpand={false}
                        canAddColumn={false}
                        canPaginate={false}
                        canSelect={false}
                    />
                    <Table<ProductConfig>
                        headersMap={headersMapType}
                        columnKeys={["value"]}
                        url="config/type"
                        canExpand={false}
                        canPaginate={false}
                        canAddColumn={false}
                        canSelect={false}
                    />
                </div>
            </QueryClientProvider>
        </Box>
    );
}
