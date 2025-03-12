import { describe, it, expect, beforeEach, vi } from 'vitest';
import { clearScopedState } from "./../actions/actionClient";
import { clearScopedStateServer } from "./../actions/actionServer";
import {ScopedState} from './../scopedstate/index';


// Mock das funções de limpeza
vi.mock("./../actions/actionClient", () => ({
    clearScopedState: vi.fn(),
}));

vi.mock("./../actions/actionServer", () => ({
    clearScopedStateServer: vi.fn().mockResolvedValue(undefined),
}));

describe('ScopedState', () => {
    let scopedState: ScopedState;

    beforeEach(() => {
        scopedState = new ScopedState({ user: { nome: 'Rafael', sobrenome: 'Dutra' } });
    });

    it('should get a value by key', () => {
        const user = scopedState.get('user');
        expect(user).toEqual({ nome: 'Rafael', sobrenome: 'Dutra' });
    });

    it('should return undefined for a non-existing key', () => {
        const nonExisting = scopedState.get('nonExistingKey');
        expect(nonExisting).toBeUndefined();
    });

    it('should set a value and notify listeners', () => {
        const listener = vi.fn();
        scopedState.subscribe(listener);

        scopedState.set('user', { nome: 'Daniele', sobrenome: 'Cota' });

        expect(scopedState.get('user')).toEqual({ nome: 'Daniele', sobrenome: 'Cota' });
        expect(listener).toHaveBeenCalled();
    });

    it('should update a value and notify listeners', () => {
        const listener = vi.fn();
        scopedState.subscribe(listener);

        scopedState.update('user', { sobrenome: 'Cota' });

        expect(scopedState.get('user')).toEqual({ nome: 'Rafael', sobrenome: 'Cota' });
        expect(listener).toHaveBeenCalled();
    });

    it('should clear all keys and notify listeners', async () => {
        const listener = vi.fn();
        scopedState.subscribe(listener);

        await scopedState.clearAll('userScope');

        expect(scopedState.getAll()).toEqual({});
        expect(clearScopedState).toHaveBeenCalledWith('userScope');
        expect(clearScopedStateServer).toHaveBeenCalledWith('userScope');
        expect(listener).toHaveBeenCalled();
    });

    it('should clear a specific key and notify listeners', async () => {
        const listener = vi.fn();
        scopedState.subscribe(listener);

        await scopedState.clearKey('userScope', 'user');

        expect(scopedState.get('user')).toBeUndefined();
        expect(clearScopedState).toHaveBeenCalledWith('userScope');
        expect(clearScopedStateServer).toHaveBeenCalledWith('userScope');
        expect(listener).toHaveBeenCalled();
    });

    it('should clear an index from an array and notify listeners', async () => {
        scopedState.set('items', ['item1', 'item2', 'item3']);
        const listener = vi.fn();
        scopedState.subscribe(listener);

        await scopedState.clearIndex('userScope', 'items', 1);

        expect(scopedState.get('items')).toEqual(['item1', 'item3']);
        expect(listener).toHaveBeenCalled();
    });

    it('should increment version on notifyListeners', () => {
        expect(scopedState.getVersion()).toBe(0);
        scopedState.set('user', { nome: 'Daniele', sobrenome: 'Cota' });
        expect(scopedState.getVersion()).toBe(1);
    });
});