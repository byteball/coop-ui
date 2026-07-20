import type { FC, ReactNode } from "react";

import { cn } from "#/shared/lib/utils";

interface DetailRowProps {
  label: ReactNode;
  children: ReactNode;
  className?: string;
}

/**
 * Label/value row for card detail lists: stacked and left-aligned on
 * mobile, a single spaced-apart row from `sm` up.
 */
export const DetailRow: FC<DetailRowProps> = ({
  label,
  children,
  className,
}) => (
  <div
    className={cn(
      "flex flex-col sm:flex-row sm:justify-between sm:gap-x-4",
      className,
    )}
  >
    <span className="text-muted-foreground">{label}</span>
    {children}
  </div>
);
