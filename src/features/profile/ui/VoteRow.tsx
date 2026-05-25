import type { FC } from "react";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "#/shared/ui/tooltip";
import { toLocalString } from "#/shared/lib/toLocalString";
import { formatDateShort } from "#/shared/lib/formatDateShort";
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

  return (
    <div className="grid grid-cols-[1fr_7rem] items-center gap-x-2 gap-y-1 sm:grid-cols-[1fr_auto_7rem] sm:gap-y-2">
      <div className="flex min-w-0 flex-col">
        <UserDisplayName address={counterpartyAddress} />
        <span className="text-xs text-muted-foreground">
          {formatDateShort(new Date(ts * 1000))}
        </span>
      </div>
      <span className="col-start-2 row-start-1 text-right tabular-nums text-muted-foreground sm:col-start-3 sm:row-auto">
        {toLocalString(votes / votesDivisor)}
      </span>
      {hasBadges && (
        <div className="col-span-2 flex items-center gap-2 sm:col-span-1 sm:col-start-2 sm:row-start-1 sm:justify-end">
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
  );
};
