import { useState } from "react";
import obyte from "obyte";

import { Button } from "#/shared/ui/button";
import { Input } from "#/shared/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "#/shared/ui/dialog";
import { setWalletAddress } from "#/entities/user";
import * as m from "#/paraglide/messages";

export function ConnectWalletDialog({
  children,
}: {
  children?: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = () => {
    const trimmed = value.trim();
    if (!trimmed) {
      setError(m.wallet_error_empty());
      return;
    }
    if (!obyte.utils.isValidAddress(trimmed)) {
      setError(m.wallet_error_invalid());
      return;
    }
    setWalletAddress(trimmed);
    setOpen(false);
    setValue("");
    setError(null);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        setOpen(v);
        if (!v) {
          setValue("");
          setError(null);
        }
      }}
    >
      <DialogTrigger asChild>
        {children ?? (
          <Button variant="outline" size="sm">
            {m.wallet_add()}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{m.wallet_add()}</DialogTitle>
          <DialogDescription
            dangerouslySetInnerHTML={{
              __html: m.wallet_description({
                link: `<a href="https://obyte.org/#download" target="_blank" rel="noopener" class="font-medium text-foreground underline underline-offset-4 hover:text-muted-foreground">${m.wallet_link_text()}</a>`,
              }),
            }}
          />
        </DialogHeader>
        <div
          className="flex flex-col gap-2"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleSubmit();
            }
          }}
        >
          <Input
            placeholder={m.wallet_placeholder()}
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              if (error) setError(null);
            }}
            aria-invalid={!!error || undefined}
          />
          {error && (
            <p className="text-sm text-destructive-foreground">{error}</p>
          )}
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit}>{m.wallet_connect()}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
