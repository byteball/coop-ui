import type { FC } from "react";
import { ChevronDown } from "lucide-react";

import { CollapsibleTrigger } from "#/shared/ui/collapsible";
import { Amount } from "#/shared/ui/amount";
import { cn } from "#/shared/lib/utils";

interface CollapsibleAmountHeaderProps {
  value: number;
  decimals: number;
  symbol: string;
  hasDetails: boolean;
  collapsed: boolean;
}

/**
 * Total-amount header row of the balance/rewards cards. Must be rendered
 * inside a Collapsible; toggles it when there are details to show.
 */
export const CollapsibleAmountHeader: FC<CollapsibleAmountHeaderProps> = ({
  value,
  decimals,
  symbol,
  hasDetails,
  collapsed,
}) => (
  <CollapsibleTrigger asChild className="mt-2 text-base sm:text-lg lg:text-xl">
    <div
      className={cn(
        "flex flex-wrap items-center gap-1.5",
        hasDetails && "cursor-pointer select-none",
      )}
    >
      <Amount value={value} decimals={decimals} symbol={symbol} />
      <small>{symbol}</small>
      {hasDetails && (
        <ChevronDown
          className={cn(
            "shrink-0 transition-transform duration-200",
            collapsed ? "rotate-0" : "-rotate-180",
          )}
          size={24}
        />
      )}
    </div>
  </CollapsibleTrigger>
);
