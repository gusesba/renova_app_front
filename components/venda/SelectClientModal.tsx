import Button from "../UI/Button";
import InputLabel from "../UI/InputLabel";
import { SubmitHandler, useForm } from "react-hook-form";
import { CSSTransition } from "react-transition-group";
import { useEffect, useRef, useState } from "react";
import SearchableSelect from "../UI/SearchableSelect";
import { Client } from "@/app/main/clientes/page";

interface AddClientModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelectClient: (data: { client: { name: string; id: string }; type: string }) => void;
}

interface IFormValues {
    client: { name: string; id: string };
    type: string;
}

export function SelectClientModal({ isOpen, onClose, onSelectClient }: AddClientModalProps) {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<IFormValues>();

    const [clients, setClients] = useState<Client[]>([]);

    useEffect(() => {
        const fetchClients = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/clients`, {
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                if (!response.ok) throw new Error("Erro ao buscar fornecedores.");

                const data = await response.json();
                setClients(data.items);
            } catch (error) {
                console.error("Erro ao carregar fornecedores:", error);
            }
        };

        fetchClients();
    }, []);

    const nodeRef = useRef(null);

    const onCloseHandler = () => {
        reset();
        onClose();
    };

    const onSubmit: SubmitHandler<IFormValues> = async (data) => {
        onSelectClient(data); // opcional, dependendo se você quiser atualizar uma lista no pai
        onCloseHandler();
    };

    return (
        <CSSTransition in={isOpen} timeout={300} classNames="modal" unmountOnExit nodeRef={nodeRef}>
            <div
                className="fixed inset-0 flex items-center justify-center bg-[#00000080] z-50"
                onClick={onCloseHandler}
                ref={nodeRef}
            >
                <div
                    className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md"
                    onClick={(e) => e.stopPropagation()}
                >
                    <h2 className="text-xl font-semibold mb-4">Dados da Venda</h2>

                    <div className="flex flex-col gap-3">
                        <SearchableSelect<IFormValues>
                            id="client"
                            label="Cliente"
                            options={clients.map((c) => ({
                                label: c.name,
                                value: { name: c.name, id: c.id },
                            }))}
                            register={register}
                            rules={{ required: "Selecione um cliente" }}
                            errorMessage={errors.client?.message}
                        />
                        <SearchableSelect<IFormValues>
                            id="type"
                            label="Tipo"
                            options={[
                                { label: "Venda", value: "sell" },
                                { label: "Doação", value: "donation" },
                                { label: "Devolução", value: "return" },
                            ]}
                            defaultValue="sell"
                            register={register}
                            rules={{ required: "Selecione um Tipo" }}
                            errorMessage={errors.type?.message}
                        />
                    </div>

                    <div className="flex justify-end gap-2 mt-6">
                        <Button onClick={onCloseHandler}>Cancelar</Button>
                        <Button onClick={handleSubmit(onSubmit)}>Continuar</Button>
                    </div>
                </div>
            </div>
        </CSSTransition>
    );
}
