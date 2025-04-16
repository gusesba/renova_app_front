import React from "react";

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
    size?: "full" | "md";
};

export default function Button({ size = "full", className = "", children, ...props }: ButtonProps) {
    const sizeStyle = size === "full" ? "w-full" : "";

    className = !props.disabled
        ? `${sizeStyle} text-sm bg-primary text-white px-4 py-2 rounded hover:bg-secondary transition duration-300 cursor-pointer ${className}`
        : `${sizeStyle} text-sm bg-terciary text-white px-4 py-2 rounded cursor-not-allowed ${className}`;

    return (
        <button className={className} {...props}>
            {children}
        </button>
    );
}
