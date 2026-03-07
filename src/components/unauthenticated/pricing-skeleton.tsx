import React from "react";
import { Skeleton } from "../ui/skeleton";

const SkeletonPricingSetup = () => {
  return (
    <div className="w-full flex flex-col items-center gap-4 mt-10">
      <Skeleton className="h-8 w-4/12 rounded-lg" />
      <Skeleton className="h-4 w-6/12 rounded-lg" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full mt-12">
        <Skeleton className="h-96 w-full rounded-3xl" />
        <Skeleton className="h-96 w-full rounded-3xl" />
      </div>
    </div>
  );
};

export default SkeletonPricingSetup;
