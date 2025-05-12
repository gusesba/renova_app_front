import { useEffect, useState } from "react";

type Item = {
    id: string;
    value: string;
};

interface Client {
    id: string;
    name: string;
}

export const useProductConfig = () => {
    const [colors, setColors] = useState<Item[]>([]);
    const [types, setTypes] = useState<Item[]>([]);
    const [brands, setBrands] = useState<Item[]>([]);
    const [sizes, setSizes] = useState<Item[]>([]);
    const [clients, setClients] = useState<Client[]>([]);

    useEffect(() => {
        const fetchItemData = async (endpoint: string, setter: (data: Item[]) => void) => {
            try {
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/config/${endpoint}`,
                    {
                        credentials: "include",
                        headers: {
                            "Content-Type": "application/json",
                        },
                    },
                );

                if (!response.ok) throw new Error(`Erro ao buscar configurações.`);

                const data = await response.json();
                // Mapeia para garantir compatibilidade com `Item`
                const mappedItems: Item[] = data.items.map((item: any) => ({
                    id: item.id,
                    value: item.name || item.value,
                }));
                setter(mappedItems);
            } catch (error) {
                console.error(`Erro ao carregar configurações:`, error);
            }
        };

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

        fetchItemData("color", setColors);
        fetchItemData("type", setTypes);
        fetchItemData("brand", setBrands);
        fetchItemData("size", setSizes);
        fetchClients();
    }, []);

    return { colors, types, brands, sizes, clients };
};
