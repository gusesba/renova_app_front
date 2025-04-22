import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";

export default function Header({
    onToggleSidebar,
    sidebarOpen,
}: {
    onToggleSidebar: () => void;
    sidebarOpen: boolean;
}) {
    return (
        <header className="fixed top-0 left-0 w-full h-14 bg-white z-11 flex pl-5 items-center border-b-2 border-gray-200 shadow-md">
            <div className="flex gap-4 items-center w-52">
                <button
                    onClick={onToggleSidebar}
                    className="p-2 rounded transition transform duration-300 hover:scale-140"
                    aria-label="Alternar sidebar"
                >
                    <FontAwesomeIcon
                        icon={faBars}
                        className={`h-5 text-primary transition-transform duration-1000 ${sidebarOpen ? "rotate-180" : ""}`}
                    />
                </button>
                <h1 className="text-primary font-black text-2xl">Renova</h1>
            </div>
        </header>
    );
}
