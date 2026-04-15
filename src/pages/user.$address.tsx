import { createFileRoute } from "@tanstack/react-router";
import * as m from "#/paraglide/messages";

import { useCoopState } from "#/entities/coop";
import { useAssetInfo } from "#/entities/token";
import {
  ProfileHeader,
  BalanceCard,
  RewardsCard,
  VotesCard,
  VotesList,
  ProfileSkeleton,
} from "#/features/profile";
import { VoteButton } from "#/features/voting";

export const Route = createFileRoute("/user/$address")({
  component: UserProfile,
});

function UserProfile() {
  const { address } = Route.useParams();
  const { status, constants, getUser } = useCoopState();
  const { coopDecimals, gbyteDecimals, coopSymbol, gbyteSymbol } = useAssetInfo(
    constants?.asset,
  );
  const user = getUser(address);
  const isLoaded = status === "loaded";

  if (!isLoaded) return <ProfileSkeleton />;

  if (!user) {
    return (
      <div className="py-12 text-center">
        <h2 className="text-2xl font-bold">{m.profile_not_found()}</h2>
        <p className="mt-2 text-muted-foreground">
          {m.profile_not_found_description()}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-10">
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

        <div className="col-span-6 lg:col-span-3">
          <VotesList address={address} />
        </div>
      </div>
    </div>
  );
}
