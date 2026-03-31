import { Vote, Clock, Check } from "lucide-react";

export const ReplyIllustration = () => {
  return (
    <div
      aria-hidden
      className="ring-foreground/10 bg-illustration/75 inset-shadow-sm inset-shadow-white/10 rounded-lg border border-transparent p-4 shadow-2xl shadow-black ring-1 backdrop-blur"
    >
      <div className="mb-3 flex items-center justify-between gap-2 text-sm">
        <span className="font-medium text-indigo-400 truncate">
          liquid_reward
        </span>
        <span className="shrink-0 rounded bg-amber-900/25 px-1.5 py-0.5 text-[10px] text-amber-300">
          challenging
        </span>
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Check className="size-3 text-emerald-400" /> Current
          </span>
          <span className="text-foreground">0.001</span>
        </div>
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Vote className="size-3 text-indigo-400" /> Leader
          </span>
          <span className="text-foreground">0.0015</span>
        </div>
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Clock className="size-3 text-amber-400" /> Commit in
          </span>
          <span className="text-foreground">2d 14h</span>
        </div>
      </div>
    </div>
  );
};
