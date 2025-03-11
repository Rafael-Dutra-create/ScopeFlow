"use server";
import { cookies } from "next/headers";

export async function persistScopedStateServer(scopedKey: string, stateJson: string) {
    const cookieStore = await cookies();
    cookieStore.set(`scopedState-${scopedKey}`, stateJson);
}

export async function clearScopedStateServer(scopedKey: string) {
    const cookieStore = await cookies();
    cookieStore.delete(`scopedState-${scopedKey}`);
}
