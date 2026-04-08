import { env } from "#/shared/config/env";

const prefix = env.VITE_TESTNET ? "testnet" : "livenet";

export const storageKey = (key: string): string => `${prefix}:${key}`;
