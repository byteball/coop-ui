import { useState, useEffect } from "react";

import { formatPeriod } from "#/shared/lib/formatPeriod";

export function Countdown({ endTs }: { endTs: number }) {
  const [, setTick] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 60_000);
    return () => clearInterval(id);
  }, [endTs]);

  const now = Math.floor(Date.now() / 1000);
  if (now >= endTs) return <span>Expired</span>;

  return <span>{formatPeriod(endTs)}</span>;
}
