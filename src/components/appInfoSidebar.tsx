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
  Sparkles,
  CalendarDays,
} from "lucide-react";
import { motion } from "framer-motion";
import AnimatedRoundedButton from "@/components/ui/animated-rounded-button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { HubSubmittedAppResponse } from "@/lib/types";

const SidebarButton = ({
  app,
  handleRequestToJoin,
  buttonType,
  url,
  hoverTextColor,
  hoverBgColor,
}: any) => {
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

  switch (app.status) {
    case "requested":
      return (
        <div className="w-full text-center py-3 bg-secondary text-muted-foreground rounded-full text-sm font-semibold flex items-center justify-center gap-2">
          <Send className="w-4 h-4" />
          Request Sent
        </div>
      );
    case "request_rejected":
      return (
        <div className="w-full text-center py-3 bg-red-500/15 text-destructive dark:text-red-500 rounded-full text-sm font-semibold flex items-center justify-center gap-2">
          <XCircle className="w-4 h-4" />
          Request Rejected
        </div>
      );
    default: // 'available'
      return (
        <div onClick={handleRequestToJoin} className="w-full m-auto">
          <AnimatedRoundedButton
            backgroundColor="hsl(var(--primary))"
            animatedBackgroundColor={hoverBgColor}
            hoverTextColor={hoverTextColor}
            borderRadius="9999px"
            paddingY="4"
            paddingX="0"
            className="py-2 sm:py-4 text-sm sm:text-base"
          >
            <div className="flex items-center text-center gap-2">
              <span className="w-full">Request to Join Testing</span>
            </div>
          </AnimatedRoundedButton>
        </div>
      );
  }
};

export const AppInfoSidebar = ({
  app,
  handleRequestToJoin,
  buttonType,
  url,
}: {
  app: HubSubmittedAppResponse;
  handleRequestToJoin?: () => void;
  buttonType?: string;
  url?: string;
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
        buttonType={buttonType}
        url={url}
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
              className="rounded-xl border bg-background shadow-sm"
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
              {app?.costPoints} Points
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
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5">
                <CalendarDays className="w-3.5 h-3.5" />
                <span className="truncate">
                  Joined{" "}
                  {new Date(app?.appOwner?.createdAt).toLocaleDateString(
                    "en-US",
                    { month: "short", year: "numeric" }
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
