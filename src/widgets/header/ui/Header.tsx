import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";

import { Button } from "#/shared/ui/button";
import { env } from "#/shared/config/env";
import * as m from "#/paraglide/messages";

import { LocaleSwitcher } from "./LocaleSwitcher";
import { WalletArea } from "./WalletArea";

const navItems = [
  { to: "/leaderboard", label: () => m.nav_leaderboard() },
  { to: "/governance", label: () => m.nav_governance() },
  { to: "/faq", label: () => m.nav_faq() },
] as const;

const linkClass =
  "text-sm text-muted-foreground transition-colors hover:text-foreground";
const activeLinkClass = "text-sm font-medium text-foreground";

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header
      className="fixed inset-x-0 top-0 z-50"
      style={{ paddingRight: "var(--removed-body-scroll-bar-size, 0px)" }}
    >
      <div className="border-b border-border/50 bg-background/75 backdrop-blur ring-1 ring-transparent transition-all duration-300">
        <div className="mx-auto max-w-5xl px-6">
          <div className="relative flex h-14 items-center justify-between">
            <div
              aria-hidden
              className="bg-size-[4px_1px] absolute inset-x-0 bottom-0 h-px bg-[linear-gradient(90deg,var(--color-foreground)_1px,transparent_1px)] bg-repeat-x opacity-20"
            />
            <div className="flex items-center gap-8">
              <Link to="/" className="flex items-center">
                <img src="/logo.svg" alt="COOP" className="h-11" />
                {env.VITE_TESTNET && (
                  <sup className="ml-0.5 text-[10px] font-normal text-muted-foreground">
                    testnet
                  </sup>
                )}
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
                    {item.label()}
                  </Link>
                ))}
              </nav>
            </div>

            <div className="flex items-center gap-3">
              <LocaleSwitcher />
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
        </div>
      </div>

      {mobileOpen && (
        <nav className="flex flex-col gap-1 border-t border-border/50 bg-background/75 px-6 py-3 backdrop-blur md:hidden">
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
              {item.label()}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
