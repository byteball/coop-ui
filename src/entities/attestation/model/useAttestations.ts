import { useQuery } from "@tanstack/react-query";

import client from "#/shared/api/obyte";
import { attestors } from "#/shared/config/appConfig";
import { storageKey } from "#/shared/lib/storageKey";

import type { ParsedAttestations, RawAttestation } from "./types";

const tgSet = new Set(attestors.telegramAttestors);
const discordSet = new Set(attestors.discordAttestors);
const realNameSet = new Set(attestors.realNameAttestors);

const CACHE_TTL = 60 * 60 * 1000; // 1 hour

function getCacheKey(address: string): string {
  return storageKey("attestations_" + address);
}

function readCache(address: string): ParsedAttestations | null {
  try {
    const raw = localStorage.getItem(getCacheKey(address));
    if (!raw) return null;
    const { data, ts } = JSON.parse(raw) as {
      data: ParsedAttestations;
      ts: number;
    };
    if (Date.now() - ts > CACHE_TTL) return null;
    return data;
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

function parseAttestations(raw: RawAttestation[]): ParsedAttestations {
  let telegram: ParsedAttestations["telegram"] = null;
  let discord: ParsedAttestations["discord"] = null;
  let realName: ParsedAttestations["realName"] = null;

  for (const att of raw) {
    if (!telegram && tgSet.has(att.attestor_address)) {
      telegram = att.profile;
    } else if (!discord && discordSet.has(att.attestor_address)) {
      discord = att.profile;
    } else if (!realName && realNameSet.has(att.attestor_address)) {
      realName = att.profile;
    }
  }

  const displayName =
    telegram?.username ?? discord?.username ?? realName?.username ?? null;

  return { telegram, discord, realName, displayName };
}

export function useAttestations(address: string | undefined) {
  return useQuery({
    queryKey: ["attestations", address],
    queryFn: async (): Promise<ParsedAttestations> => {
      const cached = readCache(address!);
      if (cached) return cached;

      const raw: RawAttestation[] = await client.api
        .getAttestations({ address })
        .catch(() => []);
      const parsed = parseAttestations(raw);
      writeCache(address!, parsed);
      return parsed;
    },
    enabled: !!address,
    staleTime: CACHE_TTL,
  });
}
