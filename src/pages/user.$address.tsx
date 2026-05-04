import { createFileRoute } from "@tanstack/react-router";
import obyte from "obyte";
import { HandCoins, Plus } from "lucide-react";
import * as m from "#/paraglide/messages";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "#/shared/ui/tooltip";

import { useWallet } from "#/entities/user";
import { useCoopState } from "#/entities/coop";
import type { CoopUser } from "#/entities/coop";
import { useAssetInfo } from "#/entities/token";
import {
  ProfileHeader,
  BalanceCard,
  RewardsCard,
  VotesCard,
  VotesList,
  VotesGivenList,
  ProfileSkeleton,
} from "#/features/profile";
import { VoteButton } from "#/features/voting";
import { DepositBanner, DepositDialog } from "#/features/deposit";
import { ReplaceForm } from "#/features/replace";
import { ClaimRewardsDialog } from "#/features/claim-rewards";

export const Route = createFileRoute("/user/$address")({
  component: UserProfile,
});

function UserProfile() {
  const { address } = Route.useParams();
  const { address: connectedAddress } = useWallet();
  const { status, constants, getUser } = useCoopState();
  const isYou = connectedAddress === address;
  const { coopDecimals, gbyteDecimals, coopSymbol, gbyteSymbol } = useAssetInfo(
    constants?.asset,
  );
  const isLoaded = status === "loaded";
  const isValidAddress = obyte.utils.isValidAddress(address);

  if (!isLoaded) return <ProfileSkeleton isYou={isYou} />;

  if (!isValidAddress) {
    return (
      <div className="py-12 text-center">
        <h2 className="text-2xl font-bold">{m.profile_not_found()}</h2>
        <p className="mt-2 text-muted-foreground">
          {m.profile_not_found_description()}
        </p>
      </div>
    );
  }

  const defaultUser: CoopUser = {
    balance: 0,
    bytes_balance: 0,
    total_balance: 0,
    unlock_date: false,
    reg_date: "",
    reg_ts: 0,
    last_ts: 0,
    last_locked_emissions_per_vote: 0,
    last_liquid_emissions_per_vote: 0,
    last_locked_emissions_per_vb: 0,
    last_liquid_emissions_per_vb: 0,
  };

  const user = getUser(address) ?? defaultUser;

  const liquidRewards = user.liquid_rewards ?? 0;

  const lockMoreAction = isYou ? (
    <TooltipProvider>
      <Tooltip>
        <DepositDialog>
          <TooltipTrigger asChild>
            <button
              type="button"
              aria-label={m.profile_lock_more()}
              className="flex cursor-pointer items-center justify-center rounded-full p-1 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              <Plus className="size-4" />
            </button>
          </TooltipTrigger>
        </DepositDialog>
        <TooltipContent>{m.profile_lock_more()}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ) : null;

  const claimRewardsAction =
    isYou && liquidRewards > 0 ? (
      <TooltipProvider>
        <Tooltip>
          <ClaimRewardsDialog user={user}>
            <TooltipTrigger asChild>
              <button
                type="button"
                aria-label={m.profile_claim_rewards_tooltip()}
                className="flex cursor-pointer items-center justify-center rounded-full p-1 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              >
                <HandCoins className="size-4" />
              </button>
            </TooltipTrigger>
          </ClaimRewardsDialog>
          <TooltipContent>
            {m.profile_claim_rewards_tooltip()}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    ) : null;

  return (
    <div className="space-y-10">
      <DepositBanner user={user} address={address} />
      <div className="flex items-start justify-between gap-4">
        <ProfileHeader address={address} user={user} />
        <VoteButton address={address} />
      </div>

      <div className="grid grid-cols-6 gap-8 [&>div>*]:h-full">
        <div className="col-span-6 md:col-span-3 lg:col-span-2">
          <BalanceCard
            user={user}
            coopDecimals={coopDecimals}
            gbyteDecimals={gbyteDecimals}
            coopSymbol={coopSymbol}
            gbyteSymbol={gbyteSymbol}
            action={lockMoreAction}
          />
        </div>
        <div className="col-span-6 md:col-span-3 lg:col-span-2">
          <RewardsCard
            user={user}
            coopDecimals={coopDecimals}
            coopSymbol={coopSymbol}
            action={claimRewardsAction}
          />
        </div>
        <div className="col-span-6 md:col-span-3 lg:col-span-2">
          <VotesCard totalVotes={user.votes ?? 0} />
        </div>

        {isYou && user.bytes_balance > 0 && (
          <div className="col-span-6 md:col-span-3">
            <ReplaceForm user={user} />
          </div>
        )}

        <div className="col-span-6 lg:col-span-3">
          <VotesList address={address} />
        </div>
        <div className="col-span-6 lg:col-span-3">
          <VotesGivenList address={address} />
        </div>
      </div>
    </div>
  );
}
