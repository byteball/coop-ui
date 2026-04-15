import { useMemo } from "react";
import { useStore } from "@tanstack/react-store";

import { coopStore } from "./store";

export interface VoteRecord {
  fromAddress: string;
  votes: number;
  ts: number;
}

const VOTE_PREFIX = "vote_";

export function useVotesReceived(address: string | undefined): VoteRecord[] {
  const vars = useStore(coopStore, (s) => s.vars);

  return useMemo(() => {
    if (!address) return [];
    const suffix = `_${address}`;
    const records: VoteRecord[] = [];

    for (const key in vars) {
      if (!key.startsWith(VOTE_PREFIX) || !key.endsWith(suffix)) continue;
      const val = vars[key] as { votes: number; ts: number } | null;
      if (!val || typeof val.votes !== "number") continue;

      const fromAddress = key.slice(
        VOTE_PREFIX.length,
        key.length - suffix.length,
      );
      records.push({
        fromAddress,
        votes: val.votes,
        ts: val.ts,
      });
    }

    records.sort((a, b) => a.ts - b.ts);
    return records;
  }, [vars, address]);
}
