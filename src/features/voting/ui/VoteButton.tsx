import type { FC } from "react";
import { useCallback } from "react";
import { Check, ChevronDown } from "lucide-react";

import { Button } from "#/shared/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
  PopoverTitle,
} from "#/shared/ui/popover";
import { Separator } from "#/shared/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "#/shared/ui/tooltip";
import { env } from "#/shared/config/env";
import { openCustomProtocol } from "#/shared/lib/openCustomProtocol";

import { useWallet } from "#/entities/user";
import { useCoopState } from "#/entities/coop";

import { buildVoteLink } from "../lib/buildVoteLink";

import * as m from "#/paraglide/messages";

interface VoteButtonProps {
  address: string;
}

const STRENGTH_OPTIONS = [
  { strength: 1, label: () => m.vote_strength_1() },
  { strength: 2, label: () => m.vote_strength_2() },
  { strength: 3, label: () => m.vote_strength_3() },
] as const;

function getCurrentStrength(
  votes: number | undefined,
  voterTotalBalance: number | undefined,
): number | null {
  if (!votes || !voterTotalBalance || voterTotalBalance <= 0) return null;
  const strength = Math.round(votes / Math.sqrt(voterTotalBalance));
  return strength >= 1 && strength <= 3 ? strength : null;
}

export const VoteButton: FC<VoteButtonProps> = ({ address }) => {
  const { address: connectedAddress } = useWallet();
  const { vars } = useCoopState();

  const isSelf = connectedAddress === address;
  const mainAa = env.VITE_AA_ADDRESS;

  const voteKey = connectedAddress
    ? `vote_${connectedAddress}_${address}`
    : null;
  const currentVote = voteKey
    ? (vars[voteKey] as { votes: number; ts: number } | undefined)
    : undefined;

  const voterData = connectedAddress
    ? (vars[`user_${connectedAddress}`] as
        | { total_balance: number }
        | undefined)
    : undefined;

  const currentStrength = getCurrentStrength(
    currentVote?.votes,
    voterData?.total_balance,
  );
  const hasVoted = !!currentVote && currentVote.votes > 0;

  const handleVote = useCallback(
    (strength: number) => {
      if (!connectedAddress) return;
      const href = buildVoteLink({
        aa: mainAa,
        forAddress: address,
        strength,
        fromAddress: connectedAddress,
      });
      openCustomProtocol({ href, onProtocolMissing: () => {} });
    },
    [mainAa, address, connectedAddress],
  );

  if (!connectedAddress) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <span>
              <Button variant="outline" disabled>
                {m.vote_button()}
                <ChevronDown className="ml-1 size-4" />
              </Button>
            </span>
          </TooltipTrigger>
          <TooltipContent>{m.vote_connect_wallet()}</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  if (isSelf) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <span>
              <Button variant="outline" disabled>
                {m.vote_button()}
                <ChevronDown className="ml-1 size-4" />
              </Button>
            </span>
          </TooltipTrigger>
          <TooltipContent>{m.vote_self()}</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  const buttonLabel = hasVoted
    ? currentStrength
      ? m.vote_button_voted({ strength: String(currentStrength) })
      : m.vote_button_voted({ strength: "?" })
    : m.vote_button();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant={hasVoted ? "default" : "outline"}>
          {buttonLabel}
          <ChevronDown className="ml-1 size-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-52 p-1" align="start">
        <PopoverTitle className="py-1.5 pl-8 text-sm">
          {m.vote_strength_title()}
        </PopoverTitle>
        <div className="mt-1 grid">
          {STRENGTH_OPTIONS.map(({ strength, label }) => {
            const isCurrent = currentStrength === strength;
            return (
              <button
                key={strength}
                onClick={() => handleVote(strength)}
                className="flex w-full cursor-pointer items-center rounded-sm px-2 py-1.5 text-sm hover:bg-accent"
              >
                {isCurrent ? (
                  <Check className="mr-2 size-4" />
                ) : (
                  <span className="mr-2 inline-block size-4" />
                )}
                {label()}
              </button>
            );
          })}
        </div>
        <Separator className="my-1" />
        <button
          onClick={() => handleVote(0)}
          disabled={!hasVoted}
          className="flex w-full cursor-pointer items-center rounded-sm px-2 py-1.5 text-sm text-muted-foreground hover:bg-accent disabled:pointer-events-none disabled:opacity-50"
        >
          <span className="mr-2 inline-block size-4" />
          {m.vote_unvote()}
        </button>
      </PopoverContent>
    </Popover>
  );
};
