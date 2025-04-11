"use client";
import React from "react";
import InputLabel from "../UI/InputLabel";
import Button from "../UI/Button";
import Link from "next/link";
import { SubmitHandler, useForm } from "react-hook-form";

interface IFormValues {
    name: string;
    email: number;
    password: string;
}

export default function LoginFormCard() {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<IFormValues>();

    const onSubmit: SubmitHandler<IFormValues> = (data) => {
        //#TODO: Implementar a lógica de login
    };

    return (
        <div className="p-10 md:p-16">
            <h2 className="text-3xl font-bold text-primary mb-2">Bem vindo ao Renova!</h2>
            <p className="text-secondary mb-6">Digite seus dados para acessar</p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <InputLabel
                    text="Nome"
                    id="name"
                    type="text"
                    placeholder="Seu nome"
                    register={register}
                    rules={{ required: "Digite seu nome" }}
                    errorMesage={errors.name?.message}
                />

                <InputLabel
                    text="Email"
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    register={register}
                    rules={{ required: "Digite seu email" }}
                    errorMesage={errors.email?.message}
                />

                <InputLabel
                    text="Senha"
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    register={register}
                    rules={{
                        required: "Digite sua senha",
                        minLength: { value: 8, message: "A senha deve ter no mínimo 8 caracteres" },
                    }}
                    errorMesage={errors.password?.message}
                />

                <Button>Login</Button>
            </form>

            <div className="mt-6 flex items-center justify-center gap-4 text-muted text-sm">
                <Link href="#" className="hover:text-primary">
                    Esqueceu a senha?
                </Link>
                <span>•</span>
                <Link href="#" className="hover:text-primary">
                    Criar conta
                </Link>
            </div>
        </div>
    );
}
