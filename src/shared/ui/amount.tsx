import type { FC } from "react";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "#/shared/ui/tooltip";

import { toLocalString } from "#/shared/lib/toLocalString";
import { formatRounded } from "#/shared/lib/formatRounded";

interface AmountProps {
  value: number;
  decimals: number;
  symbol: string;
}

export const Amount: FC<AmountProps> = ({ value, decimals, symbol }) => {
  const rounded = formatRounded(value, decimals);
  const exact = toLocalString(value);

  if (rounded === exact) {
    return <span>{rounded}</span>;
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span>{rounded}</span>
        </TooltipTrigger>
        <TooltipContent>
          {exact} {symbol}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
