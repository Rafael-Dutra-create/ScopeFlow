// ScopedStateContext.tsx
"use client";

import { ScopedState } from "@/scopedstate/ScopedState";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import {ScopedStateContextType, ScopedStateProviderProps} from "@/scopedstate/types";
import { persistScopedStateClient } from "@/actions/actionClient";
import { persistScopedStateServer } from "@/actions/actionServer";
import {debounce} from "next/dist/server/utils";



const ScopedStateContext = createContext<ScopedStateContextType | null>(null);

export function ScopedStateProvider({ children }: ScopedStateProviderProps) {
    const [scopes, setScopes] = useState<Record<string, ScopedState>>(() => {
        const initial: Record<string, ScopedState> = {};

        if (typeof window === "undefined") return initial;

        // Carregar do localStorage
        Object.keys(localStorage).forEach(key => {
            if (key.startsWith("scopedState_")) {
                const scopeKey = key.replace("scopedState_", "");
                const value = localStorage.getItem(key);
                if (value) {
                    initial[scopeKey] = new ScopedState(JSON.parse(value));
                }
            }
        });

        // Carregar dos cookies
        document.cookie.split("; ").forEach(cookie => {
            if (cookie.startsWith("scopedState_")) {
                const [keyPart, value] = cookie.split("=");
                const scopeKey = keyPart.replace("scopedState_", "");
                const decoded = decodeURIComponent(value);
                initial[scopeKey] = new ScopedState(JSON.parse(decoded));
            }
        });

        return initial;
    });

    const getScope = useCallback((scopedKey: string) => {
        if (!scopes[scopedKey] && typeof window === "undefined") {
            const newScope = new ScopedState(undefined);
            setScopes(prev => ({ ...prev, [scopedKey]: newScope }));
        }
        return scopes[scopedKey] || new ScopedState(undefined);
    }, [scopes]);

    const persistScope = useCallback(debounce((scopedKey: string, state: Record<string, any>) => {
        const stateJson = JSON.stringify(state);

        // Persistir no client
        persistScopedStateClient(scopedKey, stateJson)

        // Persistir no server
        persistScopedStateServer(scopedKey, stateJson).catch(console.error);
    }, 300), []);

    const value = useMemo(() => ({
        getScope,
        persistScope
    }), [getScope, persistScope]);

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

    const { getScope, persistScope } = context;
    const [scope] = useState(() => getScope(scopedKey));
    const [, setVersion] = useState(0);

    useEffect(() => {
        const unsubscribe = scope.subscribe(() => {
            persistScope(scopedKey, scope.getAll());
            setVersion(v => v + 1); // Forçar atualização
        });
        return unsubscribe;
    }, [scope, scopedKey, persistScope]);

    return scope;
}