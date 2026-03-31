import { Lock, Unlock } from "lucide-react";

export const KitIllustration = () => {
  return (
    <div
      aria-hidden
      className="ring-foreground/10 bg-illustration/75 inset-shadow-sm inset-shadow-white/10 rounded-lg border border-transparent p-4 shadow-2xl shadow-black ring-1 backdrop-blur"
    >
      <div className="mb-3 flex items-center justify-between text-sm">
        <span className="font-medium">Locked Balance</span>
        <span className="text-emerald-400/70 font-medium">12,500 COOP</span>
      </div>
      <div className="space-y-2.5">
        <div className="flex items-center gap-2 text-xs">
          <Lock className="size-3 text-muted-foreground" />
          <span className="text-muted-foreground">Mar 31, 2026</span>
          <span className="text-muted-foreground mx-1">→</span>
          <Unlock className="size-3 text-muted-foreground" />
          <span className="text-muted-foreground">Mar 31, 2027</span>
        </div>
        <div>
          <div className="mb-1 flex justify-between text-xs">
            <span className="text-muted-foreground">Lock period</span>
            <span className="text-foreground">25%</span>
          </div>
          <div className="before:bg-linear-to-r before:z-1 bg-foreground/5 relative h-1.5 rounded-full before:absolute before:inset-0 before:w-1/4 before:rounded-full before:from-emerald-500/30 before:to-emerald-500/70" />
        </div>
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>+ 0.8 GB locked</span>
          <span>Vote weight: 111.8</span>
        </div>
      </div>
    </div>
  );
};
