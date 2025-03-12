import {describe, it, expect, beforeEach } from 'vitest';
import {renderHook, act} from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import {ScopedStateProvider, useScopedState} from "./../scopedstate/index";

describe('useScopedState Hook', () => {
    beforeEach(() => {
        localStorage.clear();
        localStorage.setItem(
            'scopedState_userScope',
            JSON.stringify({ user: { nome: 'Rafael', sobrenome: 'Dutra' } })
        );
    });

    it('deve carregar os dados do localStorage corretamente', () => {
        const { result } = renderHook(() => useScopedState('userScope'), {
            wrapper: ScopedStateProvider,
        });

        expect(result.current.get('user')).toEqual({ nome: 'Rafael', sobrenome: 'Dutra' });
    });

    it('deve atualizar o estado corretamente', () => {
        const { result, rerender } = renderHook(() => useScopedState('userScope'), {
            wrapper: ScopedStateProvider,
        });

        act(() => {
            result.current.update('user', { nome: 'Novo', sobrenome: 'Usuário' });
        });

        rerender(); // Força um re-render para garantir a atualização

        expect(result.current.get('user')).toEqual({ nome: 'Novo', sobrenome: 'Usuário' });
    });
});