import type { FC } from "react";

import { obyteServiceUrls } from "#/shared/config/appConfig";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "#/shared/ui/tooltip";

import * as m from "#/paraglide/messages";

interface ObyteServiceLinksProps {
  address: string;
  displayName: string;
}

export const ObyteServiceLinks: FC<ObyteServiceLinksProps> = ({
  address,
  displayName,
}) => {
  return (
    <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <a
              href={obyteServiceUrls.city(address)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-x-2 font-medium text-foreground underline-offset-4 transition-opacity hover:underline hover:opacity-80"
            >
              <img src="/city-logo.svg" alt="" className="size-4" />
              <span>{m.profile_badge_city()}</span>
            </a>
          </TooltipTrigger>
          <TooltipContent>
            {m.profile_city_tooltip({ name: displayName })}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <a
              href={obyteServiceUrls.friends(address)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-x-2 font-medium text-foreground underline-offset-4 transition-opacity hover:underline hover:opacity-80"
            >
              <img src="/friends-logo.svg" alt="" className="size-4" />
              <span>{m.profile_badge_friends()}</span>
            </a>
          </TooltipTrigger>
          <TooltipContent>
            {m.profile_friends_tooltip({ name: displayName })}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};
