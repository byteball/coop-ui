import { attestors } from "#/shared/config/appConfig";

import { rawAttestationSchema } from "../model/schemas";
import type { ParsedAttestations, RawAttestation } from "../model/schemas";

const tgSet = new Set<string>(attestors.telegramAttestors);
const discordSet = new Set<string>(attestors.discordAttestors);
const realNameSet = new Set<string>(attestors.realNameAttestors);

const EMPTY_ATTESTATIONS: ParsedAttestations = {
  telegram: null,
  discord: null,
  realName: null,
  displayName: null,
};

export function emptyAttestations(): ParsedAttestations {
  return { ...EMPTY_ATTESTATIONS };
}

export function parseRawAttestations(value: unknown): RawAttestation[] {
  if (!Array.isArray(value)) return [];
  const out: RawAttestation[] = [];
  for (const item of value) {
    const parsed = rawAttestationSchema.safeParse(item);
    if (parsed.success) {
      out.push({
        attestor_address: parsed.data.attestor_address,
        profile: parsed.data.profile,
      });
    }
  }
  return out;
}

function pickUsername(profile: RawAttestation["profile"] | null): string | null {
  if (!profile) return null;
  const username = profile.username;
  return typeof username === "string" && username.length > 0 ? username : null;
}

export function parseAttestations(raw: RawAttestation[]): ParsedAttestations {
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
    pickUsername(telegram) ?? pickUsername(discord) ?? pickUsername(realName);

  return { telegram, discord, realName, displayName };
}
