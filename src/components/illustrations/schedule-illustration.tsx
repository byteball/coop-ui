import { TrendingUp } from "lucide-react";

export const ScheduleIllustation = () => {
  return (
    <div
      aria-hidden
      className="ring-foreground/10 bg-illustration/75 inset-shadow-sm inset-shadow-white/10 rounded-lg border border-transparent p-4 shadow-2xl shadow-black ring-1 backdrop-blur"
    >
      <div className="mb-3 flex items-center justify-between text-sm">
        <span className="font-medium">Daily Emission</span>
        <span className="flex items-center gap-1 text-xs text-emerald-400/70">
          <TrendingUp className="size-3" />
          +125.4 COOP
        </span>
      </div>
      <div className="space-y-3">
        <div>
          <div className="mb-1 flex justify-between text-xs">
            <span className="text-muted-foreground">Locked rewards (1%)</span>
            <span className="text-emerald-400/70">+112.9</span>
          </div>
          <div className="before:bg-linear-to-r before:z-1 bg-foreground/5 relative h-1.5 rounded-full before:absolute before:inset-0 before:w-[90%] before:rounded-full before:from-emerald-500/30 before:to-emerald-500/70" />
        </div>
        <div>
          <div className="mb-1 flex justify-between text-xs">
            <span className="text-muted-foreground">Liquid rewards (0.1%)</span>
            <span className="text-indigo-400/70">+12.5</span>
          </div>
          <div className="before:bg-linear-to-r before:z-1 bg-foreground/5 relative h-1.5 rounded-full before:absolute before:inset-0 before:w-[10%] before:rounded-full before:from-indigo-500/30 before:to-indigo-500/70" />
        </div>
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>50% by votes</span>
          <span>50% by votes × balance</span>
        </div>
      </div>
    </div>
  );
};
