import { createFileRoute } from "@tanstack/react-router";
import obyte from "obyte";
import * as m from "#/paraglide/messages";

import { Card, CardContent, CardTitle } from "#/shared/ui/card";
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
import { DepositBanner, DepositForm } from "#/features/deposit";

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
    last_locked_emissions: 0,
    last_liquid_emissions: 0,
  };

  const user = getUser(address) ?? defaultUser;

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
          />
        </div>
        <div className="col-span-6 md:col-span-3 lg:col-span-2">
          <RewardsCard
            user={user}
            coopDecimals={coopDecimals}
            coopSymbol={coopSymbol}
          />
        </div>
        <div className="col-span-6 md:col-span-3 lg:col-span-2">
          <VotesCard totalVotes={user.votes ?? 0} />
        </div>

        {isYou && (
          <div className="col-span-6">
            <Card>
              <CardContent>
                <CardTitle>{m.deposit_title()}</CardTitle>
                <div className="mt-4">
                  <DepositForm />
                </div>
              </CardContent>
            </Card>
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
