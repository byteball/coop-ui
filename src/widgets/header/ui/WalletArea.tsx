import { X } from "lucide-react";
import { Link } from "@tanstack/react-router";

import { Button } from "#/shared/ui/button";
import { useWallet, clearWalletAddress } from "#/entities/user";
import { ConnectWalletDialog } from "#/features/connect-wallet";

export function WalletArea() {
  const { address, isConnected } = useWallet();

  if (!isConnected) {
    return (
      <div className="hidden md:block">
        <ConnectWalletDialog />
      </div>
    );
  }

  return (
    <div className="hidden items-center gap-2 md:flex">
      <Link
        to="/user/$address"
        params={{ address: address! }}
        className="text-sm text-muted-foreground underline-offset-4 hover:underline"
      >
        {address!.slice(0, 6)}...{address!.slice(-6)}
      </Link>
      <Button variant="ghost" size="xs" onClick={clearWalletAddress}>
        <X className="size-3" />
      </Button>
    </div>
  );
}
