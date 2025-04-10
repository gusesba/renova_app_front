import React from "react";

export type LabelProps = React.LabelHTMLAttributes<HTMLLabelElement> & {
    text: string;
};

export default function Label({ htmlFor, text }: LabelProps) {
    return (
        <label htmlFor={htmlFor} className="block text-sm text-muted mb-1">
            {text}
        </label>
    );
}
