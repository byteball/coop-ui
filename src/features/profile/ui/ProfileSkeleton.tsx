import type { FC } from "react";

import { Card, CardContent, CardHeader } from "#/shared/ui/card";
import { Skeleton } from "#/shared/ui/skeleton";

export const ProfileSkeleton: FC = () => (
  <div className="space-y-10">
    <div className="flex items-center gap-4">
      <Skeleton className="size-16 rounded-full md:size-20" />
      <div className="flex flex-col gap-2">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-64" />
      </div>
    </div>

    <div className="grid grid-cols-6 gap-8">
      <Card className="col-span-6 md:col-span-3 lg:col-span-2">
        <CardContent>
          <Skeleton className="h-5 w-24" />
          <Skeleton className="mt-2 h-7 w-40" />
          <Skeleton className="mt-3 h-4 w-full" />
        </CardContent>
      </Card>
      <Card className="col-span-6 md:col-span-3 lg:col-span-2">
        <CardContent>
          <Skeleton className="h-5 w-24" />
          <Skeleton className="mt-2 h-7 w-40" />
        </CardContent>
      </Card>
      <Card className="col-span-6 md:col-span-3 lg:col-span-2">
        <CardContent>
          <Skeleton className="h-5 w-24" />
          <Skeleton className="mt-2 h-7 w-32" />
        </CardContent>
      </Card>

      <Card className="col-span-6 lg:col-span-3">
        <CardHeader>
          <Skeleton className="h-5 w-20" />
        </CardHeader>
        <CardContent>
          <div className="grid gap-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
);
