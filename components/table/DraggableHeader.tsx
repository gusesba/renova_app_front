import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useState } from "react";

export default function DraggableHeader({
    header,
    children,
    isFirst,
    setColumnOrder,
    allColumns,
    columnOrder,
    headersMap,
    canAddColumns = true,
}: {
    header: any;
    children: React.ReactNode;
    isFirst?: boolean;
    setColumnOrder: React.Dispatch<React.SetStateAction<string[]>>;
    allColumns: string[];
    columnOrder: string[];
    headersMap: Record<string, string>;
    canAddColumns?: boolean;
}) {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
        id: header,
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        cursor: "move",
    };

    const [showAddMenu, setShowAddMenu] = useState(false);

    const missingColumns = allColumns.filter((col) => !columnOrder.includes(col));

    return (
        <th
            ref={setNodeRef}
            {...(canAddColumns ? attributes : {})}
            {...(canAddColumns ? listeners : {})}
            style={canAddColumns ? style : {}}
            className="px-4 py-2 bg-gray-50 cursor-pointer select-none relative"
        >
            <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                    {isFirst && canAddColumns && (
                        <div className="relative">
                            <button
                                onClick={() => setShowAddMenu((prev) => !prev)}
                                className="ml-[-10px] text-xl font-bold text-primary hover:secondary cursor-pointer transition transform hover:scale-140"
                            >
                                +
                            </button>
                            {showAddMenu && (
                                <div className="absolute left-0 mt-2 w-40 bg-white border rounded shadow z-10">
                                    {missingColumns.length > 0 ? (
                                        missingColumns.map((col) => (
                                            <button
                                                key={col}
                                                onClick={() => {
                                                    setColumnOrder((prev) => [col, ...prev]);
                                                    setShowAddMenu(false);
                                                }}
                                                className="w-full text-left px-4 py-2 hover:bg-gray-100"
                                            >
                                                {headersMap[col]}
                                            </button>
                                        ))
                                    ) : (
                                        <div className="px-4 py-2 text-sm text-gray-500">
                                            Nenhuma coluna
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                    {children}
                </div>
                {canAddColumns && (
                    <button
                        onClick={() => setColumnOrder((prev) => prev.filter((id) => id !== header))}
                        className="text-error hover:text-error-light cursor-pointer font-bold px-2 transition transform hover:scale-140"
                    >
                        X
                    </button>
                )}
            </div>
        </th>
    );
}
