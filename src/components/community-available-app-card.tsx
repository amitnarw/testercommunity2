import Link from "next/link";
import { SafeImage } from "@/components/safe-image";
import { Badge } from "@/components/ui/badge";
import { Clock, Smartphone, Star, ArrowRight, Zap, Trophy } from "lucide-react";
import { HubSubmittedAppResponse } from "@/lib/types";
import { cn } from "@/lib/utils";

interface CommunityAvailableAppCardProps {
  app: HubSubmittedAppResponse;
}

export function CommunityAvailableAppCard({
  app,
}: CommunityAvailableAppCardProps) {
  return (
    <Link
      href={`/community-dashboard/${app.id}`}
      className="group block h-full"
    >
      <div className="relative h-full flex flex-col overflow-hidden rounded-3xl bg-card border border-border/50 hover:border-primary/50 transition-all duration-500 hover:shadow-[0_10px_40px_-15px_rgba(0,0,0,0.2)] dark:hover:shadow-[0_10px_40px_-20px_rgba(255,255,255,0.1)] hover:-translate-y-1">
        {/* Decorative Gradient Blob */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-10 -mt-10 transition-all duration-500 group-hover:bg-primary/10" />

        <div className="p-5 flex-grow flex flex-col relative z-10">
          {/* Header */}
          <div className="flex justify-between items-start mb-5">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 blur-xl rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
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
              className="rounded-full px-3 py-0.5 bg-secondary/30 backdrop-blur-sm border-white/10 text-muted-foreground group-hover:text-primary group-hover:border-primary/20 transition-colors"
            >
              {app?.androidApp?.appCategory?.name}
            </Badge>
          </div>

          {/* Content */}
          <div className="mb-4">
            <h3 className="text-xl font-bold text-card-foreground group-hover:text-primary transition-colors duration-300 line-clamp-1 mb-2">
              {app?.androidApp?.appName}
            </h3>
            <p className="text-sm text-muted-foreground/80 line-clamp-2 leading-relaxed">
              {app?.androidApp?.description}
            </p>
          </div>

          {/* Meta Tags */}
          <div className="flex flex-wrap gap-2 mb-6 mt-auto">
            <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground bg-secondary/40 px-2.5 py-1.5 rounded-md border border-transparent group-hover:border-primary/10 transition-colors">
              <Smartphone className="w-3.5 h-3.5" />
              <span>Android {app?.minimumAndroidVersion}+</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground bg-secondary/40 px-2.5 py-1.5 rounded-md border border-transparent group-hover:border-primary/10 transition-colors">
              <Clock className="w-3.5 h-3.5" />
              <span>{app?.averageTimeTesting}</span>
            </div>
          </div>
        </div>

        {/* Footer Action Area */}
        <div className="relative p-4 pt-0 mt-auto z-10">
          <div className="flex items-center justify-between p-1 pl-4 bg-secondary/30 rounded-2xl border border-border/40 group-hover:border-primary/20 transition-colors duration-300">
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                Reward
              </span>
              <div className="flex items-center gap-1.5">
                <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                <span className="font-bold text-foreground text-sm">
                  {app?.rewardPoints} Pts
                </span>
              </div>
            </div>

            <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/20 group-hover:scale-105 group-hover:shadow-primary/40 transition-all duration-300">
              <ArrowRight className="w-5 h-5 -rotate-45 group-hover:rotate-0 transition-transform duration-300" />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
