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
import { Amount } from "#/shared/ui/amount";

import { cn } from "#/shared/lib/utils";

import type { CoopUser } from "#/entities/coop";
import { useLiveUserBalances } from "#/entities/coop";

import * as m from "#/paraglide/messages";

interface RewardsCardProps {
  user: CoopUser;
  coopDecimals: number;
  coopSymbol: string;
  /**
   * Optional slot rendered in the top-right corner of the card next to the
   * title. The page composes the actual claim-rewards-dialog trigger here so
   * this card stays free of any cross-feature imports.
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
  const { pendingLocked, pendingLiquid } = useLiveUserBalances(user);

  const coopDivisor = 10 ** coopDecimals;

  const lockedRewards = (user.locked_rewards ?? 0) + pendingLocked;
  const liquidRewards = (user.liquid_rewards ?? 0) + pendingLiquid;
  const totalRewards = lockedRewards + liquidRewards;
  const totalRewardsRaw = totalRewards / coopDivisor;
  const lockedRewardsRaw = lockedRewards / coopDivisor;
  const liquidRewardsRaw = liquidRewards / coopDivisor;

  const referralRewards = user.referral_rewards ?? 0;
  const referralRewardsRaw = referralRewards / coopDivisor;
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
        <div className="flex items-center justify-between gap-2">
          <CardTitle>{m.profile_rewards_title()}</CardTitle>
          {action}
        </div>
        <Collapsible
          open={hasDetails && !collapsed}
          onOpenChange={() => hasDetails && setCollapsed(!collapsed)}
        >
          <CollapsibleTrigger asChild className="mt-2 text-lg lg:text-xl">
            <div className={cn(hasDetails ? "cursor-pointer select-none" : "")}>
              <Amount
                value={totalRewardsRaw}
                decimals={coopDecimals}
                symbol={coopSymbol}
              />{" "}
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
              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  {m.profile_locked_rewards_detail()}
                </span>
                <span>
                  <Amount
                    value={lockedRewardsRaw}
                    decimals={coopDecimals}
                    symbol={coopSymbol}
                  />{" "}
                  {coopSymbol}
                </span>
              </div>
            )}

            {liquidRewards > 0 && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  {m.profile_liquid_rewards_detail()}
                </span>
                <span>
                  <Amount
                    value={liquidRewardsRaw}
                    decimals={coopDecimals}
                    symbol={coopSymbol}
                  />{" "}
                  {coopSymbol}
                </span>
              </div>
            )}

            {referralRewards > 0 && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  {m.profile_referral_rewards_detail()}
                </span>
                <span>
                  <Amount
                    value={referralRewardsRaw}
                    decimals={coopDecimals}
                    symbol={coopSymbol}
                  />{" "}
                  {coopSymbol}
                </span>
              </div>
            )}

            {referredUsers > 0 && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  {m.profile_referred_users_detail()}
                </span>
                <span>{referredUsers}</span>
              </div>
            )}

            {user.ref && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  {m.profile_referrer()}
                </span>
                <Link
                  to="/user/$address"
                  params={{ address: user.ref }}
                  className="font-mono font-medium link"
                >
                  {user.ref.slice(0, 6)}...{user.ref.slice(-4)}
                </Link>
              </div>
            )}
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  );
};
