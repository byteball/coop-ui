import type { ReactNode } from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "#/shared/ui/dialog";

import type { CoopUser } from "#/entities/coop";

import { ClaimRewardsForm } from "./ClaimRewardsForm";

import * as m from "#/paraglide/messages";

interface ClaimRewardsDialogProps {
  user: CoopUser;
  children?: ReactNode;
}

export function ClaimRewardsDialog({ user, children }: ClaimRewardsDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{m.claim_rewards_dialog_title()}</DialogTitle>
        </DialogHeader>
        <ClaimRewardsForm user={user} />
      </DialogContent>
    </Dialog>
  );
}
