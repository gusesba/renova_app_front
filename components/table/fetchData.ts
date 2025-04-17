import { ColumnFiltersState, SortingState } from "@tanstack/react-table";

export interface FetchParams {
    page: number;
    pageSize: number;
    sorting: SortingState;
    filters: ColumnFiltersState;
}

export interface Response {
    items: Client[];
    totalPages: number;
}

export interface Client {
    id: string;
    name: string;
    phone: string;
}

export const fetchClients = async ({
    page,
    pageSize,
    sorting,
    filters,
}: FetchParams): Promise<Response> => {
    const params = new URLSearchParams({
        page: String(page),
        pageSize: String(pageSize),
    });

    if (sorting.length) {
        params.append("orderByField", sorting[0].id);
        params.append("orderByDirection", sorting[0].desc ? "desc" : "asc");
    }

    filters.forEach((filter) => {
        if (filter.value) {
            params.append(filter.id, String(filter.value));
        }
    });

    const token = localStorage.getItem("token");

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/clients?${params.toString()}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!res.ok) throw new Error("Erro ao buscar clientes");
    return res.json();
};