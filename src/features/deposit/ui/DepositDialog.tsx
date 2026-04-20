import type { ReactNode } from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "#/shared/ui/dialog";

import { DepositForm } from "./DepositForm";

import * as m from "#/paraglide/messages";

export function DepositDialog({ children }: { children?: ReactNode }) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{m.deposit_dialog_title()}</DialogTitle>
        </DialogHeader>
        <DepositForm />
      </DialogContent>
    </Dialog>
  );
}
