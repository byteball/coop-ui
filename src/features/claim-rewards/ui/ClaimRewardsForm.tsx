import { useRef, useState } from "react";

import { Switch } from "#/shared/ui/switch";
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
import { getNewUnlockDate } from "#/shared/lib/getNewUnlockDate";

import type { CoopUser } from "#/entities/coop";
import { useCoopState } from "#/entities/coop";
import { useAssetInfo } from "#/entities/token";

import { buildClaimRewardsLink } from "../lib/buildClaimRewardsLink";

import * as m from "#/paraglide/messages";

interface ClaimRewardsFormProps {
  user: CoopUser;
}

export function ClaimRewardsForm({ user }: ClaimRewardsFormProps) {
  const qrButtonRef = useRef<HTMLButtonElement>(null);
  const { constants } = useCoopState();
  const { coopDecimals, coopSymbol } = useAssetInfo(constants?.asset);

  const [restake, setRestake] = useState(false);

  const liquidAtomic = user.liquid_balance ?? 0;
  const liquid = liquidAtomic / 10 ** coopDecimals;

  if (liquidAtomic <= 0) {
    return (
      <p className="py-4 text-center text-sm text-muted-foreground">
        {m.claim_rewards_no_rewards()}
      </p>
    );
  }

  const newUnlockDate = restake
    ? getNewUnlockDate(user.unlock_date)
    : null;

  const href = buildClaimRewardsLink({ restakePercent: restake ? 100 : 0 });

  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-2 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">
            {m.claim_rewards_available()}
          </span>
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
        </div>
        {user.unlock_date && (
          <div className="flex justify-between">
            <span className="text-muted-foreground">
              {m.claim_rewards_current_unlock_date()}
            </span>
            <span className="font-medium text-foreground">
              {formatDateShort(new Date(user.unlock_date))}
            </span>
          </div>
        )}
      </div>

      <Separator />

      <div className="flex items-start gap-3">
        <Switch
          id="claim-rewards-restake"
          checked={restake}
          onCheckedChange={setRestake}
          className="mt-0.5"
        />
        <div className="grid gap-1">
          <Label htmlFor="claim-rewards-restake" className="cursor-pointer">
            {m.claim_rewards_lock_instead()}
          </Label>
          <span className="text-xs text-muted-foreground">
            {m.claim_rewards_lock_instead_hint()}
          </span>
        </div>
      </div>

      <div className="grid gap-2 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">
            {restake
              ? m.claim_rewards_will_lock()
              : m.claim_rewards_will_receive()}
          </span>
          <span className="font-medium text-foreground">
            {formatRounded(liquid, coopDecimals)} {coopSymbol}
          </span>
        </div>
        {restake && newUnlockDate && (
          <div className="flex justify-between">
            <span className="text-muted-foreground">
              {m.claim_rewards_new_unlock_date()}
            </span>
            <span className="font-medium text-foreground">
              {formatDateShort(newUnlockDate)}
            </span>
          </div>
        )}
      </div>

      <QRButton
        ref={qrButtonRef}
        href={href ?? ""}
        size="lg"
        className="w-full"
        disabled={!href}
      >
        {restake
          ? m.claim_rewards_submit_lock()
          : m.claim_rewards_submit_claim()}
      </QRButton>
    </div>
  );
}
