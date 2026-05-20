import { z } from "zod";
import { env } from "./env";

export type GovernanceParamType = "number" | "integer" | "string";

const num = (defaultValue: number) => ({
  type: "number" as const,
  default: defaultValue,
});
const int = (defaultValue: number) => ({
  type: "integer" as const,
  default: defaultValue,
});
const str = (defaultValue: string) => ({
  type: "string" as const,
  default: defaultValue,
});

/**
 * Single source of truth for every AA-tunable parameter: name, runtime type
 * (used by the governance UI for input validation), and default value (used
 * when the AA hasn't set a custom value yet). `defaultParams`,
 * `governanceParams`, and `variablesSchema` are all derived from this — add a
 * new parameter here and the rest follows automatically.
 */
export const paramDefs = {
  daily_locked_reward: num(0.01),
  daily_liquid_reward: num(0.001),
  bytes_reducer: num(0.75),
  by_votes_share: num(0.5),
  referrer_coop_deposit_reward_share: num(0.02),
  referrer_bytes_deposit_reward_share: num(0.01),
  referral_reward: int(10e9),
  min_balance_instead_of_real_name: int(1e8),
  messaging_attestors: str(
    "WMFLGI2GLAB2MDF2KQAH37VNRRMK7A5N:WVO7PWJUAIEGJM7HY25SX6UPXSTCN4VH:FSJVTTCHUIWALPN7Y6GYEKZACXMEXIG3:5KM36CFPBD2QJLVD65PHZG34WEM4RPY2",
  ),
  real_name_attestors: str(
    "WMFLGI2GLAB2MDF2KQAH37VNRRMK7A5N:WVO7PWJUAIEGJM7HY25SX6UPXSTCN4VH:FSJVTTCHUIWALPN7Y6GYEKZACXMEXIG3",
  ),
} as const;

export type AppParamName = keyof typeof paramDefs;
export type AppParams = {
  [K in AppParamName]: (typeof paramDefs)[K]["default"];
};

const paramEntries = Object.entries(paramDefs) as Array<
  [AppParamName, (typeof paramDefs)[AppParamName]]
>;

export const defaultParams: AppParams = Object.fromEntries(
  paramEntries.map(([name, def]) => [name, def.default]),
) as AppParams;

export interface GovernanceParamDef {
  name: AppParamName;
  type: GovernanceParamType;
}

export const governanceParams: GovernanceParamDef[] = paramEntries.map(
  ([name, def]) => ({ name, type: def.type }),
);

type VariablesShape = {
  [K in AppParamName]: AppParams[K] extends string
    ? z.ZodOptional<z.ZodString>
    : z.ZodOptional<z.ZodNumber>;
};

const variablesShape = Object.fromEntries(
  paramEntries.map(([name, def]) => [
    name,
    def.type === "string" ? z.string().optional() : z.number().optional(),
  ]),
) as VariablesShape;

export const variablesSchema = z.object(variablesShape);

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
