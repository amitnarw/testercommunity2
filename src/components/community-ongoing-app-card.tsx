import Link from "next/link";
import { SafeImage } from "@/components/safe-image";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Smartphone, Timer, PlayCircle } from "lucide-react";
import { HubSubmittedAppResponse } from "@/lib/types";

interface CommunityOngoingAppCardProps {
  app: HubSubmittedAppResponse;
}

export function CommunityOngoingAppCard({ app }: CommunityOngoingAppCardProps) {
  const totalDays = app.totalDay || 14;
  const daysCompleted = app.currentDay || 0;
  const progressPercentage = Math.min(
    Math.max(totalDays > 0 ? (daysCompleted / totalDays) * 100 : 0, 0),
    100,
  );

  return (
    <Link
      href={`/community-dashboard/${app.id}/ongoing`}
      className="group block h-full"
    >
      <div className="relative h-full flex flex-col overflow-hidden rounded-3xl bg-card border border-border/50 hover:border-blue-500/50 transition-all duration-500 hover:shadow-[0_10px_40px_-15px_rgba(59,130,246,0.2)] dark:hover:shadow-[0_10px_40px_-20px_rgba(59,130,246,0.1)] hover:-translate-y-1">
        {/* Decorative Gradient Blob */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl -mr-10 -mt-10 transition-all duration-500 group-hover:bg-blue-500/10" />

        <div className="p-5 flex-grow flex flex-col relative z-10">
          {/* Header */}
          <div className="flex justify-between items-start mb-5">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <SafeImage
                src={app?.androidApp?.appLogoUrl}
                alt={app?.androidApp?.appName}
                width={72}
                height={72}
                className="relative z-10 rounded-2xl border border-border/40 shadow-sm object-cover bg-background"
                data-ai-hint={app?.androidApp?.appName}
              />
            </div>
            <Badge
              variant="outline"
              className="rounded-full px-3 py-0.5 bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800"
            >
              Ongoing
            </Badge>
          </div>

          {/* Content */}
          <div className="mb-4">
            <h3 className="text-xl font-bold text-card-foreground group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300 line-clamp-1 mb-2">
              {app?.androidApp?.appName}
            </h3>
            <p className="text-sm text-muted-foreground/80 line-clamp-2 leading-relaxed">
              {app?.androidApp?.description}
            </p>
          </div>

          {/* Meta Tags */}
          <div className="flex flex-wrap gap-2 mb-6 mt-auto">
            <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground bg-secondary/40 px-2.5 py-1.5 rounded-md border border-transparent group-hover:border-blue-500/10 transition-colors">
              <Smartphone className="w-3.5 h-3.5" />
              <span>Android {app?.minimumAndroidVersion}+</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground bg-secondary/40 px-2.5 py-1.5 rounded-md border border-transparent group-hover:border-blue-500/10 transition-colors">
              <Timer className="w-3.5 h-3.5" />
              <span>
                {daysCompleted}/{totalDays} Days
              </span>
            </div>
          </div>
        </div>

        {/* Footer Action Area */}
        <div className="relative p-4 pt-0 mt-auto z-10">
          <div className="flex flex-col gap-3 p-4 bg-secondary/30 rounded-2xl border border-border/40 group-hover:border-blue-500/20 transition-colors duration-300">
            <div className="w-full">
              <div className="flex justify-between items-center text-xs text-muted-foreground mb-2 font-medium">
                <span>Testing Progress</span>
                <span className="text-blue-600 dark:text-blue-400">
                  {Math.round(progressPercentage)}%
                </span>
              </div>
              <Progress
                value={progressPercentage}
                className="h-2 bg-blue-100 dark:bg-blue-950/50"
                indicatorClassName="bg-blue-500"
              />
            </div>

            <div className="flex items-center justify-center gap-2 text-sm font-semibold text-blue-600 dark:text-blue-400 mt-1">
              <span>Continue Testing</span>
              <PlayCircle className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
