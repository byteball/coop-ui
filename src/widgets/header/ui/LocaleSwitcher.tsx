import { useState } from "react";

import { Button } from "#/shared/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "#/shared/ui/popover";
import { getLocale, setLocale, locales } from "#/shared/i18n";

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

export function LocaleSwitcher() {
  const [open, setOpen] = useState(false);
  const current = getLocale();

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="gap-1.5 text-xs text-muted-foreground"
        >
          <span className="text-base leading-none">{localeFlags[current]}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        sideOffset={4}
        className="min-w-32 w-auto rounded-md border border-border/50 bg-background/90 p-1 shadow-lg backdrop-blur"
      >
        {locales.map((locale) => (
          <button
            key={locale}
            onClick={() => {
              setLocale(locale);
              setOpen(false);
            }}
            className={`flex w-full cursor-pointer items-center gap-2 rounded px-3 py-1.5 text-left text-xs transition-colors hover:bg-foreground/10 ${
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
      </PopoverContent>
    </Popover>
  );
}
