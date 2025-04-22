import { useEffect, useRef, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { CSSTransition } from "react-transition-group";
import Button from "../UI/Button";
import InputLabel from "../UI/InputLabel";
import SelectLabel from "../UI/SelectLabel";
import SearchableSelect from "../UI/SearchableSelect";

interface AddProductModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAddProduct?: (product: ProductFormValues) => void;
}

export interface ProductFormValues {
    price: number;
    type: string;
    brand: string;
    size: string;
    color: string;
    providerId: string;
    description: string;
    entryDate?: string;
}

interface Client {
    id: string;
    name: string;
}

export function AddProductModal({ isOpen, onClose, onAddProduct }: AddProductModalProps) {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<ProductFormValues>();

    const nodeRef = useRef(null);
    const [clients, setClients] = useState<Client[]>([]);

    const onCloseHandler = () => {
        reset();
        onClose();
    };

    useEffect(() => {
        const fetchClients = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/clients`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!response.ok) throw new Error("Erro ao buscar fornecedores.");

                const data = await response.json();
                setClients(data.items);
            } catch (error) {
                console.error("Erro ao carregar fornecedores:", error);
            }
        };

        if (isOpen) {
            fetchClients();
        }
    }, [isOpen]);

    const onSubmit: SubmitHandler<ProductFormValues> = async (data) => {
        try {
            const token = localStorage.getItem("token");

            const payload = {
                ...data,
                price: parseFloat(data.price as unknown as string),
                entryDate: data.entryDate ? new Date(data.entryDate).toISOString() : undefined,
            };

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) throw new Error("Falha ao criar produto.");

            if (onAddProduct) onAddProduct(payload);
            onCloseHandler();
        } catch (error) {
            console.error(error);
            alert("Erro ao adicionar produto. Verifique os dados e tente novamente.");
        }
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
                    <h2 className="text-xl font-semibold mb-4">Adicionar Produto</h2>

                    <div className="flex flex-col gap-3">
                        <InputLabel
                            text="Preço"
                            id="price"
                            type="number"
                            placeholder="Preço"
                            register={register}
                            rules={{ required: "Digite o preço" }}
                            errorMesage={errors.price?.message}
                        />
                        <InputLabel
                            text="Tipo"
                            id="type"
                            type="text"
                            placeholder="Tipo"
                            register={register}
                            rules={{ required: "Digite o tipo" }}
                            errorMesage={errors.type?.message}
                        />
                        <InputLabel
                            text="Marca"
                            id="brand"
                            type="text"
                            placeholder="Marca"
                            register={register}
                            rules={{ required: "Digite a marca" }}
                            errorMesage={errors.brand?.message}
                        />
                        <InputLabel
                            text="Tamanho"
                            id="size"
                            type="text"
                            placeholder="Tamanho"
                            register={register}
                            rules={{ required: "Digite o tamanho" }}
                            errorMesage={errors.size?.message}
                        />
                        <InputLabel
                            text="Cor"
                            id="color"
                            type="text"
                            placeholder="Cor"
                            register={register}
                            rules={{ required: "Digite a cor" }}
                            errorMesage={errors.color?.message}
                        />

                        <SearchableSelect<ProductFormValues>
                            id="providerId"
                            label="Fornecedor"
                            options={clients.map((c) => ({ label: c.name, value: c.id }))}
                            register={register}
                            rules={{ required: "Selecione um fornecedor" }}
                            errorMessage={errors.providerId?.message}
                        />

                        <InputLabel
                            text="Descrição"
                            id="description"
                            type="text"
                            placeholder="Descrição"
                            register={register}
                            rules={{ required: "Digite a descrição" }}
                            errorMesage={errors.description?.message}
                        />
                        <InputLabel
                            text="Data de Entrada"
                            id="entryDate"
                            type="date"
                            placeholder="Data de Entrada"
                            register={register}
                            rules={{}}
                            errorMesage={errors.entryDate?.message}
                        />
                    </div>

                    <div className="flex justify-end gap-2 mt-6">
                        <Button onClick={onCloseHandler}>Cancelar</Button>
                        <Button onClick={handleSubmit(onSubmit)}>Adicionar</Button>
                    </div>
                </div>
            </div>
        </CSSTransition>
    );
}
