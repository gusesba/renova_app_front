import { useEffect, useRef, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { CSSTransition } from "react-transition-group";
import Button from "../UI/Button";
import InputLabel from "../UI/InputLabel";
import SearchableSelect from "../UI/SearchableSelect";
import { useProductConfig } from "./useProductConfig";

interface AddProductModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAddProduct?: (product: ProductFormValues) => void;
}

export interface ProductFormValues {
    price: number;
    typeId: string;
    brandId: string;
    sizeId: string;
    colorId: string;
    providerId: string;
    description: string;
    entryDate?: string;
}

export function AddProductModal({ isOpen, onClose, onAddProduct }: AddProductModalProps) {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<ProductFormValues>();

    const nodeRef = useRef(null);

    const onCloseHandler = () => {
        reset();
        onClose();
    };

    const { clients, brands, types, sizes, colors } = useProductConfig();

    const onSubmit: SubmitHandler<ProductFormValues> = async (data) => {
        try {
            const payload = {
                ...data,
                price: parseFloat(data.price as unknown as string),
                entryDate: data.entryDate ? new Date(data.entryDate).toISOString() : undefined,
            };

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
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
                    className="bg-white p-6 rounded-xl shadow-lg w-full max-w-xl"
                    onClick={(e) => e.stopPropagation()}
                >
                    <h2 className="text-xl font-semibold mb-4">Adicionar Produto</h2>

                    <div className="grid grid-cols-2 gap-4">
                        <SearchableSelect<ProductFormValues>
                            id="providerId"
                            label="Fornecedor"
                            options={clients.map((c) => ({ label: c.name, value: c.id }))}
                            register={register}
                            rules={{ required: "Selecione um fornecedor" }}
                            errorMessage={errors.providerId?.message}
                        />

                        <div>
                            <SearchableSelect<ProductFormValues>
                                id="colorId"
                                label="Cor"
                                options={colors.map((c) => ({ label: c.value, value: c.id }))}
                                register={register}
                                rules={{ required: "Selecione uma cor" }}
                                errorMessage={errors.colorId?.message}
                            />
                        </div>
                        <div>
                            <SearchableSelect<ProductFormValues>
                                id="brandId"
                                label="Marca"
                                options={brands.map((b) => ({ label: b.value, value: b.id }))}
                                register={register}
                                rules={{ required: "Selecione uma marca" }}
                                errorMessage={errors.brandId?.message}
                            />
                        </div>
                        <div>
                            <SearchableSelect<ProductFormValues>
                                id="typeId"
                                label="Tipo"
                                options={types.map((t) => ({ label: t.value, value: t.id }))}
                                register={register}
                                rules={{ required: "Selecione um tipo" }}
                                errorMessage={errors.typeId?.message}
                            />
                        </div>
                        <div>
                            <SearchableSelect<ProductFormValues>
                                id="sizeId"
                                label="Tamanho"
                                options={sizes.map((s) => ({ label: s.value, value: s.id }))}
                                register={register}
                                rules={{ required: "Selecione um tamanho" }}
                                errorMessage={errors.sizeId?.message}
                            />
                        </div>

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
