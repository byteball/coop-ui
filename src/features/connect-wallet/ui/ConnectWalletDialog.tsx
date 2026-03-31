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

export function ConnectWalletDialog() {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = () => {
    const trimmed = value.trim();
    if (!trimmed) {
      setError("Enter your wallet address");
      return;
    }
    if (!obyte.utils.isValidAddress(trimmed)) {
      setError("Invalid Obyte address");
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
        <Button variant="outline" size="sm">
          Add wallet
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add wallet</DialogTitle>
          <DialogDescription>
            Install{" "}
            <a
              href="https://obyte.org/#download"
              target="_blank"
              rel="noopener"
              className="font-medium text-foreground underline underline-offset-4 hover:text-muted-foreground"
            >
              Obyte wallet
            </a>{" "}
            if you don&apos;t have one yet, and copy/paste your address here.
          </DialogDescription>
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
            placeholder="Wallet address"
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
          <Button onClick={handleSubmit}>Connect</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
