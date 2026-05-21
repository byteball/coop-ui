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
import {
  useCoopState,
  emptyCoopUser,
  useLiveUserBalances,
} from "#/entities/coop";
import { useAssetInfo } from "#/entities/token";
import { attestationsQueryOptions } from "#/entities/attestation";
import { ogImageMeta } from "#/shared/lib/ogImage";
import {
  ProfileHeader,
  BalanceCard,
  RewardsCard,
  VotesCard,
  VotesList,
  VotesGivenList,
  ProfileSkeleton,
} from "#/features/profile";
import { Button } from "#/shared/ui/button";
import { VoteButton } from "#/features/voting";
import { DepositBanner, DepositDialog } from "#/features/deposit";
import { ReplaceForm } from "#/features/replace";
import { ClaimRewardsDialog } from "#/features/claim-rewards";
import { ReferralLinkCard } from "#/features/referrals";

export const Route = createFileRoute("/user/$address")({
  loader: async ({ params, context }) => {
    const data = await context.queryClient.ensureQueryData(
      attestationsQueryOptions(params.address),
    );
    return { displayName: data.displayName };
  },
  head: ({ params, loaderData }) => {
    const a = params.address;
    const short = `${a.slice(0, 6)}...${a.slice(-4)}`;
    const name = loaderData?.displayName ?? short;
    const title = `${name} — Obyte COOP`;
    const description = `COOP profile for ${name} (${a}): balances, rewards, and votes.`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "profile" },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: description },
        ...ogImageMeta(`/og/user/${a}.png`),
      ],
    };
  },
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
  const user = getUser(address) ?? emptyCoopUser();
  const { liveLiquidBalance: liquidClaimable } = useLiveUserBalances(user);
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

  const lockMoreAction = isYou ? (
    <TooltipProvider>
      <Tooltip>
        <DepositDialog>
          <TooltipTrigger asChild>
            <Button
              variant="secondary"
              size="icon-sm"
              aria-label={m.profile_lock_more()}
              className="rounded-full"
            >
              <Plus />
            </Button>
          </TooltipTrigger>
        </DepositDialog>
        <TooltipContent>{m.profile_lock_more()}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ) : null;

  const claimRewardsAction =
    isYou && liquidClaimable > 0 ? (
      <TooltipProvider>
        <Tooltip>
          <ClaimRewardsDialog user={user}>
            <TooltipTrigger asChild>
              <Button
                variant="secondary"
                size="icon-sm"
                aria-label={m.profile_claim_rewards_tooltip()}
                className="rounded-full"
              >
                <HandCoins />
              </Button>
            </TooltipTrigger>
          </ClaimRewardsDialog>
          <TooltipContent>{m.profile_claim_rewards_tooltip()}</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    ) : null;

  return (
    <div className="space-y-6 sm:space-y-10">
      <DepositBanner user={user} address={address} />
      <div className="flex flex-col items-start gap-3 sm:flex-row sm:justify-between sm:gap-4">
        <ProfileHeader address={address} user={user} />
        <div className="self-end sm:self-auto">
          <VoteButton address={address} />
        </div>
      </div>

      <div className="grid grid-cols-6 gap-4 sm:gap-6 lg:gap-8 [&>div>*]:h-full">
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
          <VotesCard totalVotes={user.votes ?? 0} coopDecimals={coopDecimals} />
        </div>

        {isYou && Boolean(user.reg_ts) && (
          <div className="col-span-6 md:col-span-3">
            <ReferralLinkCard address={address} />
          </div>
        )}

        {isYou && user.bytes_balance > 0 && (
          <div className="col-span-6 md:col-span-3">
            <ReplaceForm user={user} />
          </div>
        )}

        <div className="col-span-6 lg:col-span-3">
          <VotesList address={address} coopDecimals={coopDecimals} />
        </div>
        <div className="col-span-6 lg:col-span-3">
          <VotesGivenList address={address} coopDecimals={coopDecimals} />
        </div>
      </div>
    </div>
  );
}
