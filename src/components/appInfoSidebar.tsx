"use client";

import { useTheme } from "next-themes";
import { SafeImage } from "@/components/safe-image";
import {
  Star,
  Smartphone,
  Clock,
  SquareArrowOutUpRight,
  Send,
  XCircle,
  CalendarDays,
  Users,
} from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { HubSubmittedAppResponse } from "@/lib/types";
import { LoadingButton } from "./ui/loading-button";

const SidebarButton = ({
  app,
  handleRequestToJoin,
  buttonType,
  url,
  hoverTextColor,
  hoverBgColor,
  isPending,
  isSuccess,
  isError,
  error,
  reset,
  hideButton,
  visitUrl,
}: {
  app: HubSubmittedAppResponse;
  handleRequestToJoin?: () => void;
  isPending?: boolean;
  isSuccess?: boolean;
  isError?: boolean;
  error?: Error;
  reset?: () => void;
  buttonType?: string;
  url?: string;
  hoverTextColor?: string;
  hoverBgColor?: string;
  hideButton?: boolean;
  visitUrl?: string;
}) => {
  if (visitUrl) {
    return (
      <a
        href={visitUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex flex-row gap-2 w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl items-center justify-center py-3 font-semibold transition-colors"
      >
        <SquareArrowOutUpRight className="w-5 h-5" />
        View on Google Play
      </a>
    );
  }

  if (hideButton) return null;

  // Show "Testers are joining" when on ongoing page (external button) and app is still AVAILABLE
  if (buttonType === "external" && app?.status === "AVAILABLE") {
    return (
      <div className="w-full rounded-2xl bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/20 p-4 space-y-3">
        <div className="flex items-center gap-2 text-amber-600 dark:text-amber-500">
          <Users className="w-5 h-5" />
          <span className="font-semibold">Testers are joining</span>
        </div>
        <p className="text-sm text-muted-foreground">
          Testing will start once all testers have joined.
        </p>
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-medium text-muted-foreground">
            <span>Progress</span>
            <span>
              {app?.currentTester || 0} / {app?.totalTester || 0}
            </span>
          </div>
          <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-500 ease-out"
              style={{
                width: `${Math.min(
                  ((app?.currentTester || 0) / (app?.totalTester || 1)) * 100,
                  100,
                )}%`,
              }}
            />
          </div>
        </div>
        <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground pt-1">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-500 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
          </span>
          <span>Waiting for testers...</span>
        </div>
      </div>
    );
  }

  if (buttonType === "external") {
    return (
      <a
        href={url}
        target="_blank"
        className="flex flex-row gap-2 w-full border border-primary/50 rounded-full items-center justify-center py-2 text-primary"
      >
        Re-open Google Play <SquareArrowOutUpRight size={20} />
      </a>
    );
  }

  if (
    app?.status === "AVAILABLE" &&
    app?.testerRelations?.[0]?.status === "PENDING"
  ) {
    return (
      <div className="w-full text-center py-3 bg-secondary text-muted-foreground rounded-full text-sm font-semibold flex items-center justify-center gap-2">
        <Send className="w-4 h-4" />
        Request Sent
      </div>
    );
  }

  if (app?.status === "REQUESTED") {
    return (
      <div className="w-full text-center py-3 bg-secondary text-muted-foreground rounded-full text-sm font-semibold flex items-center justify-center gap-2">
        <Send className="w-4 h-4" />
        Request Sent
      </div>
    );
  }
  if (app?.testerRelations?.[0]?.status === "REJECTED") {
    return (
      <div className="w-full text-center py-3 bg-red-500/15 text-destructive dark:text-red-500 rounded-full text-sm font-semibold flex items-center justify-center gap-2">
        <XCircle className="w-4 h-4" />
        Request Rejected
      </div>
    );
  }

  return (
    <div className="w-full m-auto">
      <LoadingButton
        onClick={handleRequestToJoin}
        isLoading={isPending}
        isSuccess={isSuccess}
        isError={isError}
        reset={reset}
        className="w-full m-auto py-5"
      >
        Request to Join Testing
      </LoadingButton>
      <p className="text-red-500 text-sm text-center mt-2">{error?.message}</p>
    </div>
  );
};

export const AppInfoSidebar = ({
  app,
  handleRequestToJoin,
  isPending,
  isSuccess,
  isError,
  error,
  reset,
  buttonType,
  url,
  hideButton,
  visitUrl,
}: {
  app: HubSubmittedAppResponse;
  handleRequestToJoin?: () => void;
  isPending?: boolean;
  isSuccess?: boolean;
  isError?: boolean;
  error?: Error;
  reset?: () => void;
  buttonType?: string;
  url?: string;
  hideButton?: boolean;
  visitUrl?: string;
}) => {
  const { theme } = useTheme();

  const hoverTextColor = theme === "dark" ? "black" : "white";
  const hoverBgColor = theme === "dark" ? "white" : "black";

  if (!app) return null;

  return (
    <div className="sticky top-24 space-y-6">
      <SidebarButton
        app={app}
        handleRequestToJoin={handleRequestToJoin}
        isPending={isPending}
        isSuccess={isSuccess}
        isError={isError}
        error={error}
        reset={reset}
        buttonType={buttonType}
        url={url}
        hideButton={hideButton}
        visitUrl={visitUrl}
        hoverTextColor={hoverTextColor}
        hoverBgColor={hoverBgColor}
      />

      <Card className="border-0 rounded-2xl shadow-xl shadow-gray-100 dark:shadow-gray-900 overflow-hidden">
        <CardContent className="p-6 pb-0">
          <div className="flex items-center gap-4 mb-4">
            <SafeImage
              src={app?.androidApp?.appLogoUrl}
              alt={app?.androidApp?.appName}
              width={100}
              height={100}
              className="rounded-xl bg-background shadow-sm"
              data-ai-hint={app?.androidApp?.appName}
            />
            <div className="flex flex-col items-start justify-between gap-2">
              <Badge
                variant="outline"
                className="mt-1 text-md border-none bg-gradient-to-b from-primary to-primary/50 !text-white text-normal"
              >
                {app?.androidApp?.appCategory?.name}
              </Badge>
              <div className="flex items-center gap-2 text-xs sm:text-sm">
                <Smartphone className="w-5 h-5 text-primary/80" />
                Android {app?.minimumAndroidVersion}
              </div>
              <div className="flex items-center gap-2 text-xs sm:text-sm">
                <Clock className="w-5 h-5 text-primary/80" /> ~
                {app?.averageTimeTesting} test
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="p-2 bg-gradient-to-b from-primary/0 to-primary/60 rounded-b-2xl relative">
          <div className="w-full p-4 rounded-xl text-center">
            <p className="text-lg font-semibold text-primary text-start">
              REWARD
            </p>
            <div className="text-3xl font-bold text-foreground flex items-center gap-2 justify-start mt-1">
              {app?.rewardPoints} Points
              <Star className="w-7 h-7 text-primary/0 fill-primary/20 scale-[4] sm:scale-[6] absolute bottom-8 right-2 sm:right-6 rotate-90" />
            </div>
          </div>
        </CardFooter>
      </Card>

      <Card className="border-0 rounded-2xl shadow-xl shadow-gray-100 dark:shadow-gray-900 overflow-hidden bg-gradient-to-br from-primary/10 to-primary/30 dark:from-secondary dark:to-secondary/30">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold text-foreground/80">
            Creator Profile
          </CardTitle>
        </CardHeader>
        <CardContent className="pb-6">
          <div className="flex items-center gap-4">
            <Avatar className="h-12 w-12 border-2 border-background shadow-sm ring-2 ring-secondary/20">
              <AvatarImage
                src={app?.appOwner?.image || ""}
                className="object-cover"
                data-ai-hint="man developer"
              />
              <AvatarFallback className="bg-background text-primary font-bold">
                {app?.appOwner?.name?.slice(0, 2)?.toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <div className="flex flex-col min-w-0">
              <h3 className="font-semibold text-sm truncate">
                {app?.appOwner?.name}
              </h3>
              <p className="text-xs text-muted-foreground truncate">
                {app?.appOwner?.email}
              </p>
              {app?.appOwner?.emailVerified && (
                <div className="flex items-center gap-1 mt-1">
                  <Badge
                    variant="secondary"
                    className="text-[10px] h-4 px-1 bg-green-500/10 text-green-600 dark:text-green-400 hover:bg-green-500/20 border-green-500/20"
                  >
                    Verified
                  </Badge>
                </div>
              )}
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-2">
                <CalendarDays className="w-3.5 h-3.5" />
                <span className="truncate">
                  Joined{" "}
                  {new Date(app?.appOwner?.createdAt).toLocaleDateString(
                    "en-US",
                    { month: "short", year: "numeric" },
                  )}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export const AppInfoSidebarSkeleton = () => {
  return (
    <div className="sticky top-24 space-y-6">
      {/* Button Skeleton */}
      <Skeleton className="w-full h-14 rounded-full" />

      {/* App Card Skeleton */}
      <Card className="border-0 rounded-2xl shadow-xl shadow-gray-100 dark:shadow-gray-900 overflow-hidden">
        <CardContent className="p-6 pb-0">
          <div className="flex items-center gap-4 mb-4">
            <Skeleton className="w-[100px] h-[100px] rounded-xl" />
            <div className="flex flex-col gap-2 w-full">
              <Skeleton className="h-6 w-24 rounded-full" />
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-28" />
            </div>
          </div>
        </CardContent>
        <CardFooter className="p-2 bg-gradient-to-b from-primary/0 to-primary/60 rounded-b-2xl relative">
          <div className="w-full p-4 rounded-xl">
            <Skeleton className="h-5 w-20 mb-2" />
            <div className="flex items-center gap-2">
              <Skeleton className="h-8 w-32" />
            </div>
          </div>
        </CardFooter>
      </Card>

      {/* Creator Profile Skeleton */}
      <Card className="border-0 rounded-2xl shadow-xl shadow-gray-100 dark:shadow-gray-900 overflow-hidden bg-gradient-to-br from-primary/10 to-primary/30 dark:from-secondary dark:to-secondary/30">
        <CardHeader className="pb-2">
          <Skeleton className="h-5 w-32 bg-background/50" />
        </CardHeader>
        <CardContent className="pb-6">
          <div className="flex items-center gap-4">
            <Skeleton className="h-12 w-12 rounded-full border-2 border-background" />
            <div className="flex flex-col gap-2">
              <Skeleton className="h-4 w-32 bg-background/50" />
              <Skeleton className="h-3 w-24 bg-background/50" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
