import React from "react";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {};

export default function Input({ placeholder = "", type = "", id }: InputProps) {
    return (
        <input
            id={id}
            type={type || "text"}
            placeholder={placeholder || ""}
            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
        />
    );
}
