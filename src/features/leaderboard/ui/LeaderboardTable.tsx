import { useMemo, useState } from "react";
import type { SortingState } from "@tanstack/react-table";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
} from "@tanstack/react-table";
import * as m from "#/paraglide/messages";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "#/shared/ui/table";
import type { LeaderboardUser } from "#/entities/coop";

import { getColumns } from "../lib/columns";

interface LeaderboardTableProps {
  users: LeaderboardUser[];
  coopDecimals: number;
  gbyteDecimals: number;
  coopSymbol: string;
  connectedAddress?: string;
}

export function LeaderboardTable({
  users,
  coopDecimals,
  gbyteDecimals,
  coopSymbol,
  connectedAddress,
}: LeaderboardTableProps) {
  const [sorting, setSorting] = useState<SortingState>([
    { id: "votes", desc: true },
  ]);

  const columns = useMemo(
    () =>
      getColumns({ coopDecimals, gbyteDecimals, coopSymbol, connectedAddress }),
    [coopDecimals, gbyteDecimals, coopSymbol, connectedAddress],
  );

  const table = useReactTable({
    data: users,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <Table>
      <TableHeader>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <TableHead key={header.id}>
                {header.isPlaceholder
                  ? null
                  : flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )}
              </TableHead>
            ))}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>
        {table.getRowModel().rows.length > 0 ? (
          table.getRowModel().rows.map((row) => (
            <TableRow
              key={row.id}
              className={
                connectedAddress === row.original.address
                  ? "bg-primary/5"
                  : undefined
              }
            >
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={columns.length} className="h-24 text-center">
              <span className="text-muted-foreground">
                {m.leaderboard_empty()}
              </span>
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
