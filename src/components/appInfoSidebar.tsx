"use client";

import { useState } from "react";

import { cn } from "@/lib/utils";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { HubSubmittedAppResponse } from "@/lib/types";
import { LoadingButton } from "./ui/loading-button";

export const AppActionButton = ({
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
  variant = "default",
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
  variant?: "default" | "handshake";
}) => {
  const isHandshake = variant === "handshake";
  const ctaBg = isHandshake ? "bg-emerald-500 hover:bg-emerald-500/90" : "bg-primary hover:bg-primary/90";
  const ctaText = isHandshake ? "text-white" : "text-primary-foreground";
  const ctaShadow = isHandshake ? "shadow-lg shadow-emerald-500/20" : "";
  if (visitUrl) {
    return (
      <a
        href={visitUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          "flex flex-row gap-2 w-full rounded-xl items-center justify-center py-3 font-semibold transition-colors",
          ctaBg,
          ctaText,
        )}
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
      <div className="w-full space-y-4">
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

        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            "flex flex-row gap-2 w-full rounded-xl items-center justify-center py-3 font-semibold transition-all hover:scale-[1.02] active:scale-[0.98]",
            ctaBg,
            ctaText,
            ctaShadow,
          )}
        >
          View on Google Play <SquareArrowOutUpRight className="w-5 h-5" />
        </a>
      </div>
    );
  }

  if (buttonType === "external") {
    return (
      <a
        href={url}
        target="_blank"
        className={cn(
          "flex flex-row gap-2 w-full rounded-full items-center justify-center py-2 text-white hover:scale-105 duration-300",
          isHandshake ? "bg-emerald-500" : "bg-primary",
        )}
      >
        Open Google Play <SquareArrowOutUpRight size={20} />
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

  const [hasJoinedGroup, setHasJoinedGroup] = useState(false);
  const [showGateError, setShowGateError] = useState(false);

  const onJoinClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!hasJoinedGroup) {
      setShowGateError(true);
      setTimeout(() => setShowGateError(false), 3000);
      return;
    }
    handleRequestToJoin?.();
  };

  return (
    <div className="w-full m-auto space-y-4">
      <div
        className={cn(
          "rounded-xl p-4 space-y-3 border",
          isHandshake
            ? "bg-emerald-500/5 dark:bg-emerald-500/10 border-emerald-500/20"
            : "bg-primary/5 dark:bg-primary/10 border-primary/20",
        )}
      >
        <div className="flex items-start gap-3 text-sm">
          <Checkbox
            id="google-group-join"
            checked={hasJoinedGroup}
            onCheckedChange={(checked) => setHasJoinedGroup(checked === true)}
            className="mt-1"
          />
          <Label
            htmlFor="google-group-join"
            className="text-muted-foreground leading-tight cursor-pointer font-medium"
          >
            I have joined the{" "}
            <a
              href="https://groups.google.com/g/appstestlab"
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "hover:underline font-bold",
                isHandshake ? "text-emerald-600" : "text-primary",
              )}
            >
              Google Group (appstestlab)
            </a>{" "}
            to receive access to this app.
          </Label>
        </div>
      </div>

      <LoadingButton
        onClick={onJoinClick}
        isLoading={isPending}
        isSuccess={isSuccess}
        isError={isError}
        reset={reset}
        className="w-full m-auto py-5"
      >
        Request to Join Testing
      </LoadingButton>
      {showGateError && (
        <p className="text-destructive text-[11px] text-center font-bold mt-2 animate-pulse">
          Please join the Google Group and check the box above first!
        </p>
      )}
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
  buttonClassName,
  variant = "default",
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
  buttonClassName?: string;
  variant?: "default" | "handshake";
}) => {
  const { theme } = useTheme();
  const isHandshake = variant === "handshake";

  const hoverTextColor = theme === "dark" ? "black" : "white";
  const hoverBgColor = theme === "dark" ? "white" : "black";

  if (!app) return null;

  return (
    <div className="sticky top-24 space-y-6">
      <div className={cn("w-full", buttonClassName)}>
        <AppActionButton
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
          variant={variant}
        />
      </div>

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
                className={cn(
                  "mt-1 text-md border-none !text-white text-normal",
                  isHandshake
                    ? "bg-gradient-to-b from-emerald-500 to-emerald-700"
                    : "bg-gradient-to-b from-primary to-primary/50",
                )}
              >
                {app?.androidApp?.appCategory?.name}
              </Badge>
              <div className="flex items-center gap-2 text-xs sm:text-sm">
                <Smartphone
                  className={cn(
                    "w-5 h-5",
                    isHandshake ? "text-emerald-600/80" : "text-primary/80",
                  )}
                />
                Android {app?.minimumAndroidVersion}
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter
          className={cn(
            "p-2 rounded-b-2xl relative",
            isHandshake
              ? "bg-gradient-to-b from-emerald-500/0 to-emerald-500/60"
              : "bg-gradient-to-b from-primary/0 to-primary/60",
          )}
        >
          <div className="w-full p-4 rounded-xl text-center">
            <p
              className={cn(
                "text-lg font-semibold text-start",
                isHandshake ? "text-emerald-600" : "text-primary",
              )}
            >
              REWARD
            </p>
            {/* S8-A2: handshake testing is a barter system , no points, no
                money. Show a handshake badge instead of "0 Points". */}
            {app?.appType === "HANDSHAKE" ? (
              <div className="text-xl sm:text-2xl font-bold text-foreground flex items-center gap-2 justify-start mt-1">
                <span aria-hidden>🤝</span> Barter
              </div>
            ) : app?.appType === "PAID" ? (
              <div className="text-3xl font-bold text-foreground flex items-center gap-2 justify-start mt-1">
                {`₹${app?.rewardMoney || 0}`}
                <Star
                  className={cn(
                    "w-7 h-7 scale-[4] sm:scale-[6] absolute bottom-8 right-2 sm:right-6 rotate-90",
                    isHandshake
                      ? "text-emerald-500/0 fill-emerald-500/20"
                      : "text-primary/0 fill-primary/20",
                  )}
                />
              </div>
            ) : (
              <div className="text-xl sm:text-2xl font-bold text-foreground flex items-center gap-2 justify-start mt-1">
                <span aria-hidden>✅</span> Free Testing
              </div>
            )}
          </div>
        </CardFooter>
      </Card>

      <Card
        className={cn(
          "border-0 rounded-2xl shadow-xl shadow-gray-100 dark:shadow-gray-900 overflow-hidden",
          isHandshake
            ? "bg-gradient-to-br from-emerald-500/10 to-emerald-500/30 dark:from-secondary dark:to-secondary/30"
            : "bg-gradient-to-br from-primary/10 to-primary/30 dark:from-secondary dark:to-secondary/30",
        )}
      >
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold text-foreground/80">
            Project Specifications
          </CardTitle>
        </CardHeader>
        <CardContent className="pb-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">
                Duration
              </span>
              <span className="text-sm font-semibold">{app?.totalDay} Days</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">
                Slots
              </span>
              <span className="text-sm font-semibold">
                {app?.currentTester} / {app?.totalTester}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export const AppInfoSidebarSkeleton = ({
  variant = "default",
}: {
  variant?: "default" | "handshake";
}) => {
  const isHandshake = variant === "handshake";
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
        <CardFooter
          className={cn(
            "p-2 rounded-b-2xl relative",
            isHandshake
              ? "bg-gradient-to-b from-emerald-500/0 to-emerald-500/60"
              : "bg-gradient-to-b from-primary/0 to-primary/60",
          )}
        >
          <div className="w-full p-4 rounded-xl">
            <Skeleton className="h-5 w-20 mb-2" />
            <div className="flex items-center gap-2">
              <Skeleton className="h-8 w-32" />
            </div>
          </div>
        </CardFooter>
      </Card>

      {/* Creator Profile Skeleton */}
      <Card
        className={cn(
          "border-0 rounded-2xl shadow-xl shadow-gray-100 dark:shadow-gray-900 overflow-hidden",
          isHandshake
            ? "bg-gradient-to-br from-emerald-500/10 to-emerald-500/30 dark:from-secondary dark:to-secondary/30"
            : "bg-gradient-to-br from-primary/10 to-primary/30 dark:from-secondary dark:to-secondary/30",
        )}
      >
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
