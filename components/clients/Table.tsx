import React, { useMemo, useState } from "react";
import {
    useReactTable,
    getCoreRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    getFilteredRowModel,
    flexRender,
    ColumnDef,
    SortingState,
    ColumnFiltersState,
} from "@tanstack/react-table";
import { useQuery } from "@tanstack/react-query";
import Button from "../UI/Button";

interface Client {
    id: string;
    name: string;
    phone: string;
}

interface FetchParams {
    page: number;
    pageSize: number;
    sorting: SortingState;
    filters: ColumnFiltersState;
}

interface Response {
    items: Client[];
    totalPages: number;
}

const fetchClients = async ({
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

    if (!res.ok) throw new Error("Network response was not ok");
    return res.json();
};

export default function Table() {
    const [pageIndex, setPageIndex] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

    const { data, isLoading } = useQuery<Response>({
        queryKey: ["clients", pageIndex, pageSize, sorting, columnFilters],
        queryFn: () =>
            fetchClients({
                page: pageIndex + 1,
                pageSize,
                sorting,
                filters: columnFilters,
            }),
    });

    const columns = useMemo<ColumnDef<Client, any>[]>(
        () => [
            {
                accessorKey: "id",
                header: "ID",
            },
            {
                accessorKey: "name",
                header: "Name",
            },
            {
                accessorKey: "phone",
                header: "Phone",
            },
        ],
        [],
    );

    const table = useReactTable({
        data: data?.items || [],
        columns,
        pageCount: data?.totalPages ?? 1,
        state: {
            pagination: { pageIndex, pageSize },
            sorting,
            columnFilters,
        },
        onPaginationChange: (updater) => {
            const newState =
                typeof updater === "function" ? updater({ pageIndex, pageSize }) : updater;
            setPageIndex(newState.pageIndex);
            setPageSize(newState.pageSize);
        },
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        manualPagination: true,
        manualSorting: true,
        manualFiltering: true,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
    });

    return (
        <div className="overflow-x-auto">
            <div className="max-h-96 overflow-y-auto">
                <table className="min-w-full text-sm text-left border-collapse table-fixed">
                    <thead className="bg-gray">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <React.Fragment key={headerGroup.id}>
                                <tr>
                                    {headerGroup.headers.map((header) => (
                                        <th
                                            key={header.id}
                                            className="px-4 py-2 bg-gray cursor-pointer select-none"
                                        >
                                            {header.isPlaceholder ? null : (
                                                <div
                                                    onClick={header.column.getToggleSortingHandler()}
                                                    className="flex items-center gap-1"
                                                >
                                                    {flexRender(
                                                        header.column.columnDef.header,
                                                        header.getContext(),
                                                    )}
                                                    <span>
                                                        {header.column.getIsSorted()
                                                            ? header.column.getIsSorted() === "asc"
                                                                ? "↑"
                                                                : "↓"
                                                            : null}
                                                    </span>
                                                </div>
                                            )}
                                        </th>
                                    ))}
                                </tr>
                                <tr>
                                    {headerGroup.headers.map((header) => (
                                        <th
                                            key={`busca_${header.id}`}
                                            className="px-4 py-2 bg-white"
                                        >
                                            <input
                                                type="text"
                                                placeholder={`Buscar ${flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext(),
                                                )}`}
                                                value={header.column.getFilterValue() as string}
                                                onChange={(e) =>
                                                    header.column.setFilterValue(e.target.value)
                                                }
                                                className="w-full px-2 py-1 border border-gray rounded"
                                            />
                                        </th>
                                    ))}
                                </tr>
                            </React.Fragment>
                        ))}
                    </thead>
                    <tbody>
                        {isLoading
                            ? [...Array(pageSize)].map((_, i) => (
                                  <tr key={`skeleton-${i}`} className="animate-pulse">
                                      {columns.map((col, j) => (
                                          <td key={`skeleton-cell-${i}-${j}`} className="px-4 py-2">
                                              <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                                          </td>
                                      ))}
                                  </tr>
                              ))
                            : table.getRowModel().rows.map((row) => (
                                  <tr key={row.id} className="hover:bg-gray transition">
                                      {row.getVisibleCells().map((cell) => (
                                          <td key={cell.id} className="px-4 py-2">
                                              {flexRender(
                                                  cell.column.columnDef.cell,
                                                  cell.getContext(),
                                              )}
                                          </td>
                                      ))}
                                  </tr>
                              ))}
                    </tbody>
                </table>
            </div>

            <div className="flex justify-between items-center mt-4">
                <div className="flex gap-2">
                    <Button
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                        size="md"
                    >
                        ←
                    </Button>
                    <Button
                        size="md"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        →
                    </Button>
                </div>
                <span>
                    Page{" "}
                    <strong>
                        {pageIndex + 1} of {data?.totalPages || 1}
                    </strong>
                </span>
            </div>
        </div>
    );
}
