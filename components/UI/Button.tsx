import React from "react";

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {};

export default function Button({ children, type }: ButtonProps) {
    return (
        <button
            type={type}
            className="w-full bg-primary text-white py-2 rounded-xl hover:bg-secondary transition duration-300 cursor-pointer"
        >
            {children}
        </button>
    );
}
