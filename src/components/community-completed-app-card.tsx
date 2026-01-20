import Link from "next/link";
import { SafeImage } from "@/components/safe-image";
import { Badge } from "@/components/ui/badge";
import { Smartphone, Star, CheckCircle2, Calendar } from "lucide-react";
import { HubSubmittedAppResponse } from "@/lib/types";

interface CommunityCompletedAppCardProps {
  app: HubSubmittedAppResponse;
}

export function CommunityCompletedAppCard({
  app,
}: CommunityCompletedAppCardProps) {
  return (
    <Link
      href={`/community-dashboard/${app.id}/completed`}
      className="group block h-full"
    >
      <div className="relative h-full flex flex-col overflow-hidden rounded-3xl bg-card border border-border/50 hover:border-green-500/50 transition-all duration-500 hover:shadow-[0_10px_40px_-15px_rgba(34,197,94,0.2)] dark:hover:shadow-[0_10px_40px_-20px_rgba(34,197,94,0.1)] hover:-translate-y-1">
        {/* Decorative Gradient Blob */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/5 rounded-full blur-3xl -mr-10 -mt-10 transition-all duration-500 group-hover:bg-green-500/10" />

        <div className="p-5 flex-grow flex flex-col relative z-10">
          {/* Header */}
          <div className="flex justify-between items-start mb-5">
            <div className="relative">
              <div className="absolute -top-2 -left-2 z-20 bg-green-500 rounded-full p-1 shadow-lg shadow-green-500/20">
                <CheckCircle2 className="w-4 h-4 text-white" />
              </div>
              <div className="absolute inset-0 bg-green-500/20 blur-xl rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
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
              className="rounded-full px-3 py-0.5 bg-green-500/10 text-green-600 dark:text-green-400 border-green-200 dark:border-green-800"
            >
              Completed
            </Badge>
          </div>

          {/* Content */}
          <div className="mb-4">
            <h3 className="text-xl font-bold text-card-foreground group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors duration-300 line-clamp-1 mb-2">
              {app?.androidApp?.appName}
            </h3>
            <p className="text-sm text-muted-foreground/80 line-clamp-2 leading-relaxed">
              {app?.androidApp?.description}
            </p>
          </div>

          {/* Meta Tags */}
          <div className="flex flex-wrap gap-2 mb-6 mt-auto">
            <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground bg-secondary/40 px-2.5 py-1.5 rounded-md border border-transparent group-hover:border-green-500/10 transition-colors">
              <Smartphone className="w-3.5 h-3.5" />
              <span>Android {app?.minimumAndroidVersion}+</span>
            </div>
            {app?.updatedAt && (
              <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground bg-secondary/40 px-2.5 py-1.5 rounded-md border border-transparent group-hover:border-green-500/10 transition-colors">
                <Calendar className="w-3.5 h-3.5" />
                <span>{new Date(app.updatedAt).toLocaleDateString()}</span>
              </div>
            )}
          </div>
        </div>

        {/* Footer Action Area */}
        <div className="relative p-4 pt-0 mt-auto z-10">
          <div className="flex flex-col gap-3 p-4 bg-secondary/30 rounded-2xl border border-border/40 group-hover:border-green-500/20 transition-colors duration-300">
            <div className="flex justify-between items-center w-full">
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Earned
              </span>
              <div className="flex items-center gap-2 bg-green-500/10 px-3 py-1 rounded-full border border-green-500/20">
                <Star className="w-4 h-4 text-green-600 dark:text-green-400 fill-green-600 dark:fill-green-400" />
                <span className="font-bold text-green-700 dark:text-green-300 text-sm">
                  {app?.rewardPoints} Pts
                </span>
              </div>
            </div>

            <div className="w-full text-center py-2 text-sm font-semibold text-muted-foreground group-hover:text-primary transition-colors">
              View Feedback
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
