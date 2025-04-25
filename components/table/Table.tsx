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
    getExpandedRowModel,
} from "@tanstack/react-table";
import { useQuery } from "@tanstack/react-query";
import Button from "../UI/Button";
import debounce from "lodash.debounce";
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { arrayMove, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import DraggableHeader from "./DraggableHeader";
import { fetchData, TableResponse } from "./fetchData";
import Box from "../UI/Box";

export default function Table<T>({
    columnKeys,
    url,
    headersMap,
    canExpand = false,
    canSelect = true,
    canPaginate = true,
    canFilter = true,
    expandedComponent,
    expandedTitle = "Detalhes",
}: {
    columnKeys: string[];
    url: string;
    headersMap: Record<string, string>;
    canExpand?: boolean;
    canSelect?: boolean;
    canPaginate?: boolean;
    canFilter?: boolean;
    expandedComponent?: (id: string) => React.JSX.Element;
    expandedTitle?: string;
}) {
    const [pageIndex, setPageIndex] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [columnOrder, setColumnOrder] = useState<string[]>(columnKeys);
    const [selectedRowIds, setSelectedRowIds] = useState<Record<string, boolean>>({});
    const [expanded, setExpanded] = useState({});
    const [dateFilters, setDateFilters] = useState<
        Record<string, { start: string | null; end: string | null }>
    >({});

    const { data, isLoading, isFetching } = useQuery<TableResponse<T>>({
        queryKey: [url, pageIndex, pageSize, sorting, columnFilters, dateFilters],
        queryFn: () =>
            fetchData({
                page: pageIndex + 1,
                pageSize,
                sorting,
                filters: [
                    ...columnFilters,
                    ...Object.keys(dateFilters).flatMap((field) => {
                        const { start, end } = dateFilters[field];
                        const result: { id: string; value: string }[] = [];

                        if (start) result.push({ id: `${field}Start`, value: start });
                        if (end) result.push({ id: `${field}End`, value: end });

                        return result;
                    }),
                ],

                url,
            }),
    });

    const handleDateFilterChange = (
        e: React.ChangeEvent<HTMLInputElement>,
        field: string,
        type: "start" | "end",
    ) => {
        setDateFilters((prev) => ({
            ...prev,
            [field]: {
                ...prev[field],
                [type]: e.target.value,
            },
        }));
    };

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
            expanded,
        },
        onPaginationChange: (updater) => {
            const newState =
                typeof updater === "function" ? updater({ pageIndex, pageSize }) : updater;
            setPageIndex(newState.pageIndex);
            setPageSize(newState.pageSize);
        },
        enableRowSelection: canSelect,
        enableFilters: canFilter,
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
        onExpandedChange: (updater) => {
            setExpanded((prev) => {
                const newExpanded = typeof updater === "function" ? updater(prev) : updater;

                for (const key of Object.keys(newExpanded)) {
                    for (const prevKey of Object.keys(prev)) {
                        console.log("key", key, "prevKey", prevKey);
                        if (key !== prevKey) {
                            console.log({ [key]: true });
                            return { [key]: true };
                        }
                    }
                }

                return newExpanded;
            });
        },

        getExpandedRowModel: getExpandedRowModel(),
        getRowCanExpand: () => canExpand,
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
                                            {canSelect && (
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
                                            )}
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
                                        {canFilter && (
                                            <tr>
                                                {canSelect && <th></th>}
                                                {headerGroup.headers.map((header) => {
                                                    const isDateColumn = header.column.id
                                                        .toLowerCase()
                                                        .includes("date"); // Pode ser qualquer lógica para identificar colunas de data

                                                    return (
                                                        <th
                                                            key={`busca_${header.id}`}
                                                            className="px-4 py-2 bg-white"
                                                        >
                                                            {isDateColumn ? (
                                                                <div className="flex gap-1">
                                                                    <input
                                                                        type="date"
                                                                        value={
                                                                            dateFilters[
                                                                                header.column.id
                                                                            ]?.start || ""
                                                                        }
                                                                        onChange={(e) =>
                                                                            handleDateFilterChange(
                                                                                e,
                                                                                header.column.id,
                                                                                "start",
                                                                            )
                                                                        }
                                                                        className="px-2 py-1 border border-gray rounded max-w-[35px] outline-none border-none"
                                                                    />
                                                                    <input
                                                                        type="date"
                                                                        value={
                                                                            dateFilters[
                                                                                header.column.id
                                                                            ]?.end || ""
                                                                        }
                                                                        onChange={(e) =>
                                                                            handleDateFilterChange(
                                                                                e,
                                                                                header.column.id,
                                                                                "end",
                                                                            )
                                                                        }
                                                                        className="px-2 py-1 border border-gray rounded max-w-[35px] outline-none border-none"
                                                                    />
                                                                </div>
                                                            ) : (
                                                                <input
                                                                    type="text"
                                                                    placeholder={`Buscar ${flexRender(
                                                                        header.column.columnDef
                                                                            .header,
                                                                        header.getContext(),
                                                                    )}`}
                                                                    onChange={(e) =>
                                                                        debounceOnChange(e, header)
                                                                    }
                                                                    className="w-full px-2 py-1 border border-gray rounded max-w-[160px] outline-none border-none"
                                                                />
                                                            )}
                                                        </th>
                                                    );
                                                })}
                                            </tr>
                                        )}
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
                                          <React.Fragment key={row.id}>
                                              <tr
                                                  key={row.id}
                                                  className="hover:bg-gray transition"
                                                  onClick={row.getToggleExpandedHandler()}
                                              >
                                                  {canSelect && (
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
                                                  )}
                                                  {row.getVisibleCells().map((cell) => {
                                                      const value = cell.getValue();

                                                      let formattedValue: React.ReactNode;

                                                      if (
                                                          cell.column.id === "id" &&
                                                          typeof value === "string"
                                                      ) {
                                                          // Mostra apenas os primeiros 8 caracteres do GUID
                                                          formattedValue = value
                                                              .substring(0, 8)
                                                              .toUpperCase();
                                                      } else if (
                                                          value instanceof Date ||
                                                          (typeof value === "string" &&
                                                              !isNaN(Date.parse(value)))
                                                      ) {
                                                          const date = new Date(value as string);
                                                          formattedValue = date.toLocaleDateString(
                                                              "pt-BR",
                                                              {
                                                                  day: "2-digit",
                                                                  month: "2-digit",
                                                                  year: "numeric",
                                                              },
                                                          );
                                                      } else {
                                                          formattedValue = flexRender(
                                                              cell.column.columnDef.cell,
                                                              cell.getContext(),
                                                          );
                                                      }

                                                      return (
                                                          <td key={cell.id} className="px-4 py-2">
                                                              {formattedValue}
                                                          </td>
                                                      );
                                                  })}
                                              </tr>
                                              {canExpand &&
                                                  expandedComponent &&
                                                  row.getIsExpanded() && (
                                                      <tr>
                                                          <td colSpan={columns.length + 1}>
                                                              <Box>
                                                                  <div className="flex justify-between items-center mb-4 ">
                                                                      <h2 className="text-xl font-bold">
                                                                          {expandedTitle}
                                                                      </h2>
                                                                  </div>
                                                                  {expandedComponent(
                                                                      (
                                                                          row.original as {
                                                                              id: string;
                                                                          }
                                                                      ).id,
                                                                  )}
                                                              </Box>
                                                          </td>
                                                      </tr>
                                                  )}
                                          </React.Fragment>
                                      ))}
                            </tbody>
                        </table>
                    </SortableContext>
                </DndContext>
            </div>

            {canPaginate && (
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
            )}
        </div>
    );
}
