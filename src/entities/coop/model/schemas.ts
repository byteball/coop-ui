import { z } from "zod";

export const coopConstantsSchema = z.object({
  asset: z.string(),
  launch_ts: z.number(),
  governance_aa: z.string(),
});

export const coopUserSchema = z.object({
  balance: z.number(),
  bytes_balance: z.number(),
  total_balance: z.number(),
  unlock_date: z.union([z.string(), z.literal(false)]),
  reg_date: z.string(),
  reg_ts: z.number(),
  last_ts: z.number(),
  last_locked_emissions_per_vote: z.number(),
  last_liquid_emissions_per_vote: z.number(),
  last_locked_emissions_per_vb: z.number(),
  last_liquid_emissions_per_vb: z.number(),
  liquid_balance: z.number().optional(),
  votes: z.number().optional(),
  ref: z.string().optional(),
  no_referrer_deposit_reward: z.boolean().optional(),
  referral_rewards: z.number().optional(),
  referred_users: z.number().optional(),
  locked_rewards: z.number().optional(),
  liquid_rewards: z.number().optional(),
});

export const aaResponseBodySchema = z.object({
  updatedStateVars: z
    .record(z.string(), z.record(z.string(), z.object({ value: z.unknown() })))
    .optional(),
});

export const aaResponseMessageSchema = z.tuple([
  z.string(),
  z.object({
    subject: z.string().optional(),
    body: aaResponseBodySchema.optional(),
  }),
]);

export function parseCoopUser(value: unknown) {
  const result = coopUserSchema.safeParse(value);
  return result.success ? result.data : undefined;
}
