import Link from "next/link";

export default function Sidebar({ isOpen }: { isOpen: boolean }) {
    const menuTabelas = [
        { name: "Clientes", path: "/main/clientes" },
        { name: "Estoque", path: "/main/produtos" },
        { name: "Vendas", path: "/vendas" },
        { name: "Produtos Vendidos", path: "/produtos-vendidos" },
        { name: "Doações", path: "/doacoes" },
        { name: "Devoluções", path: "/devolucoes" },
    ];

    return (
        <aside
            className={`p-2 fixed top-14 left-0 h-[calc(100vh-3.5rem)] bg-[var(--color-background)] border-r-2 border-[var(--color-gray)] z-10 shadow-[0_4px_12px_rgba(0,0,0,0.2)] text-[var(--color-foreground)] font-sans transition-all duration-300 ${
                isOpen ? "w-52" : "w-14"
            }`}
        >
            <nav className="p-2">
                <div
                    className={`text-xs font-semibold uppercase tracking-widest text-[var(--color-secondary)] mb-2 ${isOpen ? "block" : "hidden"}`}
                >
                    Tabelas
                </div>
                <ul className="space-y-1">
                    {menuTabelas.map((item, index) => (
                        <li key={index}>
                            <Link
                                href={item.path}
                                className={`block px-3 py-2 rounded-md text-sm hover:bg-[var(--color-gray)] hover:text-[var(--color-primary)] transition-colors ${
                                    isOpen ? "text-left" : "text-center text-xs"
                                }`}
                            >
                                {isOpen ? item.name : item.name[0]}
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>
        </aside>
    );
}
