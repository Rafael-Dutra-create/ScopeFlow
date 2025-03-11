// ScopedStateContext.tsx
"use client";

import {ScopedState} from "@/scopedstate/ScopedState";
import {createContext, useCallback, useContext, useEffect, useMemo, useState} from "react";
import {ScopedStateContextType, ScopedStateProviderProps} from "@/scopedstate/types";
import {persistScopedStateClient} from "@/actions/actionClient";
import {persistScopedStateServer} from "@/actions/actionServer";
import {debounce} from "next/dist/server/utils";


const ScopedStateContext = createContext<ScopedStateContextType | null>(null);

export function ScopedStateProvider({ children }: ScopedStateProviderProps) {
    // Inicializa com objeto vazio (tanto server quanto client)
    const [scopes, setScopes] = useState<Record<string, ScopedState>>(() => {
        const initial: Record<string, ScopedState> = {};
        return initial; // Inicializa com um objeto vazio
    });

    useEffect(() => {

        const initial: Record<string, ScopedState> = {};

        // Carregar do localStorage
        Object.keys(localStorage).forEach((key) => {
            if (key.startsWith("scopedState_")) {
                const scopeKey = key.replace("scopedState_", "");
                const value = localStorage.getItem(key);
                if (value) {
                    initial[scopeKey] = new ScopedState(JSON.parse(value));
                }
            }
        });

        // Carregar dos cookies
        document.cookie.split("; ").forEach((cookie) => {
            if (cookie.startsWith("scopedState_")) {
                const [keyPart, value] = cookie.split("=");
                const scopeKey = keyPart.replace("scopedState_", "");
                const decoded = decodeURIComponent(value);
                initial[scopeKey] = new ScopedState(JSON.parse(decoded));
            }
        });

        setScopes(initial);

    }, []); // Executa apenas uma vez após o mount


    const getScope = useCallback((scopedKey: string) => {
        return scopes[scopedKey] || new ScopedState(undefined);
    }, [scopes]);

    useEffect(() => {
        Object.keys(scopes).forEach(scopedKey => {
            if (!scopes[scopedKey]) {
                const newScope = new ScopedState(undefined);
                setScopes(prev => ({ ...prev, [scopedKey]: newScope }));
            }
        });
    }, [scopes]);

    // Adicionar novo scope via effect se necessário
    const addScope = useCallback((scopedKey: string, newScope: ScopedState) => {
        setScopes((prev) => {
            if (prev[scopedKey]) return prev;
            return { ...prev, [scopedKey]: newScope };
        });
    }, []);

    // Persistência em Client e Server
    const persistScope = useMemo(
        () =>
            debounce((scopedKey: string, state: Record<string, any>) => {
                if(Object.keys(state).length > 0){
                    const stateJson = JSON.stringify(state);
                    persistScopedStateClient(scopedKey, stateJson);
                    persistScopedStateServer(scopedKey, stateJson).catch(console.error);
                }
            }, 300),
        []
    );

    const value = useMemo(() => ({ getScope, persistScope, addScope }), [getScope, persistScope, addScope]);

    return (
        <ScopedStateContext.Provider value={value}>
            {children}
        </ScopedStateContext.Provider>
    );
}

export function useScopedState(scopedKey: string) {
    const context = useContext(ScopedStateContext);
    if (!context) {
        throw new Error("useScopedState must be used within ScopedStateProvider");
    }

    const { getScope, persistScope, addScope } = context;
    const [scope, setScope] = useState<ScopedState>(() => getScope(scopedKey));
    const [, setVersion] = useState(0);

    // Adicionar novo scope via effect (evita setState durante render)
    useEffect(() => {
        const existingScope = getScope(scopedKey);
        if (!existingScope) {
            const newScope = new ScopedState(undefined);
            addScope(scopedKey, newScope);
            setScope(newScope);
        } else {
            setScope(existingScope);
        }
    }, [scopedKey, addScope, getScope]);

    //Controle de versão
    useEffect(() => {
        return scope.subscribe(() => {
            persistScope(scopedKey, scope.getAll());
            setVersion((v) => v + 1);
        });
    }, [scope, scopedKey, persistScope]);

    return scope;
}