import { useEffect, useState } from "react";
import { useStore } from "@tanstack/react-store";
import * as m from "#/paraglide/messages";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "#/shared/ui/dialog";
import { ScrollArea } from "#/shared/ui/scroll-area";
import { Separator } from "#/shared/ui/separator";
import { toLocalString } from "#/shared/lib/toLocalString";
import { getVotesDivisor } from "#/entities/coop";
import { UserDisplayName } from "#/entities/attestation";
import {
  formatParamName,
  governanceStore,
  extractVoters,
} from "#/entities/governance";
import type { ParsedGovernanceParam, Voter } from "#/entities/governance";

import { formatParamValue } from "../lib/formatParamValue";

interface SupportVotersDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  param: ParsedGovernanceParam;
  valueKey: string | null;
  coopDecimals: number;
  coopSymbol: string;
}

export function SupportVotersDialog({
  open,
  onOpenChange,
  param,
  valueKey,
  coopDecimals,
  coopSymbol,
}: SupportVotersDialogProps) {
  const vars = useStore(governanceStore, (s) => s.vars);
  const [voters, setVoters] = useState<Voter[] | null>(null);

  const votesDivisor = getVotesDivisor(coopDecimals);

  useEffect(() => {
    if (!open || !valueKey) {
      setVoters(null);
      return;
    }
    let cancelled = false;
    setVoters(null);
    extractVoters(vars, param.def.name, valueKey).then((result) => {
      if (!cancelled) setVoters(result);
    });
    return () => {
      cancelled = true;
    };
  }, [open, valueKey, vars, param.def.name]);

  const rawValue =
    valueKey !== null && !valueKey.startsWith("hash_")
      ? valueKey
      : (voters?.[0]?.value ?? valueKey ?? "");

  const isLoading = voters === null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {m.governance_voters_dialog_title({
              name: formatParamName(param.def.name).toLowerCase(),
              value: formatParamValue(
                rawValue,
                param.def,
                coopDecimals,
                coopSymbol,
              ),
            })}
          </DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="py-6 text-center text-sm text-muted-foreground">
            {m.governance_voters_loading()}
          </div>
        ) : voters.length === 0 ? (
          <div className="py-6 text-center text-sm text-muted-foreground">
            {m.governance_voters_empty()}
          </div>
        ) : (
          <ScrollArea className="max-h-72">
            <div className="grid gap-2 pr-3">
              {voters.map((v, i) => (
                <div key={v.address}>
                  {i > 0 && <Separator className="mb-2" />}
                  <div className="flex flex-col text-sm">
                    <UserDisplayName address={v.address} />
                    <span className="text-xs text-muted-foreground">
                      {toLocalString(v.sqrtBalance / votesDivisor)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </DialogContent>
    </Dialog>
  );
}
