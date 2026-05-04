import { env } from "./env";

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
  type: GovernanceParamType;
}

export const governanceParams: GovernanceParamDef[] = [
  { name: "daily_locked_reward", type: "number" },
  { name: "daily_liquid_reward", type: "number" },
  { name: "bytes_reducer", type: "number" },
  { name: "by_votes_share", type: "number" },
  { name: "referrer_coop_deposit_reward_share", type: "number" },
  { name: "referrer_bytes_deposit_reward_share", type: "number" },
  { name: "referral_reward", type: "integer" },
  { name: "min_balance_instead_of_real_name", type: "integer" },
  { name: "messaging_attestors", type: "string" },
  { name: "real_name_attestors", type: "string" },
];

export const CHALLENGING_PERIOD = 259200; // 3 days in seconds

/**
 * Minimum bytes amount we attach to any AA-bound transaction so it can either
 * pay for itself or bounce back if rejected. Same value is reused for governance
 * and main-AA actions; kept in one place so it can't drift.
 */
export const BOUNCE_FEE = 10000;
export const GOVERNANCE_BOUNCE_FEE = BOUNCE_FEE;

export const attestationLinks = {
  telegram:
    "obyte:A1KwcOAZSWwBnXwa1BKfmhEP2yow1kaUuoi5A6HLOzJZ@obyte.org/bb#0000",
  discord:
    "obyte:Ama48/uKO+/Tjv28zFKwElBO4SEQNuWAM1VPJkl4DTZO@obyte.org/bb#0000",
  realName:
    "obyte:AsYnI7C8WuXqb2aLMSr0nfpLC+u3FRSLWwkp1e9ib15Z@obyte.org/bb#0000",
} as const;

export const obyteServiceUrls = {
  city: (address: string) => `https://city.obyte.org/user/${address}`,
  friends: (address: string) => `https://friends.obyte.org/${address}`,
} as const;

export const obyteCommunityUrls = {
  telegram: "https://t.me/obyteorg",
  discord: "https://discord.obyte.org/",
} as const;

const attestorsByNetwork = {
  livenet: {
    telegramAttestors: ["JBW7HT5CRBSF7J7RD26AYLQG6GZDPFPS"],
    discordAttestors: ["5KM36CFPBD2QJLVD65PHZG34WEM4RPY2"],
    realNameAttestors: ["JFKWGRMXP3KHUAFMF4SJZVDXFL6ACC6P"],
  },
  testnet: {
    telegramAttestors: [
      "WMFLGI2GLAB2MDF2KQAH37VNRRMK7A5N",
      "JBW7HT5CRBSF7J7RD26AYLQG6GZDPFPS",
    ],
    discordAttestors: [
      "WMFLGI2GLAB2MDF2KQAH37VNRRMK7A5N",
      "5KM36CFPBD2QJLVD65PHZG34WEM4RPY2",
    ],
    realNameAttestors: ["JFKWGRMXP3KHUAFMF4SJZVDXFL6ACC6P"],
  },
} as const;

export const attestors =
  attestorsByNetwork[env.VITE_TESTNET ? "testnet" : "livenet"];
