import React from "react";
import Label, { LabelProps } from "./Label";
import Input, { InputProps } from "./Input";

type InputLabelProps = InputProps & LabelProps & {};

export default function InputLabel({ id, type, placeholder, text }: InputLabelProps) {
    return (
        <div>
            <Label htmlFor={id} text={text} />
            <Input id={id} type={type} placeholder={placeholder} />
        </div>
    );
}
