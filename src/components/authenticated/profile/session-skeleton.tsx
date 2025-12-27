import { Skeleton } from "@/components/ui/skeleton";
import React, { Fragment } from "react";

const SkeletonSessions = () => {
  return Array.from({ length: 3 })?.map((_, index) => (
    <div
      key={index}
      className="flex flex-col sm:flex-row items-start sm:items-center gap-4 px-0 sm:px-5 py-3"
    >
      <Fragment key={index}>
        <div className="w-full flex flex-row gap-4">
          <Skeleton className="h-12 w-[65px] rounded-full" />
          <div className="space-y-2 w-full">
            <Skeleton className="h-4 w-4/6 sm:w-2/6" />
            <Skeleton className="h-4 w-full sm:w-4/6" />
          </div>
        </div>
        <Skeleton className="h-10 w-full sm:w-40 rounded-full" />
      </Fragment>
    </div>
  ));
};

export default SkeletonSessions;
