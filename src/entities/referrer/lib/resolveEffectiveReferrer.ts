import type { CoopUser } from "#/entities/coop";

export function resolveEffectiveReferrer(
  stored: string | null | undefined,
  address: string | null | undefined,
  getUser: (address: string) => CoopUser | undefined,
): string | undefined {
  if (!stored) return undefined;
  if (stored === address) return undefined;
  if (!getUser(stored)) return undefined;
  if (address && getUser(address)?.ref) return undefined;
  return stored;
}
