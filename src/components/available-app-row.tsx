import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight, Smartphone, Star } from "lucide-react";
import { Badge } from "./ui/badge";
import { HubSubmittedAppResponse } from "@/lib/types";

interface AvailableAppRowProps extends React.HTMLAttributes<HTMLDivElement> {
  app: HubSubmittedAppResponse;
}

export function AvailableAppRow({ app, ...props }: AvailableAppRowProps) {
  return (
    <div
      className="group flex items-center justify-between gap-4 p-4 border-b transition-colors hover:bg-secondary/50"
      {...props}
    >
      <div className="flex items-center gap-4">
        <Image
          src={app?.androidApp?.appLogoUrl}
          alt={app?.androidApp?.appName}
          width={48}
          height={48}
          className="rounded-lg border"
          data-ai-hint={app?.androidApp?.appName}
        />
        <div>
          <h3 className="font-semibold">{app?.androidApp?.appName}</h3>
          <p className="text-sm text-muted-foreground">
            {app?.androidApp?.description}
          </p>
        </div>
      </div>
      <div className="hidden md:flex items-center gap-6 text-sm">
        <Badge variant="outline" className="rounded-full">
          {app?.androidApp?.appCategory?.name}
        </Badge>
        <div className="flex items-center gap-1.5">
          <Smartphone className="w-4 h-4 text-muted-foreground" />
          <span className="text-muted-foreground">
            Android {app?.minimumAndroidVersion}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <Star className="w-4 h-4 text-amber-400" />
          <span className="font-bold text-primary">
            {app?.rewardPoints} Points
          </span>
        </div>
      </div>
      <Button
        asChild
        className="opacity-0 group-hover:opacity-100 transition-opacity"
        variant="ghost"
      >
        <Link href={`/community-dashboard/${app.id}`}>
          Test App <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
      </Button>
    </div>
  );
}
