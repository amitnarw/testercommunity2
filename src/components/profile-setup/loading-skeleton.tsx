import React from "react";
import { Skeleton } from "../ui/skeleton";

const SkeletonProfileSetup = () => {
  return (
    <div className="w-full h-full">
      <Skeleton className="rounded-2xl p-2 min-h-[65vh] max-w-3xl lg:max-w-4xl mx-auto mt-8 hidden sm:block">
        <div className="rounded-2xl bg-[#f8fafc] dark:bg-[#0f151e] h-full p-8 flex flex-row gap-6 items-center">
          <div className="w-1/3 h-full">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-2 w-full mt-4" />
            <Skeleton className="h-2 w-full mt-2" />
            <div className="flex flex-col gap-4 mt-14">
              <Skeleton className="h-14 w-2/3" />
              <Skeleton className="h-14 w-2/3" />
              <Skeleton className="h-14 w-2/3" />
              <Skeleton className="h-14 w-2/3" />
            </div>
          </div>
          <div className="w-2/3 h-full">
            <Skeleton className="h-[55vh] w-full" />
          </div>
        </div>
      </Skeleton>
      <Skeleton className="rounded-2xl p-2 w-[90vw] mx-auto mt-8 block sm:hidden">
        <div className="rounded-2xl bg-[#f8fafc] dark:bg-[#0f151e] p-4 flex flex-col gap-1 items-center">
          <div className="w-full flex flex-row items-center justify-around">
            <Skeleton className="h-10 w-10 rounded-full" />
            <Skeleton className="h-10 w-10 rounded-full" />
            <Skeleton className="h-10 w-10 rounded-full" />
            <Skeleton className="h-10 w-10 rounded-full" />
          </div>
          <Skeleton className="h-1 w-full rounded-full mt-4" />
          <Skeleton className="h-4 w-1/2 rounded-md mt-8" />
          <Skeleton className="h-2 w-full rounded-md mt-2" />

          <Skeleton className="h-52 w-full mt-6" />
        </div>
      </Skeleton>
    </div>
  );
};

export default SkeletonProfileSetup;
