'use client';
import { useScopedState } from "@/scopedstate";
import { useRef } from "react";

export default function Home() {
    const userScope = useScopedState('userScope');
    const verificarScope = useScopedState('verificarScope');

    // Recupera os valores salvos (se existirem)
    const storedUser = userScope.get<{ nome: string; sobrenome: string }>("user");
    const storedToken = verificarScope.get<{ token: string }>("verificar");

    // Cria referências para os inputs
    const nameInputRef = useRef<HTMLInputElement>(null);
    const surnameInputRef = useRef<HTMLInputElement>(null);
    const tokenInputRef = useRef<HTMLInputElement>(null);

    // Atualiza ou cria o objeto "user" com o nome informado,
    // preservando o sobrenome já existente (caso exista)
    const handleConfirmName = () => {
        const nome = nameInputRef.current?.value || "";
        userScope.update("user", { nome });
    };

    // Atualiza ou cria o objeto "user" com o sobrenome informado,
    // preservando o nome já existente (caso exista)
    const handleConfirmSurname = () => {
        const sobrenome = surnameInputRef.current?.value || "";
        userScope.update("user", { sobrenome });
    };

    // Confirma o token na key "verificar"
    const handleConfirmToken = () => {
        const token = tokenInputRef.current?.value || "";
        verificarScope.set("verificar", { token });
    };

    // Utiliza clearIndex para remover somente o campo "nome" do objeto "user"
    const handleClearName = async () => {
        await userScope.clearIndex("userScope", "user", 'nome');
        if (nameInputRef.current) {
            nameInputRef.current.value = "";
        }
    };

    // Utiliza clearIndex para remover somente o campo "sobrenome" do objeto "user"
    const handleClearSurname = async () => {
        await userScope.clearIndex('userScope', "user", "sobrenome");
        if (surnameInputRef.current) {
            surnameInputRef.current.value = "";
        }
    };

    // Limpa o token (key "verificar")
    const handleClearToken = async () => {
        await verificarScope.clearKey('userScope', "verificar");
        if (tokenInputRef.current) {
            tokenInputRef.current.value = "";
        }
    };

    // Limpa todas as keys do scopedState
    const handleClearAll = async () => {
        await userScope.clearAll('userScope');
        await verificarScope.clearAll('userScope');
        if (nameInputRef.current) {
            nameInputRef.current.value = "";
        }
        if (surnameInputRef.current) {
            surnameInputRef.current.value = "";
        }
        if (tokenInputRef.current) {
            tokenInputRef.current.value = "";
        }
    };

    return (
        <div className="p-2">
            {/* Seção de Nome */}
            <div className="mb-4">
                <h2>Nome</h2>
                <input
                    type="text"
                    className="text-black"
                    defaultValue={storedUser?.nome}
                    ref={nameInputRef}
                />
                <button
                    onClick={handleConfirmName}
                    className="bg-gray-500 p-1 rounded-md ml-2"
                >
                    Confirmar Nome
                </button>
                <button
                    onClick={handleClearName}
                    className="bg-red-500 p-1 rounded-md ml-2"
                >
                    Limpar Nome
                </button>
            </div>

            {/* Seção de Sobrenome */}
            <div className="mb-4">
                <h2>Sobrenome</h2>
                <input
                    type="text"
                    className="text-black"
                    defaultValue={storedUser?.sobrenome}
                    ref={surnameInputRef}
                />
                <button
                    onClick={handleConfirmSurname}
                    className="bg-gray-500 p-1 rounded-md ml-2"
                >
                    Confirmar Sobrenome
                </button>
                <button
                    onClick={handleClearSurname}
                    className="bg-red-500 p-1 rounded-md ml-2"
                >
                    Limpar Sobrenome
                </button>
            </div>

            {/* Seção de Token */}
            <div className="mb-4">
                <h2>Token</h2>
                <input
                    type="text"
                    className="text-black"
                    defaultValue={storedToken?.token}
                    ref={tokenInputRef}
                />
                <button
                    onClick={handleConfirmToken}
                    className="bg-gray-500 p-1 rounded-md ml-2"
                >
                    Confirmar Token
                </button>
                <button
                    onClick={handleClearToken}
                    className="bg-red-500 p-1 rounded-md ml-2"
                >
                    Limpar Token
                </button>
            </div>

            {/* Botão para limpar tudo */}
            <div>
                <button
                    onClick={handleClearAll}
                    className="bg-blue-500 p-2 rounded-md"
                >
                    Limpar Tudo
                </button>
            </div>
        </div>
    );
}
