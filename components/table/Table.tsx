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
import DraggableHeader from "./DraggableHeader";
import { fetchData, TableResponse } from "./fetchData";

export default function Table<T>({
    columnKeys,
    url,
    headersMap,
}: {
    columnKeys: string[];
    url: string;
    headersMap: Record<string, string>;
}) {
    const [pageIndex, setPageIndex] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [columnOrder, setColumnOrder] = useState<string[]>(columnKeys);
    const [selectedRowIds, setSelectedRowIds] = useState<Record<string, boolean>>({});

    const { data, isLoading, isFetching } = useQuery<TableResponse<T>>({
        queryKey: [url, pageIndex, pageSize, sorting, columnFilters],
        queryFn: () =>
            fetchData({
                page: pageIndex + 1,
                pageSize,
                sorting,
                filters: columnFilters,
                url,
            }),
    });

    const debounceOnChange = useCallback(
        debounce((e, header) => header.column.setFilterValue(e.target.value), 500),
        [],
    );

    const columns = useMemo<ColumnDef<T, any>[]>(() => {
        return columnOrder.map((key) => ({
            accessorKey: key,
            header: headersMap[key],
        }));
    }, [columnOrder]);

    const table = useReactTable({
        data: data?.items || [],
        columns,
        pageCount: data?.totalPages ?? 1,
        state: {
            pagination: { pageIndex, pageSize },
            sorting,
            columnFilters,
            rowSelection: selectedRowIds,
        },
        onPaginationChange: (updater) => {
            const newState =
                typeof updater === "function" ? updater({ pageIndex, pageSize }) : updater;
            setPageIndex(newState.pageIndex);
            setPageSize(newState.pageSize);
        },
        enableRowSelection: true,
        onRowSelectionChange: setSelectedRowIds,
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
                            <thead>
                                {table.getHeaderGroups().map((headerGroup) => (
                                    <React.Fragment key={headerGroup.id}>
                                        <tr>
                                            <th className="bg-gray-50">
                                                <div className="flex items-center justify-center h-full">
                                                    <label className="flex items-center cursor-pointer relative">
                                                        <input
                                                            type="checkbox"
                                                            checked={table.getIsAllRowsSelected()}
                                                            onChange={table.getToggleAllRowsSelectedHandler()}
                                                            className="peer h-4 w-4 cursor-pointer transition-all appearance-none rounded shadow hover:shadow-md border border-slate-300 checked:bg-primary checked:border-primary"
                                                            id="check1"
                                                        />
                                                        <span className="absolute text-white opacity-0 peer-checked:opacity-100 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                                                            <svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                className="h-3.5 w-3.5"
                                                                viewBox="0 0 20 20"
                                                                fill="currentColor"
                                                                stroke="currentColor"
                                                                strokeWidth="1"
                                                            >
                                                                <path
                                                                    fillRule="evenodd"
                                                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                                    clipRule="evenodd"
                                                                ></path>
                                                            </svg>
                                                        </span>
                                                    </label>
                                                </div>
                                            </th>
                                            {headerGroup.headers.map((header, idx) => (
                                                <DraggableHeader
                                                    key={header.id}
                                                    header={header.id}
                                                    isFirst={idx === 0} // Passa true somente para o primeiro
                                                    setColumnOrder={setColumnOrder}
                                                    allColumns={columnKeys}
                                                    columnOrder={columnOrder}
                                                    headersMap={headersMap}
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
                                            <th></th>
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
                                                        className="w-full px-2 py-1 border border-gray rounded focus:ring-primary focus:ring-2 outline-none"
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
                                              <td>
                                                  <div className="flex items-center justify-center h-full">
                                                      <label className="flex items-center cursor-pointer relative">
                                                          <input
                                                              type="checkbox"
                                                              checked={row.getIsSelected()}
                                                              disabled={!row.getCanSelect()}
                                                              onChange={row.getToggleSelectedHandler()}
                                                              className="peer h-4 w-4 cursor-pointer transition-all appearance-none rounded shadow hover:shadow-md border border-slate-300 checked:bg-primary checked:border-primary"
                                                              id="check1"
                                                          />
                                                          <span className="absolute text-white opacity-0 peer-checked:opacity-100 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                                                              <svg
                                                                  xmlns="http://www.w3.org/2000/svg"
                                                                  className="h-3.5 w-3.5"
                                                                  viewBox="0 0 20 20"
                                                                  fill="currentColor"
                                                                  stroke="currentColor"
                                                                  strokeWidth="1"
                                                              >
                                                                  <path
                                                                      fillRule="evenodd"
                                                                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                                      clipRule="evenodd"
                                                                  ></path>
                                                              </svg>
                                                          </span>
                                                      </label>
                                                  </div>
                                              </td>
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
                        disabled={!table.getCanPreviousPage() || isFetching || isLoading}
                        size="md"
                    >
                        ←
                    </Button>
                    <Button
                        size="md"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage() || isFetching || isLoading}
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
