import type { AttestationProfile } from "../model/schemas";

/**
 * Reads a field from an attestation profile and normalizes it to a string.
 * Returns `null` when the field is missing, empty, or of an unsupported shape.
 *
 * Why: Obyte attestation payloads are heterogeneous — `user_id`, for example,
 * arrives as either a string or a number. Components want a definite string
 * (for URLs, hrefs, render output), so this is the single place where we
 * normalize and validate that shape.
 */
export function getProfileField(
  profile: AttestationProfile | null | undefined,
  key: string,
): string | null {
  if (!profile) return null;
  const value = profile[key];
  if (typeof value === "string") return value.length > 0 ? value : null;
  if (typeof value === "number" && Number.isFinite(value)) return String(value);
  return null;
}
