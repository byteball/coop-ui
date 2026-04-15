import { createFileRoute } from "@tanstack/react-router";
import * as m from "#/paraglide/messages";

import { useWallet } from "#/entities/user";
import { useCoopState, useAllUsers } from "#/entities/coop";
import { useAssetInfo } from "#/entities/token";
import { LeaderboardTable, LeaderboardSkeleton } from "#/features/leaderboard";

export const Route = createFileRoute("/leaderboard")({
  component: Leaderboard,
});

function Leaderboard() {
  const { address } = useWallet();
  const { status, constants } = useCoopState();
  const { coopDecimals, gbyteDecimals, coopSymbol } = useAssetInfo(
    constants?.asset,
  );
  const users = useAllUsers();

  const isLoaded = status === "loaded";

  return (
    <>
      <h2 className="mb-6 text-2xl font-bold">{m.leaderboard_title()}</h2>
      {isLoaded ? (
        <LeaderboardTable
          users={users}
          coopDecimals={coopDecimals}
          gbyteDecimals={gbyteDecimals}
          coopSymbol={coopSymbol}
          connectedAddress={address}
        />
      ) : (
        <LeaderboardSkeleton />
      )}
    </>
  );
}
