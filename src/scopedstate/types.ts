import {ReactNode} from "react";
import {ScopedState} from "@/scopedstate/ScopedState";

export interface ScopedStateProviderProps {
    children?: ReactNode;
    initialState?: Record<string, any>;
}

export type ScopedStateContextType = {
    getScope: (scopedKey: string) => ScopedState;
    persistScope: (scopedKey: string, state: Record<string, any>) => void;
    addScope: (scopedKey: string, newScope: ScopedState) => void
};