import { X } from "lucide-react";
import { Link } from "@tanstack/react-router";

import { Button } from "#/shared/ui/button";
import { useWallet, clearWalletAddress } from "#/entities/user";
import { ConnectWalletDialog } from "#/features/connect-wallet";

import * as m from "#/paraglide/messages";

interface WalletMobileMenuItemProps {
  onClose: () => void;
}

export function WalletMobileMenuItem({ onClose }: WalletMobileMenuItemProps) {
  const { address, isConnected } = useWallet();

  if (!isConnected) {
    return (
      <div className="mt-2 border-t border-border/50 pt-3">
        <ConnectWalletDialog>
          <button
            type="button"
            className="w-full cursor-pointer py-2 text-left text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            {m.wallet_add()}
          </button>
        </ConnectWalletDialog>
      </div>
    );
  }

  return (
    <div className="mt-2 flex items-center justify-between gap-2 border-t border-border/50 pt-3">
      <Link
        to="/user/$address"
        params={{ address: address! }}
        onClick={onClose}
        className="font-mono text-sm text-muted-foreground hover:text-foreground"
      >
        {address!.slice(0, 6)}...{address!.slice(-6)}
      </Link>
      <Button
        variant="ghost"
        size="xs"
        onClick={() => {
          clearWalletAddress();
          onClose();
        }}
      >
        <X className="size-3" />
      </Button>
    </div>
  );
}
