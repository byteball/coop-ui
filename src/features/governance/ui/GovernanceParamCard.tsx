import { useState } from "react";
import { Info } from "lucide-react";
import * as m from "#/paraglide/messages";

import { formatParamName, getParamDescription } from "#/entities/governance";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "#/shared/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "#/shared/ui/tooltip";
import { QRButton } from "#/shared/ui/qr-button";

import { toLocalString } from "#/shared/lib/toLocalString";
import { getVotesDivisor } from "#/entities/coop";
import type { ParsedGovernanceParam } from "#/entities/governance";

import { buildCommitLink, buildRemoveVoteLink } from "../lib/buildGovernanceLink";
import { Countdown } from "./Countdown";
import { GovernanceVoteDialog } from "./GovernanceVoteDialog";
import { ParamValue } from "./ParamValue";
import { SupportVotersDialog } from "./SupportVotersDialog";

interface GovernanceParamCardProps {
  param: ParsedGovernanceParam;
  governanceAa: string;
  address: string | null;
  coopDecimals: number;
  coopSymbol: string;
}

export function GovernanceParamCard({
  param,
  governanceAa,
  address,
  coopDecimals,
  coopSymbol,
}: GovernanceParamCardProps) {
  const {
    def,
    currentValue,
    leader,
    challengingPeriodEndTs,
    supports,
    userChoice,
  } = param;

  const votesDivisor = getVotesDivisor(coopDecimals);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogInitialValue, setDialogInitialValue] = useState<
    string | number | undefined
  >(undefined);

  const [supportDialogOpen, setSupportDialogOpen] = useState(false);
  const [supportDialogValueKey, setSupportDialogValueKey] = useState<
    string | null
  >(null);

  const openDialog = (initialValue?: string | number) => {
    setDialogInitialValue(initialValue);
    setDialogOpen(true);
  };

  const openSupportDialog = (valueKey: string) => {
    setSupportDialogValueKey(valueKey);
    setSupportDialogOpen(true);
  };

  const hasLeader = leader !== undefined;
  const leaderDiffers = hasLeader && String(leader) !== String(currentValue);

  const now = Math.floor(Date.now() / 1000);
  const challengeExpired =
    challengingPeriodEndTs !== undefined && now >= challengingPeriodEndTs;

  const commitHref =
    leaderDiffers && challengeExpired && address
      ? buildCommitLink({
          governanceAa,
          name: def.name,
          fromAddress: address,
        })
      : null;

  const removeVoteHref =
    userChoice !== undefined && address
      ? buildRemoveVoteLink({
          governanceAa,
          name: def.name,
          fromAddress: address,
        })
      : null;

  return (
    <>
      <Card className="flex flex-col">
        <CardHeader className="pb-3">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 items-center gap-1.5">
              <CardTitle className="text-xl break-words">
                {formatParamName(def.name)}
              </CardTitle>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="size-3.5 shrink-0 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <p className="text-xs">{getParamDescription(def.name)}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <span className="text-sm">
              <span className="text-muted-foreground">
                {m.governance_param_current_value()}{" "}
              </span>
              <span className="font-medium">
                <ParamValue
                  value={currentValue}
                  def={def}
                  coopDecimals={coopDecimals}
                  coopSymbol={coopSymbol}
                />
              </span>
            </span>
          </div>
        </CardHeader>

        <CardContent className="flex-1 space-y-3 pb-3">
          {userChoice !== undefined && (
            <div className="flex items-center justify-between gap-2 text-sm">
              <span className="text-muted-foreground">
                {m.governance_param_your_vote()}
              </span>
              <span className="flex items-center gap-1.5">
                <span className="font-medium">
                  <ParamValue
                    value={userChoice}
                    def={def}
                    coopDecimals={coopDecimals}
                    coopSymbol={coopSymbol}
                  />
                </span>
                {removeVoteHref && (
                  <QRButton
                    href={removeVoteHref}
                    size="xs"
                    variant="link"
                  >
                    {m.governance_param_remove_vote()}
                  </QRButton>
                )}
              </span>
            </div>
          )}

          {hasLeader && (
            <div className="rounded-md bg-muted/50 p-2.5 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">
                  {m.governance_param_leader()}
                </span>
                <span className="font-medium">
                  <ParamValue
                    value={leader}
                    def={def}
                    coopDecimals={coopDecimals}
                    coopSymbol={coopSymbol}
                  />
                </span>
              </div>
              {leaderDiffers && (
                <div className="mt-1 flex items-center justify-between">
                  {challengeExpired ? (
                    <>
                      <span className="text-xs text-muted-foreground">
                        {m.governance_param_ready_to_commit()}
                      </span>
                      <QRButton
                        href={commitHref ?? ""}
                        disabled={!commitHref}
                        size="xs"
                        variant="link"
                      >
                        {m.governance_param_commit()}
                      </QRButton>
                    </>
                  ) : (
                    challengingPeriodEndTs && (
                      <>
                        <span className="text-xs text-muted-foreground">
                          {m.governance_param_challenge_ends_in()}
                        </span>
                        <span className="text-xs font-medium">
                          <Countdown endTs={challengingPeriodEndTs} />
                        </span>
                      </>
                    )
                  )}
                </div>
              )}
            </div>
          )}

          {supports.length > 0 && (
            <div className="overflow-hidden rounded-lg border border-border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-xs text-muted-foreground">
                    <th className="border-b border-border px-2 py-2 text-left font-medium sm:px-3">
                      {m.governance_param_col_value()}
                    </th>
                    <th className="border-b border-border px-2 py-2 text-right font-medium sm:px-3">
                      {m.governance_param_col_support()}
                    </th>
                    <th className="border-b border-border px-2 py-2 text-right font-medium sm:px-3" />
                  </tr>
                </thead>
                <tbody>
                  {supports.map((s, i) => (
                    <tr
                      key={s.valueKey}
                      className={i > 0 ? "border-t border-border" : ""}
                    >
                      <td className="max-w-[40%] truncate px-2 py-2 font-mono text-xs sm:px-3">
                        <ParamValue
                          value={s.valueKey}
                          def={def}
                          coopDecimals={coopDecimals}
                          coopSymbol={coopSymbol}
                        />
                      </td>
                      <td className="px-2 py-2 text-right text-xs sm:px-3">
                        <button
                          onClick={() => openSupportDialog(s.valueKey)}
                          className="cursor-pointer link"
                        >
                          {toLocalString(s.support / votesDivisor)}
                        </button>
                      </td>
                      <td className="px-2 py-2 text-right sm:px-3">
                        <button
                          onClick={() => openDialog(s.valueKey)}
                          disabled={!address}
                          className="cursor-pointer text-xs font-medium link disabled:pointer-events-none disabled:opacity-50"
                        >
                          {m.governance_param_vote_for_value()}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>

        <CardFooter className="pt-0">
          <button
            onClick={() => openDialog()}
            disabled={!address}
            className="cursor-pointer text-sm font-medium link disabled:pointer-events-none disabled:opacity-50"
          >
            {m.governance_param_suggest_value()}
          </button>
        </CardFooter>
      </Card>

      <GovernanceVoteDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        initialValue={dialogInitialValue}
        param={param}
        governanceAa={governanceAa}
        address={address}
        coopDecimals={coopDecimals}
        coopSymbol={coopSymbol}
      />

      <SupportVotersDialog
        open={supportDialogOpen}
        onOpenChange={setSupportDialogOpen}
        param={param}
        valueKey={supportDialogValueKey}
        coopDecimals={coopDecimals}
        coopSymbol={coopSymbol}
      />
    </>
  );
}
