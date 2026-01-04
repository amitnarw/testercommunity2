import React from "react";
import { Skeleton } from "../ui/skeleton";

const SkeletonSubmitAppBottom = () => {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full mt-10">
      <Skeleton className="h-6 w-40 rounded-lg" />
      <div className="flex flex-row items-end justify-center gap-2 mt-4">
        <Skeleton className="h-10 w-20 rounded-lg" />
        <Skeleton className="h-6 w-20 rounded-lg" />
      </div>
      <Skeleton className="h-4 w-60 rounded-lg mt-2" />
    </div>
  );
};

export default SkeletonSubmitAppBottom;
