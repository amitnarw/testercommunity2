import React from "react";
import { Skeleton } from "../ui/skeleton";

const SkeletonNotification = () => {
  return (
    <div className="w-full flex flex-col gap-3 items-center justify-around mt-8">
      {Array.from({ length: 4 }).map((_, index) => (
        <Skeleton key={index} className="w-full rounded-xl p-1">
          <div className="rounded-xl flex flex-row gap-5 p-4 bg-background/50">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="flex flex-col gap-2 w-full">
              <Skeleton className="h-3 w-3/6 rounded-lg" />
              <Skeleton className="h-5 w-5/6 rounded-lg" />
              <Skeleton className="h-2 w-2/6 rounded-lg mt-2" />
            </div>
          </div>
        </Skeleton>
      ))}
    </div>
  );
};

export default SkeletonNotification;
