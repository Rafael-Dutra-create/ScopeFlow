import {clearScopedState} from "@/actions/actionClient";
import {clearScopedStateServer} from "@/actions/actionServer";


export class ScopedState {
    private readonly state: Record<string, any>;
    private readonly listeners: Set<() => void>;

    constructor(initialState: Record<string, any> | undefined) {
        this.state = { ...initialState };
        this.listeners = new Set();
    }

    get<T>(key: string): T | undefined {
        if (!(key in this.state)) {
            return undefined;
        }
        return this.state[key] as T;
    }

    set<T>(key: string, value: T): void {
        if (this.state[key] !== value) {
            this.state[key] = value;
            this.notifyListeners();
        }
    }

    update<T extends object>(key: string, partialValue: Partial<T>): void {
        const current = this.state[key];
        // Se current não for um objeto válido, usamos um objeto vazio como base.
        const base = (typeof current === 'object' && current !== null) ? current : {};
        this.state[key] = { ...base, ...partialValue };
        this.notifyListeners();
    }

    getAll(): Record<string, any> {
        return { ...this.state };
    }

    subscribe( listener: () => void ): () => void {
        this.listeners.add(listener);
        return () => this.listeners.delete(listener);
    }

    async clearAll(scopedKey:string): Promise<void> {
        Object.keys(this.state).forEach(key => {
            delete this.state[key];
        });
        clearScopedState(scopedKey)
        await clearScopedStateServer(scopedKey)
        this.notifyListeners();
    }

    async clearKey(scopedKey:string, key: string): Promise<void> {
        if (key in this.state) {
            delete this.state[key];
            clearScopedState(scopedKey)
            await clearScopedStateServer(scopedKey)
            this.notifyListeners();
        }
    }

    async clearIndex(scopedKey:string, key: string, index: string | number): Promise<void> {
        const value = this.state[key];

        if (Array.isArray(value)) {
            // Se for um array, remove o índice especificado
            this.state[key] = value.filter((_, i) => i !== index);
        } else if (typeof value === 'object' && value !== null) {
            // Se for um objeto, remove a chave especificada
            delete value[index];
        } else {
            throw new Error(`Cannot clear index from non-object, non-array key '${key}'`);
        }
        clearScopedState(scopedKey)
        await clearScopedStateServer(scopedKey)
        this.notifyListeners();
    }

    private version = 0;

    getVersion() {
        return this.version;
    }

    private notifyListeners() {
        this.version++;
        this.listeners.forEach(listener => listener());
    }

}