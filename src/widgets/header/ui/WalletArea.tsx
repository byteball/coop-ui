import { X } from "lucide-react";

import { Button } from "#/shared/ui/button";
import { useWallet, clearWalletAddress } from "#/entities/user";
import { ConnectWalletDialog } from "#/features/connect-wallet";

export function WalletArea() {
  const { address, isConnected } = useWallet();

  if (!isConnected) {
    return <ConnectWalletDialog />;
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted-foreground">
        {address!.slice(0, 6)}...{address!.slice(-6)}
      </span>
      <Button variant="ghost" size="xs" onClick={clearWalletAddress}>
        <X className="size-3" />
      </Button>
    </div>
  );
}
