import React from "react";

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {};

export default function Button({ children, type }: ButtonProps) {
    return (
        <button
            type={type}
            className="w-full text-sm bg-primary text-white px-4 py-2 rounded hover:bg-secondary transition duration-300 cursor-pointer"
        >
            {children}
        </button>
    );
}
