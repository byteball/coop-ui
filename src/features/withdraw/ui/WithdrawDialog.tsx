import type { ReactNode } from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "#/shared/ui/dialog";

import type { CoopUser } from "#/entities/coop";

import { WithdrawForm } from "./WithdrawForm";

import * as m from "#/paraglide/messages";

interface WithdrawDialogProps {
  user: CoopUser;
  children?: ReactNode;
}

export function WithdrawDialog({ user, children }: WithdrawDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{m.withdraw_dialog_title()}</DialogTitle>
        </DialogHeader>
        <WithdrawForm user={user} />
      </DialogContent>
    </Dialog>
  );
}
