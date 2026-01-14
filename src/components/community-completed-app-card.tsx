import Link from "next/link";
import { SafeImage } from "@/components/safe-image";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Smartphone, Star } from "lucide-react";
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
      className="group block"
    >
      <Card
        data-loc="CommunityCompletedAppCard"
        className="flex flex-col h-full overflow-hidden rounded-2xl transition-all duration-300 group-hover:shadow-primary/20 group-hover:-translate-y-1 bg-secondary dark:bg-secondary/30 border-0"
      >
        <CardContent className="p-4 flex-grow flex flex-col">
          <div className="flex items-start gap-4 mb-4">
            <SafeImage
              src={app?.androidApp?.appLogoUrl}
              alt={app?.androidApp?.appName}
              width={64}
              height={64}
              className="rounded-lg border"
              data-ai-hint={app?.androidApp?.appName}
            />
            <div className="flex-grow text-right">
              <Badge variant="secondary">
                {app?.androidApp?.appCategory?.name}
              </Badge>
              <div className="flex items-center justify-end gap-1.5 text-xs text-muted-foreground mt-2">
                <Smartphone className="w-3 h-3" />
                <span>Android {app?.minimumAndroidVersion}</span>
              </div>
            </div>
          </div>
          <div className="flex-grow">
            <h3 className="text-lg font-bold transition-colors">
              {app?.androidApp?.appName}
            </h3>
            <p className="text-sm text-muted-foreground mt-1 h-10 line-clamp-2">
              {app?.androidApp?.description}
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex-col items-start gap-3 p-4 pt-0 mt-4">
          <div className="w-full p-3 bg-background/50 rounded-lg">
            <div className="flex justify-between items-center text-sm text-muted-foreground">
              <span>Points Claimed</span>
              <div className="flex items-center gap-1.5 text-green-500 font-bold">
                <Star className="w-4 h-4 fill-green-500" />
                <span>{app.points}</span>
              </div>
            </div>
            {app?.updatedAt && (
              <div className="flex justify-between items-center text-xs text-muted-foreground mt-1">
                <span>Completed</span>
                <span>{new Date(app.updatedAt).toLocaleDateString()}</span>
              </div>
            )}
          </div>
          <div className="text-foreground font-semibold text-sm w-full text-center py-2 bg-secondary rounded-lg group-hover:bg-muted transition-colors mt-2">
            View Feedback
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
