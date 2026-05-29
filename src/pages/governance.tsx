import { createFileRoute } from "@tanstack/react-router";
import * as m from "#/paraglide/messages";

import { useWallet } from "#/entities/user";
import { useCoopState } from "#/entities/coop";
import { useAssetInfo } from "#/entities/token";
import { useGovernanceState } from "#/entities/governance";
import { ogImageUrl } from "#/shared/lib/ogImage";
import { buildRouteMeta, seoRoutes } from "#/shared/config/seoRoutes";
import { ConnectWalletDialog } from "#/features/connect-wallet";
import {
  GovernanceProfile,
  GovernanceParamList,
  GovernanceProfileSkeleton,
  GovernanceParamListSkeleton,
} from "#/features/governance";

const governanceRoute = seoRoutes.find((r) => r.path === "/governance")!;

export const Route = createFileRoute("/governance")({
  head: () => ({
    meta: buildRouteMeta(
      governanceRoute,
      ogImageUrl(governanceRoute.ogImagePath),
    ),
  }),
  component: Governance,
});

function Governance() {
  const { address } = useWallet();
  const { status: coopStatus, constants } = useCoopState();
  const { coopDecimals, coopSymbol } = useAssetInfo(constants?.asset);
  const { status: govStatus, params } = useGovernanceState(address);

  const governanceAa = constants?.governance_aa;
  const isLoaded = coopStatus === "loaded" && govStatus === "loaded";

  const introParts = m
    .governance_connect_wallet_intro({ wallet: "[WALLET]" })
    .split("[WALLET]");

  return (
    <>
      <h2 className="bg-linear-to-b from-foreground to-foreground bg-clip-text mb-6 pb-1 text-2xl font-semibold leading-tighter tracking-tighter text-transparent">
        {m.nav_governance()}
      </h2>
      <div className="flex flex-col gap-8">
        {isLoaded ? (
          <GovernanceProfile
            connectWallet={
              <>
                {introParts.map((part, i) => (
                  <span key={i}>
                    {i > 0 && (
                      <ConnectWalletDialog>
                        <button className="cursor-pointer font-medium link">
                          {m.wallet_add()}
                        </button>
                      </ConnectWalletDialog>
                    )}
                    {part}
                  </span>
                ))}
              </>
            }
          />
        ) : (
          <GovernanceProfileSkeleton />
        )}
        {isLoaded && governanceAa ? (
          <GovernanceParamList
            params={params}
            governanceAa={governanceAa}
            address={address}
            coopDecimals={coopDecimals}
            coopSymbol={coopSymbol}
          />
        ) : (
          <GovernanceParamListSkeleton />
        )}
      </div>
    </>
  );
}
