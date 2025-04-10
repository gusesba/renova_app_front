import React from "react";
import Input from "../UI/Input";
import Label from "../UI/Label";
import InputLabel from "../UI/InputLabel";

export default function LoginFormCard() {
    return (
        <div className="p-10 md:p-16">
            <h2 className="text-3xl font-bold text-primary mb-2">Bem vindo ao Renova!</h2>
            <p className="text-secondary mb-6">Digite seus dados para acessar</p>

            <form className="space-y-5">
                <InputLabel text="Nome" id="name" type="text" placeholder="Seu nome" />

                <InputLabel text="Email" id="email" type="email" placeholder="seu@email.com" />

                <InputLabel text="Senha" id="password" type="password" placeholder="••••••••" />

                <button
                    type="submit"
                    className="w-full bg-primary text-white py-2 rounded-xl hover:bg-secondary transition duration-300 cursor-pointer"
                >
                    Login
                </button>
            </form>

            <div className="mt-6 flex items-center justify-center gap-4 text-muted text-sm">
                <a href="#" className="hover:text-primary">
                    Esqueceu a senha?
                </a>
                <span>•</span>
                <a href="#" className="hover:text-primary">
                    Criar conta
                </a>
            </div>
        </div>
    );
}
