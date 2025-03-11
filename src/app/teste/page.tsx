'use client';
import {useScopedState} from "@/scopedstate";

export default function Teste() {
    const scopedState = useScopedState('userScope');
    const userInfo = scopedState.get<{ nome: string, sobrenome: string }>("user");
    const user = userInfo ?? undefined;


    return (
        <div className="p-2">
            <p>PAGINA 2</p>
            <p>Nome: {user?.nome}</p>
            <p>Sobrenome: {user?.sobrenome}</p>

        </div>
    );
}
