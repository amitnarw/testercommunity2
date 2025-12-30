import React from "react";
import { Skeleton } from "../ui/skeleton";

const SkeletonBilling = () => {
  return (
    <div className="w-full h-full grid grid-cols-1 gap-2 place-items-center mt-10">
      <div className="grid grid-cols-3 gap-8 w-10/12 mt-2">
        <Skeleton className="h-80 w-full rounded-lg" />
        <Skeleton className="h-80 w-full rounded-lg" />
        <Skeleton className="h-80 w-full rounded-lg" />
      </div>
      <Skeleton className="h-8 w-4/12 rounded-lg mt-12" />
      <Skeleton className="h-4 w-8/12 rounded-lg" />
      <div className="grid grid-cols-3 gap-8 mt-8 w-8/12">
        <Skeleton className="h-14 w-full rounded-lg" />
        <Skeleton className="h-14 w-full rounded-lg" />
        <Skeleton className="h-14 w-full rounded-lg" />
      </div>
      <div className="grid grid-cols-3 gap-8 mt-2 w-8/12">
        <Skeleton className="h-14 w-full rounded-lg" />
        <Skeleton className="h-14 w-full rounded-lg" />
        <Skeleton className="h-14 w-full rounded-lg" />
      </div>
    </div>
  );
};

export default SkeletonBilling;
