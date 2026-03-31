import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";

import { Button } from "#/shared/ui/button";
import { env } from "#/app/env";
import { useWallet, clearWalletAddress } from "#/entities/user";
import { ConnectWalletDialog } from "#/features/connect-wallet";
import { getLocale, setLocale, locales } from "#/shared/i18n";
import * as m from "#/paraglide/messages";

const localeFlags: Record<string, string> = {
  en: "\u{1F1EC}\u{1F1E7}",
  zh: "\u{1F1E8}\u{1F1F3}",
  es: "\u{1F1EA}\u{1F1F8}",
  ru: "\u{1F1F7}\u{1F1FA}",
  uk: "\u{1F1FA}\u{1F1E6}",
};

const localeNames: Record<string, string> = {
  en: "English",
  zh: "中文",
  es: "Español",
  ru: "Русский",
  uk: "Українська",
};

const navItems = [
  { to: "/leaderboard", label: () => m.nav_leaderboard() },
  { to: "/governance", label: () => m.nav_governance() },
  { to: "/faq", label: () => m.nav_faq() },
] as const;

const linkClass =
  "text-sm text-muted-foreground transition-colors hover:text-foreground";
const activeLinkClass = "text-sm font-medium text-foreground";

function LocaleSwitcher() {
  const [open, setOpen] = useState(false);
  const current = getLocale();

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        className="gap-1.5 text-xs text-muted-foreground"
        onClick={() => setOpen((v) => !v)}
      >
        <span className="text-base leading-none">{localeFlags[current]}</span>
      </Button>
      {open && (
        <div className="absolute right-0 top-full mt-1 z-50 min-w-32 rounded-md border border-border/50 bg-background/90 p-1 shadow-lg backdrop-blur">
          {locales.map((locale) => (
            <button
              key={locale}
              onClick={() => {
                setLocale(locale);
                setOpen(false);
              }}
              className={`flex w-full items-center gap-2 rounded px-3 py-1.5 text-left text-xs transition-colors hover:bg-foreground/10 ${
                locale === current
                  ? "text-foreground font-medium"
                  : "text-muted-foreground"
              }`}
            >
              <span className="text-base leading-none">
                {localeFlags[locale]}
              </span>
              {localeNames[locale]}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

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
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="border-b border-border/50 bg-background/75 backdrop-blur ring-1 ring-transparent transition-all duration-300">
        <div className="mx-auto max-w-5xl px-6">
          <div className="relative flex h-14 items-center justify-between">
            <div
              aria-hidden
              className="bg-size-[4px_1px] absolute inset-x-0 bottom-0 h-px bg-[linear-gradient(90deg,var(--color-foreground)_1px,transparent_1px)] bg-repeat-x opacity-20"
            />
            <div className="flex items-center gap-8">
              <Link to="/" className="text-lg font-bold">
                COOP
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
