"use client";

import Link from "next/link";
import { Clock, Handshake, Smartphone } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { SafeImage } from "@/components/safe-image";
import { EliteBadge } from "./elite-badge";
import { ROUTES } from "@/lib/routes";

interface DeveloperCardData {
  id: number;
  appName: string;
  appLogoUrl: string;
  packageName: string;
  description: string;
  category: string;
  minimumAndroidVersion: number;
  totalDay: number;
  averageRating: number;
  appOwnerId: string;
  appOwnerName: string;
  appOwnerImage: string | null;
  appOwnerLevel: number;
  eliteBadge: boolean;
  totalTester: number;
  currentTester: number;
  status: string;
}

export function DeveloperCard({ data }: { data: DeveloperCardData }) {
  const appName = data.appName || "Untitled";
  const appLogo = data.appLogoUrl || null;
  const totalDay = data.totalDay ?? 16;
  const ownerInitial =
    (data.appOwnerName || "?").trim().charAt(0).toUpperCase() || "?";
  const showOwner = !!data.appOwnerName && data.appOwnerName !== "Unknown";
  const detailHref = `${ROUTES.AUTHENTICATED.HANDSHAKE_TESTING}/${data.id}`;

  return (
    <Link href={detailHref} className="group block">
      <Card className="flex flex-col h-full overflow-hidden rounded-2xl transition-all duration-300 group-hover:-translate-y-1 border-0 group-hover:shadow-lg">
        <CardContent className="p-4 flex-grow flex flex-col">
          <div className="flex items-start gap-4 mb-3">
            <SafeImage
              src={appLogo}
              alt={appName}
              fill
              sizes="64px"
              unoptimized
              fallbackClassName="rounded-lg border bg-muted text-muted-foreground/60"
              loadingClassName="rounded-lg border"
              className="rounded-lg border w-16 h-16 object-cover shrink-0"
            />
            <div className="flex-grow text-right">
              {data.category ? (
                <Badge variant="secondary">{data.category}</Badge>
              ) : null}
              {data.minimumAndroidVersion ? (
                <div className="flex items-center justify-end gap-1.5 text-xs text-muted-foreground mt-2">
                  <Smartphone className="w-3 h-3" />
                  <span>Android {data.minimumAndroidVersion}</span>
                </div>
              ) : null}
            </div>
          </div>

          <div className="flex-grow">
            <h3 className="text-lg font-bold group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
              {appName}
            </h3>
            {data.description ? (
              <p className="text-sm text-muted-foreground mt-1 h-10 line-clamp-2">
                {data.description}
              </p>
            ) : null}
          </div>
        </CardContent>

        <CardFooter className="flex-col items-start gap-2 p-4 pt-0">
          <Separator />

          {showOwner ? (
            <div className="flex items-center gap-1.5 w-full text-xs">
              <Avatar className="h-5 w-5 ring-1 ring-border/40 shrink-0">
                {data.appOwnerImage ? (
                  <AvatarImage
                    src={data.appOwnerImage}
                    alt={data.appOwnerName}
                  />
                ) : null}
                <AvatarFallback className="text-[10px] font-semibold bg-emerald-500/10 text-emerald-700 dark:text-emerald-400">
                  {ownerInitial}
                </AvatarFallback>
              </Avatar>
              <span className="text-muted-foreground truncate">
                {data.appOwnerName}
              </span>
              <span className="inline-flex items-center px-1 py-0.5 rounded bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-[10px] font-bold">
                L{data.appOwnerLevel}
              </span>
              {data.eliteBadge ? (
                <span className="-mr-0.5">
                  <EliteBadge size="sm" />
                </span>
              ) : null}
            </div>
          ) : null}

          <div className="flex justify-between w-full text-sm">
            <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-bold">
              <Handshake className="w-4 h-4" />
              <span>Barter</span>
            </div>
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span>{totalDay} Days</span>
            </div>
          </div>

          <div className="text-emerald-600 dark:text-emerald-400 font-semibold text-sm w-full text-center py-2 bg-emerald-500/10 rounded-lg group-hover:bg-emerald-500 group-hover:text-white transition-colors">
            View Details
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
