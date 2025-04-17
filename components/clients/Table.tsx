import React, { useCallback, useMemo, useState } from "react";
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
import debounce from "lodash.debounce";
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { arrayMove, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import DraggableHeader from "../table/DraggableHeader";
import { fetchClients, Client, Response } from "../table/fetchData";

export default function Table() {
    const [pageIndex, setPageIndex] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [columnOrder, setColumnOrder] = useState<string[]>(["id", "name", "phone"]);

    const { data, isLoading } = useQuery<Response<Client>>({
        queryKey: ["clients", pageIndex, pageSize, sorting, columnFilters],
        queryFn: () =>
            fetchClients({
                page: pageIndex + 1,
                pageSize,
                sorting,
                filters: columnFilters,
            }),
    });

    const debounceOnChange = useCallback(
        debounce((e, header) => header.column.setFilterValue(e.target.value), 500),
        [],
    );

    const columns = useMemo<ColumnDef<Client, any>[]>(
        () =>
            columnOrder.map((colKey) => {
                const defMap: Record<string, ColumnDef<Client, any>> = {
                    id: {
                        accessorKey: "id",
                        header: "ID",
                    },
                    name: {
                        accessorKey: "name",
                        header: "Name",
                    },
                    phone: {
                        accessorKey: "phone",
                        header: "Phone",
                    },
                };
                return defMap[colKey];
            }),
        [columnOrder],
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

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5, // Ou você pode usar delay: 200
            },
        }),
    );

    return (
        <div className="overflow-x-auto">
            <div className="max-h-96 overflow-y-auto">
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={(event) => {
                        const { active, over } = event;
                        if (active.id !== over?.id) {
                            setColumnOrder((prev) => {
                                const oldIndex = prev.indexOf(active.id as string);
                                const newIndex = prev.indexOf(over?.id as string);
                                return arrayMove(prev, oldIndex, newIndex);
                            });
                        }
                    }}
                >
                    <SortableContext
                        items={table.getHeaderGroups()[0].headers.map((h) => h.id)}
                        strategy={verticalListSortingStrategy}
                    >
                        <table className="min-w-full text-sm text-left border-collapse table-fixed">
                            <thead className="bg-gray">
                                {table.getHeaderGroups().map((headerGroup) => (
                                    <React.Fragment key={headerGroup.id}>
                                        <tr>
                                            {headerGroup.headers.map((header, idx) => (
                                                <DraggableHeader
                                                    key={header.id}
                                                    header={header}
                                                    isFirst={idx === 0} // Passa true somente para o primeiro
                                                    setColumnOrder={setColumnOrder}
                                                    allColumns={["id", "name", "phone"]}
                                                    columnOrder={columnOrder}
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
                                                                    ? header.column.getIsSorted() ===
                                                                      "asc"
                                                                        ? "↑"
                                                                        : "↓"
                                                                    : null}
                                                            </span>
                                                        </div>
                                                    )}
                                                </DraggableHeader>
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
                                                        onChange={(e) =>
                                                            debounceOnChange(e, header)
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
                                                  <td
                                                      key={`skeleton-cell-${i}-${j}`}
                                                      className="px-4 py-2"
                                                  >
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
                    </SortableContext>
                </DndContext>
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
