export const defaultParams = {
  daily_locked_reward: 0.01,
  daily_liquid_reward: 0.001,
  bytes_reducer: 0.75,
  by_votes_share: 0.5,
  messaging_attestors:
    "WMFLGI2GLAB2MDF2KQAH37VNRRMK7A5N:WVO7PWJUAIEGJM7HY25SX6UPXSTCN4VH:FSJVTTCHUIWALPN7Y6GYEKZACXMEXIG3:5KM36CFPBD2QJLVD65PHZG34WEM4RPY2",
  real_name_attestors:
    "WMFLGI2GLAB2MDF2KQAH37VNRRMK7A5N:WVO7PWJUAIEGJM7HY25SX6UPXSTCN4VH:FSJVTTCHUIWALPN7Y6GYEKZACXMEXIG3",
  referrer_coop_deposit_reward_share: 0.02,
  referrer_bytes_deposit_reward_share: 0.01,
  referral_reward: 10e9,
  min_balance_instead_of_real_name: 1e8,
} as const;

export type AppParams = typeof defaultParams;
export type AppParamName = keyof AppParams;

export type GovernanceParamType = "number" | "integer" | "string";

export interface GovernanceParamDef {
  name: AppParamName;
  description: string;
  type: GovernanceParamType;
}

export const governanceParams: GovernanceParamDef[] = [
  {
    name: "daily_locked_reward",
    description:
      "Fraction of total locked balance minted daily and added to locked balances.",
    type: "number",
  },
  {
    name: "daily_liquid_reward",
    description:
      "Fraction of total locked balance minted daily and distributed as liquid COOP.",
    type: "number",
  },
  {
    name: "bytes_reducer",
    description:
      "Discount factor applied when converting GBYTE balance to COOP equivalent for emission calculations.",
    type: "number",
  },
  {
    name: "by_votes_share",
    description:
      "Share of emission distributed proportionally to votes received (vs. votes x balance).",
    type: "number",
  },
  {
    name: "referrer_coop_deposit_reward_share",
    description: "Share of COOP deposits credited to the referrer as a reward.",
    type: "number",
  },
  {
    name: "referrer_bytes_deposit_reward_share",
    description:
      "Share of GBYTE deposits credited to the referrer as a reward.",
    type: "number",
  },
  {
    name: "referral_reward",
    description:
      "Fixed COOP reward (in smallest units) for referrer and referee on first deposit.",
    type: "integer",
  },
  {
    name: "min_balance_instead_of_real_name",
    description:
      "Minimum COOP balance (in smallest units) that exempts a user from real-name attestation.",
    type: "integer",
  },
  {
    name: "messaging_attestors",
    description:
      "Colon-separated list of attestor addresses for Telegram/Discord verification.",
    type: "string",
  },
  {
    name: "real_name_attestors",
    description:
      "Colon-separated list of attestor addresses for real-name verification.",
    type: "string",
  },
];

export const CHALLENGING_PERIOD = 259200; // 3 days in seconds
export const GOVERNANCE_BOUNCE_FEE = 10000; // 10000 bytes

export const attestationLinks = {
  telegram:
    "obyte:A1KwcOAZSWwBnXwa1BKfmhEP2yow1kaUuoi5A6HLOzJZ@obyte.org/bb#0000",
  discord:
    "obyte:Ama48/uKO+/Tjv28zFKwElBO4SEQNuWAM1VPJkl4DTZO@obyte.org/bb#0000",
  realName:
    "obyte:AsYnI7C8WuXqb2aLMSr0nfpLC+u3FRSLWwkp1e9ib15Z@obyte.org/bb#0000",
} as const;
