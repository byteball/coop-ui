import { z } from "zod";

// Attestation payloads from Obyte vary in shape — e.g. `user_id` is sometimes
// a number, sometimes a string. Conventional fields consumers reach for are
// `username`, `userId`, `user_id`; use `getProfileField` to read them safely.
export const profileSchema = z.record(z.string(), z.unknown());

export const rawAttestationSchema = z.object({
  attestor_address: z.string(),
  profile: profileSchema,
});

export const parsedAttestationsSchema = z.object({
  telegram: profileSchema.nullable(),
  discord: profileSchema.nullable(),
  realName: profileSchema.nullable(),
  displayName: z.string().nullable(),
});

export type AttestationProfile = z.infer<typeof profileSchema>;
export type RawAttestation = z.infer<typeof rawAttestationSchema>;
export type ParsedAttestations = z.infer<typeof parsedAttestationsSchema>;
