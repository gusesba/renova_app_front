"use client";
import DraggableHeader from "@/components/table/DraggableHeader";
import Box from "@/components/UI/Box";
import SearchableSelect from "@/components/UI/SearchableSelect";
import { closestCenter, DndContext, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { arrayMove, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import React, { useEffect, useState } from "react";
import { Client } from "../clientes/page";
import { SubmitHandler, useForm } from "react-hook-form";

type Produto = {
    id: string;
    price: number;
    type: string;
    brand: string;
    size: string;
    color: string;
    description: string;
    entryDate: string;
    providerId: string;
};

type VendaForm = {
    clientId: string;
    type: "sell" | "donation" | "return";
};

export default function Venda() {
    const [productId, setProductId] = useState("");
    const [error, setError] = useState("");
    const [desconto, setDesconto] = useState(0);
    const [clients, setClients] = useState<Client[]>([]);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<VendaForm>();

    useEffect(() => {
        const fetchClients = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/clients`, {
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                if (!response.ok) throw new Error("Erro ao buscar fornecedores.");

                const data = await response.json();
                setClients(data.items);
            } catch (error) {
                console.error("Erro ao carregar fornecedores:", error);
            }
        };

        fetchClients();
    }, []);

    const fetchProduto = async () => {
        if (!productId.trim()) return;

        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/products/sell/${productId}`,
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include",
                },
            );
            if (!res.ok) {
                const errorBody = await res.json().catch(() => null);
                const errorMessage = errorBody?.message || "Erro ao buscar produto";
                throw new Error(errorMessage);
            }

            const produto: Produto = await res.json();

            // Evita duplicatas
            const alreadyExists = data.some((item) => item.id === produto.id);
            if (alreadyExists) {
                console.log("Produto já adicionado", produto.id);
                setError("Produto já adicionado");
                return;
            }

            setData((prev) => [...prev, produto]);
            setProductId("");
            setError("");
        } catch (err: any) {
            setError(err.message || "Erro ao buscar produto");
        }
    };

    const finalizarVenda: SubmitHandler<VendaForm> = async (vendaForm) => {
        if (data.length === 0) {
            setError("É necessário adicionar produtos e um cliente");
            return;
        }

        if (vendaForm.type === "return") {
            for (const item of data) {
                if (item.providerId !== vendaForm.clientId) {
                    setError(`Peça ${item.id} não pertence ao cliente selecionado`);
                    return;
                }
            }
        }

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/sells`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({
                    clientId: vendaForm.clientId,
                    type: vendaForm.type,
                    productIds: data.map((item) => item.id),
                }),
            });

            if (!res.ok) throw new Error("Erro ao finalizar venda");

            alert("Venda finalizada com sucesso!");
            setData([]);
            setDesconto(0);
            setError("");
        } catch (err: any) {
            setError(err.message || "Erro ao finalizar venda");
        }
    };

    const headersMap: Record<string, string> = {
        id: "Id",
        price: "Preço",
        type: "Produto",
        brand: "Marca",
        size: "Tamanho",
        color: "Cor",
        description: "Descrição",
        entryDate: "Entrada",
    };

    const columns = ["id", "price", "type", "brand", "size", "color", "description", "entryDate"];

    const [columnKeys, setColumnKeys] = useState(columns);

    const [data, setData] = useState<Produto[]>([]);

    const total = data.reduce((acc, item) => acc + item.price, 0);
    const final = total - desconto;

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5, // Ou você pode usar delay: 200
            },
        }),
    );

    return (
        <Box>
            <div className="flex justify-between items-center mb-4 ">
                <h2 className="text-xl font-bold">Nova Venda</h2>
                <div className="flex gap-2 items-center mb-4">
                    <input
                        type="text"
                        placeholder="ID do produto"
                        value={productId}
                        onChange={(e) => setProductId(e.target.value)}
                        className="border border-gray-300 px-2 py-1 rounded w-48"
                    />
                    <button
                        onClick={fetchProduto}
                        className="bg-primary text-white px-4 py-1 rounded hover:bg-secondary transition"
                    >
                        Adicionar Produto
                    </button>
                    {error && <span className="text-error text-sm ml-2">{error}</span>}
                    <SearchableSelect<VendaForm>
                        id="type"
                        options={[
                            { label: "Venda", value: "sell" },
                            { label: "Doação", value: "donation" },
                            { label: "Devolução", value: "return" },
                        ]}
                        defaultValue="sell"
                        register={register}
                        rules={{ required: "Selecione um Tipo" }}
                        errorMessage={errors.clientId?.message}
                    />
                    <SearchableSelect<VendaForm>
                        id="clientId"
                        options={clients.map((c) => ({ label: c.name, value: c.id }))}
                        register={register}
                        rules={{ required: "Selecione um cliente" }}
                        errorMessage={errors.clientId?.message}
                    />
                    <button
                        onClick={handleSubmit(finalizarVenda)}
                        className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700 transition"
                    >
                        Finalizar Venda
                    </button>
                </div>
            </div>
            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={(event) => {
                    const { active, over } = event;
                    if (active.id !== over?.id) {
                        setColumnKeys((prev) => {
                            const oldIndex = prev.indexOf(active.id as string);
                            const newIndex = prev.indexOf(over?.id as string);
                            return arrayMove(prev, oldIndex, newIndex);
                        });
                    }
                }}
            >
                <SortableContext items={columnKeys} strategy={verticalListSortingStrategy}>
                    <table className="min-w-full text-sm text-left border-collapse table-fixed">
                        <thead>
                            <tr>
                                {columnKeys.map((key, idx) => (
                                    <DraggableHeader
                                        allColumns={columns}
                                        columnOrder={columnKeys}
                                        key={key}
                                        headersMap={headersMap}
                                        setColumnOrder={setColumnKeys}
                                        header={key}
                                        isFirst={idx === 0}
                                    >
                                        <div className="flex items-center gap-1">
                                            {headersMap[key]}
                                        </div>
                                    </DraggableHeader>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((item) => (
                                <tr key={item.id} className="hover:bg-gray transition">
                                    {columnKeys.map((key) => (
                                        <td key={`${key}_${item.id}`} className="px-4 py-2">
                                            {item[key as keyof Produto]}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                        <tfoot className="border-t-gray-300 border-t">
                            <tr>
                                <td
                                    colSpan={Math.ceil(columnKeys.length / 3)}
                                    className="px-4 py-2 font-semibold text-center"
                                >
                                    Total - {`R$${total.toFixed(2)}`}
                                </td>
                                <td
                                    colSpan={Math.ceil(columnKeys.length / 3)}
                                    className="px-4 py-2 font-semibold text-center"
                                >
                                    <label className="flex items-center justify-center gap-2">
                                        Desconto -
                                        <input
                                            type="number"
                                            value={desconto}
                                            onChange={(e) =>
                                                setDesconto(parseFloat(e.target.value) || 0)
                                            }
                                            className="w-24 border border-gray-300 rounded px-1 text-right"
                                        />
                                    </label>
                                </td>
                                <td
                                    colSpan={
                                        columnKeys.length - 2 * Math.ceil(columnKeys.length / 3)
                                    }
                                    className="px-4 py-2 font-semibold text-center"
                                >
                                    Final - R${final.toFixed(2)}
                                </td>
                            </tr>
                        </tfoot>
                    </table>
                </SortableContext>
            </DndContext>
        </Box>
    );
}
