import { useRef, useState } from "react";

import { DetailRow } from "#/shared/ui/detail-row";
import { Slider } from "#/shared/ui/slider";
import { Label } from "#/shared/ui/label";
import { Separator } from "#/shared/ui/separator";
import { QRButton } from "#/shared/ui/qr-button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "#/shared/ui/tooltip";

import { toLocalString } from "#/shared/lib/toLocalString";
import { formatRounded } from "#/shared/lib/formatRounded";
import { formatDateShort } from "#/shared/lib/formatDateShort";
import type { CoopUser } from "#/entities/coop";
import { useCoopState, useLiveUserBalances } from "#/entities/coop";
import { useAssetInfo } from "#/entities/token";
import { useWallet } from "#/entities/user";

import { buildClaimRewardsLink } from "../lib/buildClaimRewardsLink";
import { computeClaimSplit } from "../lib/computeClaimSplit";
import { getRestakeUnlockDate } from "../lib/getRestakeUnlockDate";

import * as m from "#/paraglide/messages";

interface ClaimRewardsFormProps {
  user: CoopUser;
}

export function ClaimRewardsForm({ user }: ClaimRewardsFormProps) {
  const qrButtonRef = useRef<HTMLButtonElement>(null);
  const { address } = useWallet();
  const { constants } = useCoopState();
  const { coopDecimals, coopSymbol } = useAssetInfo(constants?.asset);

  const [restakePercent, setRestakePercent] = useState(0);

  const { liveLiquidBalance: liquidAtomic } = useLiveUserBalances(user);

  if (liquidAtomic <= 0) {
    return (
      <p className="py-4 text-center text-sm text-muted-foreground">
        {m.claim_rewards_no_rewards()}
      </p>
    );
  }

  const liquid = liquidAtomic / 10 ** coopDecimals;
  const { claimedAtomic, restakedAtomic } = computeClaimSplit(
    liquidAtomic,
    restakePercent,
  );
  const claimed = claimedAtomic / 10 ** coopDecimals;
  const restaked = restakedAtomic / 10 ** coopDecimals;

  const newUnlockDate = getRestakeUnlockDate(user.unlock_date, restakePercent);

  const href = buildClaimRewardsLink({
    restakePercent,
    fromAddress: address ?? undefined,
  });

  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-2 text-sm">
        <DetailRow label={m.claim_rewards_available()}>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="font-medium text-foreground">
                  {formatRounded(liquid, coopDecimals)} {coopSymbol}
                </span>
              </TooltipTrigger>
              <TooltipContent>
                {toLocalString(liquid)} {coopSymbol}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </DetailRow>
      </div>

      <Separator />

      <div className="grid gap-3">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between sm:gap-x-4">
          <Label htmlFor="claim-rewards-restake-slider">
            {m.claim_rewards_lock_instead()}
          </Label>
          <span className="font-mono text-sm font-medium tabular-nums text-foreground">
            {restakePercent}%
          </span>
        </div>
        <Slider
          id="claim-rewards-restake-slider"
          value={[restakePercent]}
          onValueChange={([v = 0]) => setRestakePercent(v)}
          min={0}
          max={100}
          step={1}
        />
      </div>

      <div className="grid gap-2 text-sm">
        {restakePercent < 100 && (
          <DetailRow label={m.claim_rewards_will_receive()}>
            <span className="font-medium text-foreground">
              {formatRounded(claimed, coopDecimals)} {coopSymbol}
            </span>
          </DetailRow>
        )}
        {restakePercent > 0 && (
          <DetailRow label={m.claim_rewards_will_lock()}>
            <span className="font-medium text-foreground">
              {formatRounded(restaked, coopDecimals)} {coopSymbol}
            </span>
          </DetailRow>
        )}
        {newUnlockDate && (
          <DetailRow label={m.claim_rewards_new_unlock_date()}>
            <span className="font-medium text-foreground">
              {formatDateShort(newUnlockDate)}
            </span>
          </DetailRow>
        )}
      </div>

      <QRButton
        ref={qrButtonRef}
        href={href ?? ""}
        size="lg"
        className="w-full"
        disabled={!href}
      >
        {restakePercent === 0
          ? m.claim_rewards_submit_claim()
          : restakePercent === 100
            ? m.claim_rewards_submit_lock()
            : m.claim_rewards_submit_claim_and_lock()}
      </QRButton>
    </div>
  );
}
