"use server";
import { cookies } from "next/headers";

export async function persistScopedStateServer(scopedKey: string, stateJson: string) {
    const cookieStore = await cookies();
    cookieStore.set(`scopedState_${scopedKey}`, stateJson);
}

export async function clearScopedStateServer(scopedKey: string) {
    const cookieStore = await cookies();
    cookieStore.delete(`scopedState_${scopedKey}`);
}
