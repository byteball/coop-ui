import { Card, CardHeader, CardContent, CardFooter } from "#/shared/ui/card";

function Pulse({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded bg-muted ${className}`} />;
}

export function GovernanceProfileSkeleton() {
  return (
    <Card>
      <CardContent className="flex items-center justify-between gap-4 py-4">
        <Pulse className="h-4 w-36" />
        <div className="flex gap-6">
          <Pulse className="h-4 w-28" />
          <Pulse className="h-4 w-24" />
        </div>
      </CardContent>
    </Card>
  );
}

function GovernanceParamCardSkeleton() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <Pulse className="h-4 w-32" />
          <Pulse className="h-4 w-16" />
        </div>
      </CardHeader>
      <CardContent className="space-y-3 pb-3">
        <Pulse className="h-16 w-full" />
        <Pulse className="h-3 w-24" />
        <Pulse className="h-3 w-full" />
        <Pulse className="h-3 w-3/4" />
      </CardContent>
      <CardFooter className="pt-0">
        <Pulse className="h-8 w-16" />
      </CardFooter>
    </Card>
  );
}

export function GovernanceParamListSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      {Array.from({ length: 6 }, (_, i) => (
        <GovernanceParamCardSkeleton key={i} />
      ))}
    </div>
  );
}
