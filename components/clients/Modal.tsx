import Button from "../UI/Button";
import InputLabel from "../UI/InputLabel";
import { SubmitHandler, useForm } from "react-hook-form";
import { CSSTransition } from "react-transition-group";
import { useRef } from "react";

interface AddClientModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAddClient: (client: { name: string; phone: string }) => void;
}

interface IFormValues {
    name: string;
    phone: string;
}

export function AddClientModal({ isOpen, onClose, onAddClient }: AddClientModalProps) {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<IFormValues>();

    const nodeRef = useRef(null);

    const onCloseHandler = () => {
        reset(); // Limpa os campos do formulário ao fechar o modal
        onClose();
    };

    const onSubmit: SubmitHandler<IFormValues> = async (data) => {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/clients`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error("Falha ao criar cliente.");
            }

            onAddClient(data); // opcional, dependendo se você quiser atualizar uma lista no pai
            onCloseHandler();
        } catch (error) {
            console.error(error);
            alert("Erro ao adicionar cliente. Verifique os dados e tente novamente.");
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
                    <h2 className="text-xl font-semibold mb-4">Adicionar Novo Cliente</h2>

                    <div className="flex flex-col gap-3">
                        <InputLabel
                            text="Nome"
                            id="name"
                            type="text"
                            placeholder="Nome"
                            register={register}
                            rules={{ required: "Digite o nome" }}
                            errorMesage={errors.name?.message}
                        />
                        <InputLabel
                            text="Telefone"
                            id="phone"
                            type="text"
                            placeholder="Telefone"
                            register={register}
                            rules={{ required: "Digite o telefone" }}
                            errorMesage={errors.phone?.message}
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
