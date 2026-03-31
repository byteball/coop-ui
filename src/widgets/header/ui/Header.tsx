import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";

import { Button } from "#/shared/ui/button";
import { useWallet, clearWalletAddress } from "#/entities/user";
import { ConnectWalletDialog } from "#/features/connect-wallet";

const navItems = [
  { to: "/leaderboard", label: "Leaderboard" },
  { to: "/governance", label: "Governance" },
  { to: "/faq", label: "F.A.Q." },
] as const;

const linkClass =
  "text-sm text-muted-foreground transition-colors hover:text-foreground";
const activeLinkClass = "text-sm font-medium text-foreground";

function WalletArea() {
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

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b bg-background">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
        <div className="flex items-center gap-8">
          <Link to="/" className="text-lg font-bold">
            COOP
          </Link>

          <nav className="hidden items-center gap-6 md:flex">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                activeOptions={{ exact: "exact" in item }}
                activeProps={{ className: activeLinkClass }}
                inactiveProps={{ className: linkClass }}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <WalletArea />
          <Button
            variant="ghost"
            size="icon-sm"
            className="md:hidden"
            onClick={() => setMobileOpen((v) => !v)}
          >
            {mobileOpen ? (
              <X className="size-4" />
            ) : (
              <Menu className="size-4" />
            )}
          </Button>
        </div>
      </div>

      {mobileOpen && (
        <nav className="flex flex-col gap-1 border-t px-4 py-3 md:hidden">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeOptions={{ exact: "exact" in item }}
              activeProps={{ className: activeLinkClass }}
              inactiveProps={{ className: linkClass }}
              onClick={() => setMobileOpen(false)}
              className="py-2"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
