export function persistScopedStateClient(scopedKey: string, stateJson: string) {
    if (typeof window !== "undefined") {
        localStorage.setItem(`scopedState_${scopedKey}`, stateJson);
    }
}

export function clearScopedState(scopedKey: string) {
    if (typeof window !== "undefined") {
        localStorage.removeItem(`scopedState_${scopedKey}`);
    }
}
