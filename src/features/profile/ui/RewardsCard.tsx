import type { FC, ReactNode } from "react";
import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ChevronDown } from "lucide-react";

import { Card, CardContent, CardTitle } from "#/shared/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "#/shared/ui/collapsible";
import { Separator } from "#/shared/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "#/shared/ui/tooltip";

import { toLocalString } from "#/shared/lib/toLocalString";
import { formatRounded } from "#/shared/lib/formatRounded";
import { cn } from "#/shared/lib/utils";

import type { CoopUser } from "#/entities/coop";

import * as m from "#/paraglide/messages";

interface RewardsCardProps {
  user: CoopUser;
  coopDecimals: number;
  coopSymbol: string;
  /**
   * Optional slot rendered at the bottom-right of the card. The page composes
   * the actual claim-rewards-dialog trigger here, so this card stays free of
   * any cross-feature imports.
   */
  action?: ReactNode;
}

export const RewardsCard: FC<RewardsCardProps> = ({
  user,
  coopDecimals,
  coopSymbol,
  action,
}) => {
  const [collapsed, setCollapsed] = useState(true);

  const coopDivisor = 10 ** coopDecimals;

  const lockedRewards = user.locked_rewards ?? 0;
  const liquidRewards = user.liquid_rewards ?? 0;
  const totalRewards = lockedRewards + liquidRewards;
  const totalRewardsRaw = totalRewards / coopDivisor;

  const referralRewards = user.referral_rewards ?? 0;
  const referredUsers = user.referred_users ?? 0;

  const hasDetails =
    lockedRewards > 0 ||
    liquidRewards > 0 ||
    referralRewards > 0 ||
    referredUsers > 0 ||
    !!user.ref;

  return (
    <Card>
      <CardContent>
        <CardTitle>{m.profile_rewards_title()}</CardTitle>
        <Collapsible
          open={!collapsed}
          onOpenChange={() => setCollapsed(!collapsed)}
        >
          <CollapsibleTrigger asChild className="mt-2 text-lg lg:text-xl">
            <div className={cn(hasDetails ? "cursor-pointer select-none" : "")}>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span>{formatRounded(totalRewardsRaw, coopDecimals)}</span>
                  </TooltipTrigger>
                  <TooltipContent>
                    {toLocalString(totalRewardsRaw)} {coopSymbol}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>{" "}
              <small>{coopSymbol}</small>
              {hasDetails && (
                <ChevronDown
                  className={cn(
                    "ml-2 inline-block transition-transform duration-200",
                    collapsed ? "rotate-0" : "-rotate-180",
                  )}
                  size={24}
                />
              )}
            </div>
          </CollapsibleTrigger>

          <CollapsibleContent className="mt-2 grid gap-3 text-sm">
            <Separator />

            {lockedRewards > 0 && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="text-muted-foreground">
                      {m.profile_locked_rewards_detail({
                        amount: formatRounded(
                          lockedRewards / coopDivisor,
                          coopDecimals,
                        ),
                        symbol: coopSymbol,
                      })}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    {toLocalString(lockedRewards / coopDivisor)} {coopSymbol}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}

            {liquidRewards > 0 && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="text-muted-foreground">
                      {m.profile_liquid_rewards_detail({
                        amount: formatRounded(
                          liquidRewards / coopDivisor,
                          coopDecimals,
                        ),
                        symbol: coopSymbol,
                      })}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    {toLocalString(liquidRewards / coopDivisor)} {coopSymbol}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}

            {referralRewards > 0 && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="text-muted-foreground">
                      {m.profile_referral_rewards_detail({
                        amount: formatRounded(
                          referralRewards / coopDivisor,
                          coopDecimals,
                        ),
                        symbol: coopSymbol,
                      })}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    {toLocalString(referralRewards / coopDivisor)} {coopSymbol}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}

            {referredUsers > 0 && (
              <div className="text-muted-foreground">
                {m.profile_referred_users_detail({ count: referredUsers })}
              </div>
            )}

            {user.ref && (
              <div className="text-muted-foreground">
                {m.profile_referrer()}:{" "}
                <Link
                  to="/user/$address"
                  params={{ address: user.ref }}
                  className="font-mono underline-offset-4 hover:underline"
                >
                  {user.ref.slice(0, 6)}...{user.ref.slice(-4)}
                </Link>
              </div>
            )}
          </CollapsibleContent>
        </Collapsible>

        {action && <div className="mt-3 flex justify-end">{action}</div>}
      </CardContent>
    </Card>
  );
};
