export const VisualizationIllustration = () => {
  return (
    <div aria-hidden>
      <div className="ring-foreground/10 bg-illustration/75 inset-shadow-sm inset-shadow-white/10 rounded-tl-lg border border-transparent p-4 shadow-2xl shadow-black ring-1 backdrop-blur">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-sm font-medium">Votes Received</span>
          <span className="text-muted-foreground text-xs">this month</span>
        </div>
        <div className="space-y-2.5">
          <div>
            <div className="mb-1 flex justify-between text-xs">
              <span className="text-muted-foreground">Alice</span>
              <span className="text-foreground/50">●●●</span>
            </div>
            <div className="before:bg-linear-to-r before:z-1 bg-foreground/5 relative h-1.5 rounded-full before:absolute before:inset-0 before:w-full before:rounded-full before:from-indigo-500/30 before:to-indigo-500/70" />
          </div>
          <div>
            <div className="mb-1 flex justify-between text-xs">
              <span className="text-muted-foreground">Bob</span>
              <span className="text-foreground/50">
                ●●<span className="text-foreground/10">●</span>
              </span>
            </div>
            <div className="before:bg-linear-to-r before:z-1 bg-foreground/5 relative h-1.5 rounded-full before:absolute before:inset-0 before:w-2/3 before:rounded-full before:from-emerald-500/30 before:to-emerald-500/70" />
          </div>
          <div>
            <div className="mb-1 flex justify-between text-xs">
              <span className="text-muted-foreground">Carol</span>
              <span className="text-foreground/50">
                ●<span className="text-foreground/10">●●</span>
              </span>
            </div>
            <div className="before:bg-linear-to-r before:z-1 bg-foreground/5 relative h-1.5 rounded-full before:absolute before:inset-0 before:w-1/3 before:rounded-full before:from-amber-500/30 before:to-amber-500/70" />
          </div>
          <div>
            <div className="mb-1 flex justify-between text-xs">
              <span className="text-muted-foreground">Dave</span>
              <span className="text-foreground/50">
                ●<span className="text-foreground/10">●●</span>
              </span>
            </div>
            <div className="before:bg-linear-to-r before:z-1 bg-foreground/5 relative h-1.5 rounded-full before:absolute before:inset-0 before:w-1/4 before:rounded-full before:from-rose-500/30 before:to-rose-500/70" />
          </div>
        </div>
      </div>
    </div>
  );
};
