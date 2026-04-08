import type { ReactNode } from "react";

import { Info } from "lucide-react";

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
  const { coopSymbol } = useAssetInfo(constants?.asset);

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
  const votingPower = Math.sqrt(totalBalance);

  return (
    <Card>
      <CardContent className="flex flex-wrap items-center justify-between gap-4 py-4">
        <div className="flex items-center gap-2 text-sm">
          <span className="text-muted-foreground">Wallet:</span>
          <a
            href={getExplorerUrl(address, "address")}
            target="_blank"
            rel="noopener"
            className="font-medium text-foreground underline underline-offset-4 hover:text-muted-foreground"
          >
            {address.slice(0, 6)}...{address.slice(-6)}
          </a>
        </div>
        <div className="flex items-center gap-6 text-sm">
          <div className="flex items-center gap-1">
            <span className="text-muted-foreground">Balance: </span>
            <span className="font-medium">
              {toLocalString(totalBalance / 1e9)} {coopSymbol}
            </span>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="size-3.5 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p className="text-xs">
                    Your total locked balance used to calculate voting power and
                    emission rewards.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-muted-foreground">Voting power: </span>
            <span className="font-medium">{toLocalString(votingPower)}</span>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="size-3.5 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p className="text-xs">
                    Square root of your locked balance. Determines the weight of
                    your governance votes.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
