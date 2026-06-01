import type { FC, ReactNode } from "react";
import { useState } from "react";
import { ChevronDown, Info } from "lucide-react";

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
import { Amount } from "#/shared/ui/amount";

import { formatRounded } from "#/shared/lib/formatRounded";
import { formatDateShort } from "#/shared/lib/formatDateShort";
import { cn } from "#/shared/lib/utils";

import type { CoopUser } from "#/entities/coop";
import { useCoopState, useLiveUserBalances } from "#/entities/coop";

import * as m from "#/paraglide/messages";

interface BalanceCardProps {
  user: CoopUser;
  coopDecimals: number;
  gbyteDecimals: number;
  coopSymbol: string;
  gbyteSymbol: string;
  /**
   * Optional slot rendered in the top-right corner of the card next to the
   * title. The page composes the actual deposit-dialog trigger here so this
   * card stays free of any cross-feature imports.
   */
  action?: ReactNode;
  /**
   * Optional withdraw trigger. When provided (lock period has ended and the
   * user has a balance), it is rendered in place of the unlock-date line.
   * Composed by the page so this card stays free of cross-feature imports.
   */
  withdrawAction?: ReactNode;
}

export const BalanceCard: FC<BalanceCardProps> = ({
  user,
  coopDecimals,
  gbyteDecimals,
  coopSymbol,
  gbyteSymbol,
  action,
  withdrawAction,
}) => {
  const [collapsed, setCollapsed] = useState(true);
  const { getParam, getCeilingPrice } = useCoopState();
  const { liveBalance, liveTotalBalance, liveLiquidBalance } =
    useLiveUserBalances(user);

  const coopDivisor = 10 ** coopDecimals;
  const gbyteDivisor = 10 ** gbyteDecimals;

  const bytesReducer = getParam("bytes_reducer");
  const ceilingPrice = getCeilingPrice();
  const gbyteShare = formatRounded(bytesReducer * 100, 2);
  const ceilingPriceFormatted =
    ceilingPrice !== undefined ? formatRounded(ceilingPrice, 4) : null;

  const totalBalanceRaw = liveTotalBalance / coopDivisor;
  const coopBalanceRaw = liveBalance / coopDivisor;
  const gbyteBalanceRaw = user.bytes_balance / gbyteDivisor;
  const liquidBalanceRaw = liveLiquidBalance / coopDivisor;
  const hasDetails = user.balance > 0 || user.bytes_balance > 0;

  return (
    <Card>
      <CardContent>
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="flex items-center gap-1.5">
            {m.profile_balance_title()}
            {ceilingPriceFormatted !== null && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="size-3.5 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    {m.profile_balance_title_tooltip({
                      coopSymbol,
                      gbyteSymbol,
                      gbyteShare,
                      ceilingPrice: ceilingPriceFormatted,
                    })}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </CardTitle>
          {action}
        </div>
        <Collapsible
          open={hasDetails && !collapsed}
          onOpenChange={() => hasDetails && setCollapsed(!collapsed)}
        >
          <CollapsibleTrigger asChild className="mt-2 text-lg lg:text-xl">
            <div className={cn(hasDetails ? "cursor-pointer select-none" : "")}>
              <Amount
                value={totalBalanceRaw}
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

            <div className="flex justify-between">
              <span className="text-muted-foreground">
                {m.profile_coop_balance()}
              </span>
              <span>
                <Amount
                  value={coopBalanceRaw}
                  decimals={coopDecimals}
                  symbol={coopSymbol}
                />{" "}
                {coopSymbol}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-muted-foreground">
                {m.profile_gbyte_balance()}
              </span>
              <span>
                <Amount
                  value={gbyteBalanceRaw}
                  decimals={gbyteDecimals}
                  symbol={gbyteSymbol}
                />{" "}
                {gbyteSymbol}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-muted-foreground">
                {m.profile_liquid_balance()}
              </span>
              <span>
                <Amount
                  value={liquidBalanceRaw}
                  decimals={coopDecimals}
                  symbol={coopSymbol}
                />{" "}
                {coopSymbol}
              </span>
            </div>
          </CollapsibleContent>
        </Collapsible>

        <div className="mt-3 text-sm">
          {withdrawAction ?? (
            <span className="text-muted-foreground">
              {m.profile_unlock_date()}:{" "}
              <span className="text-foreground">
                {user.total_balance === 0
                  ? m.profile_not_locked_yet()
                  : user.unlock_date
                    ? formatDateShort(new Date(user.unlock_date))
                    : m.profile_unlocked()}
              </span>
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
