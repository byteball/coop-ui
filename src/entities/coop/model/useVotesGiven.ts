import { useMemo } from "react";
import { useStore } from "@tanstack/react-store";

import { coopStore } from "./store";
import { parseAllVotes } from "../lib/parseAllVotes";

export interface VoteGivenRecord {
  toAddress: string;
  votes: number;
  strength?: number;
  ts: number;
}

export function extractVotesGiven(
  vars: Record<string, unknown>,
  address: string | undefined,
): VoteGivenRecord[] {
  if (!address) return [];

  return parseAllVotes(vars)
    .filter((v) => v.fromAddress === address)
    .map(({ toAddress, votes, strength, ts }) => ({
      toAddress,
      votes,
      strength,
      ts,
    }))
    .sort((a, b) => a.ts - b.ts);
}

export function useVotesGiven(address: string | undefined): VoteGivenRecord[] {
  const vars = useStore(coopStore, (s) => s.vars);

  return useMemo(() => extractVotesGiven(vars, address), [vars, address]);
}
