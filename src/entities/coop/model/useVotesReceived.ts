import { useMemo } from "react";
import { useStore } from "@tanstack/react-store";

import { coopStore } from "./store";
import { parseAllVotes } from "../lib/parseAllVotes";

export interface VoteRecord {
  fromAddress: string;
  votes: number;
  strength?: number;
  ts: number;
}

export function extractVotesReceived(
  vars: Record<string, unknown>,
  address: string | undefined,
): VoteRecord[] {
  if (!address) return [];

  return parseAllVotes(vars)
    .filter((v) => v.toAddress === address)
    .map(({ fromAddress, votes, strength, ts }) => ({
      fromAddress,
      votes,
      strength,
      ts,
    }))
    .sort((a, b) => a.ts - b.ts);
}

export function useVotesReceived(address: string | undefined): VoteRecord[] {
  const vars = useStore(coopStore, (s) => s.vars);

  return useMemo(() => extractVotesReceived(vars, address), [vars, address]);
}
