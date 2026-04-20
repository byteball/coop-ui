import type { ReactElement } from "react";
import * as m from "#/paraglide/messages";

import {
  Popover,
  PopoverArrow,
  PopoverContent,
  PopoverTrigger,
} from "./popover";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./tooltip";

interface WalletProtocolPopoverProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  triggerType?: "link" | "button";
  children: ReactElement;
}

export function WalletProtocolPopover({
  open,
  onOpenChange,
  triggerType = "link",
  children,
}: WalletProtocolPopoverProps) {
  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <PopoverTrigger asChild>{children}</PopoverTrigger>
          </TooltipTrigger>
          <TooltipContent className="max-w-[250px]">
            <p>{m.wallet_popover_tooltip()}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <PopoverContent
        side="bottom"
        className="border-white bg-white text-sm text-black shadow-lg"
      >
        <PopoverArrow className="fill-white" />
        <div>
          {triggerType === "link"
            ? m.wallet_popover_opens_link()
            : m.wallet_popover_opens_button()}
        </div>
        <div>
          {m
            .wallet_popover_not_installed({ link: "[LINK]" })
            .split("[LINK]")
            .map((part, i) => (
              <span key={i}>
                {i > 0 && (
                  <a
                    href="https://obyte.org/#download"
                    target="_blank"
                    rel="noopener"
                    className="text-blue-600 underline underline-offset-4"
                  >
                    obyte.org
                  </a>
                )}
                {part}
              </span>
            ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
