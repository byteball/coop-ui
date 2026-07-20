import type { FC } from "react";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "#/shared/ui/tooltip";
import { toLocalString } from "#/shared/lib/toLocalString";
import { formatDateShort } from "#/shared/lib/formatDateShort";
import { formatPeriod } from "#/shared/lib/formatPeriod";
import { cn } from "#/shared/lib/utils";
import { getVoteExpiry, isVoteExpired } from "#/entities/coop";
import { UserDisplayName } from "#/entities/attestation";

import * as m from "#/paraglide/messages";

interface VoteRowProps {
  counterpartyAddress: string;
  ts: number;
  votes: number;
  votesDivisor: number;
  strength?: number;
  isSelfVote: boolean;
}

export const VoteRow: FC<VoteRowProps> = ({
  counterpartyAddress,
  ts,
  votes,
  votesDivisor,
  strength,
  isSelfVote,
}) => {
  const hasBadges = isSelfVote || typeof strength === "number";

  const expiresTs = getVoteExpiry(ts);
  const isExpired = isVoteExpired(ts);

  return (
    <div className="space-y-1 sm:grid sm:grid-cols-[1fr_auto_7rem] sm:items-center sm:gap-x-2">
      <div className="flex items-center justify-between gap-3 sm:contents">
        <div className="min-w-0 truncate">
          <UserDisplayName address={counterpartyAddress} />
        </div>
        <span className="text-right tabular-nums text-muted-foreground sm:col-start-3 sm:row-span-2 sm:row-start-1">
          {toLocalString(votes / votesDivisor)}
        </span>
      </div>
      <div className="flex items-center justify-between gap-3 sm:contents">
        <div className="flex min-w-0 flex-col text-xs text-muted-foreground sm:row-start-2">
          <span>{formatDateShort(new Date(ts * 1000))}</span>
          <span className={cn(isExpired && "text-destructive")}>
            {isExpired
              ? m.vote_list_expired()
              : m.vote_list_expires_in({
                  period: formatPeriod(expiresTs, { collapseDays: true }),
                })}
          </span>
        </div>
        {hasBadges && (
          <div className="flex shrink-0 items-center gap-2 sm:col-start-2 sm:row-span-2 sm:row-start-1 sm:justify-self-end">
            {isSelfVote && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="rounded bg-muted px-1.5 py-0.5 text-xs text-muted-foreground">
                      {m.vote_list_self()}
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>{m.vote_self()}</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
            {typeof strength === "number" && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="rounded bg-muted px-1.5 py-0.5 text-xs text-muted-foreground">
                      {m.vote_list_strength({ n: String(strength) })}
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>
                    {m.vote_list_strength_tooltip()}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
