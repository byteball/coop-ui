import type { ReactNode } from "react";

import { Info } from "lucide-react";
import * as m from "#/paraglide/messages";

import { Card, CardContent } from "#/shared/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "#/shared/ui/tooltip";
import { toLocalString } from "#/shared/lib/toLocalString";
import { getExplorerUrl } from "#/shared/lib/getExplorerUrl";
import { useWallet } from "#/entities/user";
import { useCoopState } from "#/entities/coop";
import { useAssetInfo } from "#/entities/token";

interface GovernanceProfileProps {
  connectWallet?: ReactNode;
}

export function GovernanceProfile({ connectWallet }: GovernanceProfileProps) {
  const { address, isConnected } = useWallet();
  const { constants, getUser } = useCoopState();
  const { coopDecimals, coopSymbol } = useAssetInfo(constants?.asset);
  const coopDivisor = 10 ** coopDecimals;

  if (!isConnected || !address) {
    return (
      <Card>
        <CardContent className="py-4 text-center text-sm text-muted-foreground">
          {connectWallet}
        </CardContent>
      </Card>
    );
  }

  const user = getUser(address);
  const totalBalance = user?.total_balance ?? 0;
  const votingPower = Math.sqrt(totalBalance / coopDivisor);

  return (
    <Card>
      <CardContent className="flex flex-col gap-3 py-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-4">
        <div className="flex flex-col gap-0.5 text-sm sm:flex-row sm:items-center sm:gap-2">
          <span className="text-muted-foreground">
            {m.governance_profile_wallet()}
          </span>
          <a
            href={getExplorerUrl(address, "address")}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium link"
          >
            {address.slice(0, 6)}...{address.slice(-6)}
          </a>
        </div>
        <div className="flex flex-col gap-3 text-sm sm:flex-row sm:items-center sm:gap-6">
          <div className="flex flex-col gap-0.5 sm:flex-row sm:items-center sm:gap-1">
            <div className="flex items-center gap-1">
              <span className="text-muted-foreground">
                {m.governance_profile_balance()}
              </span>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="size-3.5 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <p className="text-xs">
                      {m.governance_profile_balance_tooltip()}
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <span className="font-medium">
              {toLocalString(totalBalance / coopDivisor)} {coopSymbol}
            </span>
          </div>
          <div className="flex flex-col gap-0.5 sm:flex-row sm:items-center sm:gap-1">
            <div className="flex items-center gap-1">
              <span className="text-muted-foreground">
                {m.governance_profile_voting_power()}
              </span>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="size-3.5 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <p className="text-xs">
                      {m.governance_profile_voting_power_tooltip()}
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <span className="font-medium">{toLocalString(votingPower)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
