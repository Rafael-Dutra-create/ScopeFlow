import {afterEach, beforeEach, describe, expect, it, vi} from "vitest";
import {cleanup, fireEvent, render, screen, waitFor} from "@testing-library/react";
import {ScopedStateProvider} from "./../scopedstate/index";
import TestComponent from "./../tests/testComponent";
import React from "react";
import '@testing-library/jest-dom/vitest';

vi.mock('next/headers', () => ({
    cookies: () => ({
        get: vi.fn((name) => {
            // Retorne o valor do cookie que você deseja simular
            if (name === 'someCookie') {
                return 'someValue';
            }
            return null;
        }),
        set: vi.fn(),
        delete: vi.fn(),
        clear: vi.fn(),
    }),
}));

describe('TestComponent', () => {
    beforeEach(() => {
        localStorage.clear();
        localStorage.setItem(
            'scopedState_userScope',
            JSON.stringify({ user: { name: 'Rafael', lastName: 'Dutra' } })
        );
    });
    afterEach(() => {
        cleanup();
    });
    it('deve exibir os valores iniciais e atualizar o nome ao clicar no botão', async () => {
        render(
            <ScopedStateProvider>
                <TestComponent />
            </ScopedStateProvider>
        );

        // Verifica se os valores iniciais aparecem na tela
        expect(await screen.findByText(/Name: Rafael/i)).toBeInTheDocument();
        expect(await screen.findByText(/NameLast: Dutra/i)).toBeInTheDocument();

        // Clica no botão de atualização
        fireEvent.click(screen.getByText(/Update Name/i));

        // Aguarda a atualização do estado e do localStorage
        await waitFor(() => {
            expect(localStorage.getItem('scopedState_userScope')).toEqual(JSON.stringify({user:{ name: 'Update Name', lastName: 'Dutra' }}));
            expect(screen.getByText(/Name: Update Name/i)).toBeInTheDocument();
        });

        // Verifica se o localStorage foi atualizado corretamente
        const storedState = JSON.parse(localStorage.getItem('scopedState_userScope') || '{}');
        expect(storedState.user.name).toBe('Update Name');
    });

    afterEach(() => {
        cleanup();
    });
    it('deve limpar apenas o nome ao clicar no botão Clear Name', async () => {
        render(
            <ScopedStateProvider>
                <TestComponent />
            </ScopedStateProvider>
        );

        // Verifica se os valores iniciais aparecem na tela
        expect(await screen.findByText(/Name: Rafael/i)).toBeInTheDocument();
        expect(await screen.findByText(/NameLast: Dutra/i)).toBeInTheDocument();

        fireEvent.click(screen.getByText(/Clear Name/i));

        await waitFor(() => {
            expect(localStorage.getItem('scopedState_userScope')).toEqual(JSON.stringify({user:{ lastName: 'Dutra' }}));
        });

        // Verifica se o nome foi removido da tela
        expect(screen.queryByText(/Name: Rafael/i)).not.toBeInTheDocument();
        expect(screen.getByText(/Name:/i)).toBeInTheDocument(); // Verifica se o campo Nome está presente, mas vazio

        const storedState = JSON.parse(localStorage.getItem('scopedState_userScope') || '{}');
        expect(storedState.user.name).toBeUndefined();
        expect(storedState.user.lastName).toBe('Dutra');
    });

    afterEach(() => {
        cleanup();
    });
    it('deve limpar apenas o sobrenome ao clicar no botão Clear Last Name', async () => {
        render(
            <ScopedStateProvider>
                <TestComponent />
            </ScopedStateProvider>
        );

        // Verifica se os valores iniciais aparecem na tela
        expect(await screen.findByText(/Name: Rafael/i)).toBeInTheDocument();
        expect(screen.getByText(/NameLast: Dutra/i)).toBeInTheDocument();

        fireEvent.click(screen.getByText(/Clear Last Name/i));

        await waitFor(() => {
            expect(localStorage.getItem('scopedState_userScope')).toEqual(JSON.stringify({user:{ name: 'Rafael' }}));
        });

        expect(screen.getByText(/NameLast:/i)).toBeInTheDocument();
        expect(screen.queryByText(/NameLast: Dutra/i)).not.toBeInTheDocument();

        const storedState = JSON.parse(localStorage.getItem('scopedState_userScope') || '{}');
        expect(storedState.user.lastName).toBeUndefined();
        expect(storedState.user.name).toBe('Rafael');
    });

});