import React, { useEffect, useRef, useState } from "react";
import { RegisterOptions, UseFormRegister, Path } from "react-hook-form";

interface Option {
    label: string;
    value: string;
}

interface SearchableSelectProps<T extends Record<string, any>> {
    id: Path<T>;
    label: string;
    options: Option[];
    register: UseFormRegister<T>;
    rules?: RegisterOptions<T>;
    errorMessage?: string;
}

export default function SearchableSelect<T extends Record<string, any>>({
    id,
    label,
    options,
    register,
    rules,
    errorMessage,
}: SearchableSelectProps<T>) {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState("");
    const [selected, setSelected] = useState<Option | null>(null);
    const [filtered, setFiltered] = useState<Option[]>(options);

    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setFiltered(
            options.filter((opt) => opt.label.toLowerCase().includes(search.toLowerCase())),
        );
    }, [search, options]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="flex flex-col gap-1" ref={ref}>
            <label htmlFor={id} className="font-medium">
                {label}
            </label>

            <div className="relative">
                <input
                    type="text"
                    readOnly
                    value={selected?.label || ""}
                    onClick={() => setIsOpen(!isOpen)}
                    placeholder="Selecione..."
                    className={
                        errorMessage
                            ? "w-full px-4 py-2 border border-gray-300 rounded-xl outline-none ring-1 focus:ring-2 ring-error"
                            : "w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                    }
                />
                {isOpen && (
                    <div className="absolute z-10 w-full bg-white border rounded-xl mt-1 shadow-lg max-h-60 overflow-y-auto">
                        <input
                            type="text"
                            autoFocus
                            placeholder="Pesquisar..."
                            className="w-full px-4 py-2 border-b outline-none"
                            onChange={(e) => setSearch(e.target.value)}
                            value={search}
                        />
                        {filtered.length === 0 && (
                            <div className="px-4 py-2 text-sm text-gray-500">Nenhum resultado</div>
                        )}
                        {filtered.map((opt) => (
                            <div
                                key={opt.value}
                                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                onClick={() => {
                                    setSelected(opt);
                                    setSearch("");
                                    setIsOpen(false);
                                    const fakeEvent = {
                                        target: {
                                            name: id,
                                            value: opt.value,
                                        },
                                    };
                                    register(id, rules).onChange(fakeEvent as any);
                                }}
                            >
                                {opt.label}
                            </div>
                        ))}
                    </div>
                )}
                {/* Campo oculto para integrar com react-hook-form */}
                <input type="hidden" {...register(id, rules)} value={selected?.value || ""} />
            </div>

            {errorMessage && <span className="text-sm text-red-500 mt-1">{errorMessage}</span>}
        </div>
    );
}
