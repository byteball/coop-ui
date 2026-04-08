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

export const attestationLinks = {
  telegram:
    "obyte:A1KwcOAZSWwBnXwa1BKfmhEP2yow1kaUuoi5A6HLOzJZ@obyte.org/bb#0000",
  discord:
    "obyte:Ama48/uKO+/Tjv28zFKwElBO4SEQNuWAM1VPJkl4DTZO@obyte.org/bb#0000",
  realName:
    "obyte:AsYnI7C8WuXqb2aLMSr0nfpLC+u3FRSLWwkp1e9ib15Z@obyte.org/bb#0000",
} as const;
