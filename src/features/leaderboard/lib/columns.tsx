import type { ColumnDef } from "@tanstack/react-table";
import { Link } from "@tanstack/react-router";
import { ArrowDown, Info } from "lucide-react";
import * as m from "#/paraglide/messages";

import { toLocalString } from "#/shared/lib/toLocalString";
import { getVotesDivisor } from "#/entities/coop";
import { useAttestations } from "#/entities/attestation";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "#/shared/ui/tooltip";
import type { LeaderboardUser } from "#/entities/coop";

interface GetColumnsOptions {
  coopDecimals: number;
  gbyteDecimals: number;
  coopSymbol: string;
  connectedAddress?: string;
}

function AddressCell({ address, isYou }: { address: string; isYou: boolean }) {
  const { data: attestations } = useAttestations(address);
  const displayName = attestations?.displayName;

  return (
    <span className="flex items-center gap-1.5">
      <Link
        to="/user/$address"
        params={{ address }}
        className="font-medium link"
      >
        {displayName ?? (
          <span className="font-mono">
            {address.slice(0, 6)}...{address.slice(-4)}
          </span>
        )}
      </Link>
      {isYou && (
        <span className="rounded-sm bg-primary/10 px-1.5 py-0.5 text-xs font-medium text-primary">
          {m.leaderboard_you()}
        </span>
      )}
    </span>
  );
}

function SortIcon({ isSorted }: { isSorted: false | "asc" | "desc" }) {
  return (
    <ArrowDown
      className={`ml-1 inline size-4 ${isSorted === "desc" ? "" : "opacity-50"}`}
    />
  );
}

export function getColumns({
  coopDecimals,
  gbyteDecimals,
  coopSymbol,
  connectedAddress,
}: GetColumnsOptions): ColumnDef<LeaderboardUser>[] {
  const coopDivisor = 10 ** coopDecimals;
  const gbyteDivisor = 10 ** gbyteDecimals;
  const votesDivisor = getVotesDivisor(coopDecimals);

  return [
    {
      id: "rank",
      header: () => m.leaderboard_col_rank(),
      cell: ({ table, row }) => {
        const sortedIndex = table
          .getRowModel()
          .rows.findIndex((r) => r.id === row.id);
        return <span className="text-muted-foreground">{sortedIndex + 1}</span>;
      },
      enableSorting: false,
    },
    {
      id: "address",
      accessorKey: "address",
      header: () => m.leaderboard_col_address(),
      cell: ({ row }) => (
        <AddressCell
          address={row.original.address}
          isYou={connectedAddress === row.original.address}
        />
      ),
      enableSorting: false,
    },
    {
      id: "total_balance",
      accessorKey: "total_balance",
      header: ({ column }) => (
        <button
          className="flex cursor-pointer items-center"
          onClick={() => {
            if (column.getIsSorted() !== "desc") column.toggleSorting(true);
          }}
        >
          {m.leaderboard_col_balance()}
          <TooltipProvider>
            <Tooltip>
              {/* The icon explains the column; its clicks must not reach the
                  sort button, or reading the tooltip re-sorts the table. */}
              <TooltipTrigger
                asChild
                onClick={(event) => event.stopPropagation()}
              >
                <Info className="ml-1 inline size-3.5 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent>
                <p>{m.leaderboard_balance_tooltip()}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <SortIcon isSorted={column.getIsSorted()} />
        </button>
      ),
      cell: ({ row }) => {
        const { balance, bytes_balance, total_balance } = row.original;

        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger className="cursor-default border-b border-dashed border-muted-foreground pb-0.5">
                {toLocalString(total_balance / coopDivisor)} {coopSymbol}
              </TooltipTrigger>
              <TooltipContent>
                <p>
                  {toLocalString(balance / coopDivisor)} {coopSymbol} +{" "}
                  {toLocalString(bytes_balance / gbyteDivisor)} GBYTE
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      },
    },
    {
      id: "votes",
      accessorKey: "votes",
      header: ({ column }) => (
        <button
          className="flex cursor-pointer items-center"
          onClick={() => {
            if (column.getIsSorted() !== "desc") column.toggleSorting(true);
          }}
        >
          {m.leaderboard_col_votes()}
          <SortIcon isSorted={column.getIsSorted()} />
        </button>
      ),
      cell: ({ row }) => (
        <span>{toLocalString(row.original.votes / votesDivisor)}</span>
      ),
    },
  ];
}
