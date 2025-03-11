import { describe, it, expect, beforeEach, vi } from 'vitest';
import {render, renderHook, screen} from '@testing-library/react';
import '@testing-library/jest-dom/vitest';

import {persistScopedStateClient} from "../actions/actions/actionClient";
import {useScopedState} from "./../scopedstate/index";

// Mock das funções de persistência
vi.mock("@/actions/actionClient", () => ({
    persistScopedStateClient: vi.fn(),
}));

vi.mock("@/actions/actionServer", () => ({
    persistScopedStateServer: vi.fn().mockResolvedValue(undefined),
}));

const TestComponent = ({ scopedKey }:any) => {
    const scopedState = useScopedState(scopedKey);
    return (
        <div>
            <p>Nome: {scopedState.get<{ nome: string}>('user')?.nome}</p>
        </div>
    );
};

describe('ScopedStateContext', () => {
    let initialState;

    beforeEach(() => {
        initialState = {
            user: { nome: 'Rafael', sobrenome: 'Dutra' },
        };
        localStorage.setItem('scopedState_userScope', JSON.stringify(initialState));
    });

    it('should initialize context and load state from localStorage', () => {
        render(
            <ScopedStateProvider>
                <TestComponent scopedKey="userScope" />
            </ScopedStateProvider>
        );

        expect(screen.getByText(/Nome: Rafael/i)).toBeInTheDocument();
    });

    it('should add a new scope if it does not exist', () => {
        const { result } = renderHook(() => useScopedState('newScope'), {
            wrapper: ScopedStateProvider,
        });

        expect(result.current.get('user')).toBeUndefined(); // Deve ser undefined inicialmente
    });

    it('should persist state changes', () => {
        const { result } = renderHook(() => useScopedState('userScope'), {
            wrapper: ScopedStateProvider,
        });

        result.current.set('user', { nome: 'Lucas', sobrenome: 'Silva' });

        expect(result.current.get('user')).toEqual({ nome: 'Lucas', sobrenome: 'Silva' });
        expect(persistScopedStateClient).toHaveBeenCalled();
    });

    it('should notify listeners on state change', () => {
        const listener = vi.fn();
        const { result } = renderHook(() => useScopedState('userScope'), {
            wrapper: ScopedStateProvider,
        });

        result.current.subscribe(listener);
        result.current.set('user', { nome: 'Lucas', sobrenome: 'Silva' });

        expect(listener).toHaveBeenCalled();
    });

    it('should throw an error if used outside of ScopedStateProvider', () => {
        const { result } = renderHook(() => useScopedState('userScope'));

        expect(result.error).toEqual(new Error("useScopedState must be used within ScopedStateProvider"));
    });
});