import { queryOptions, useQuery } from "@tanstack/react-query";
import { z } from "zod";

import client from "#/shared/api/obyte";
import { storageKey } from "#/shared/lib/storageKey";

import {
  emptyAttestations,
  parseAttestations,
  parseRawAttestations,
} from "../lib/parseAttestations";
import { parsedAttestationsSchema } from "./schemas";
import type { ParsedAttestations } from "./schemas";

const cacheEntrySchema = z.object({
  data: parsedAttestationsSchema,
  ts: z.number(),
});

const CACHE_TTL = 60 * 60 * 1000; // 1 hour

function getCacheKey(address: string): string {
  return storageKey("attestations_v2_" + address);
}

function readCache(address: string): ParsedAttestations | null {
  try {
    const raw = localStorage.getItem(getCacheKey(address));
    if (!raw) return null;
    const parsed = cacheEntrySchema.safeParse(JSON.parse(raw));
    if (!parsed.success) return null;
    if (Date.now() - parsed.data.ts > CACHE_TTL) return null;
    return parsed.data.data;
  } catch {
    return null;
  }
}

function writeCache(address: string, data: ParsedAttestations): void {
  try {
    localStorage.setItem(
      getCacheKey(address),
      JSON.stringify({ data, ts: Date.now() }),
    );
  } catch {}
}

export function attestationsQueryOptions(address: string | undefined) {
  return queryOptions({
    queryKey: ["attestations", address] as const,
    queryFn: async (): Promise<ParsedAttestations> => {
      if (!address) return emptyAttestations();
      const cached = readCache(address);
      if (cached) return cached;

      const raw = await client.api
        .getAttestations({ address })
        .catch(() => [] as unknown);
      const parsed = parseAttestations(parseRawAttestations(raw));
      writeCache(address, parsed);
      return parsed;
    },
    enabled: !!address,
    staleTime: CACHE_TTL,
  });
}

export function useAttestations(address: string | undefined) {
  return useQuery(attestationsQueryOptions(address));
}
