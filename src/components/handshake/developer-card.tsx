"use client";

import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { EliteBadge } from "./elite-badge";
import { ROUTES } from "@/lib/routes";

interface DeveloperCardData {
  id: number;
  appName: string;
  appLogoUrl: string;
  packageName: string;
  appOwnerId: string;
  appOwnerName: string;
  appOwnerImage: string | null;
  appOwnerLevel: number;
  eliteBadge: boolean;
  totalTester: number;
  currentTester: number;
  totalDay: number;
  averageRating: number;
  status: string;
}

interface DeveloperCardProps {
  data: DeveloperCardData;
}

const Metric = ({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) => (
  <div className="bg-secondary/50 rounded-lg p-3 text-center">
    <p className="text-2xl font-bold">{value}</p>
    <p className="text-xs text-muted-foreground">{label}</p>
  </div>
);

export function DeveloperCard({ data }: DeveloperCardProps) {
  const appName = data.appName || "Untitled";
  const appLogo = data.appLogoUrl || null;
  const totalTester = data.totalTester ?? 0;
  const currentTester = data.currentTester ?? 0;
  const totalDay = data.totalDay ?? 16;
  const ownerInitial =
    (data.appOwnerName || "?").trim().charAt(0).toUpperCase() || "?";
  const showOwner = !!data.appOwnerName && data.appOwnerName !== "Unknown";
  const detailHref = `${ROUTES.AUTHENTICATED.HANDSHAKE_TESTING}/${data.id}`;

  return (
    <div className="group relative">
      <Link href={detailHref}>
        <Card className="rounded-2xl overflow-hidden bg-background hover:bg-secondary/50 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg h-full flex flex-col border-border/60">
          <CardHeader className="flex flex-row items-start justify-between gap-4 p-3 sm:p-5">
            <div className="flex items-center gap-4 min-w-0">
              {appLogo ? (
                <Image
                  src={appLogo}
                  alt={appName}
                  width={48}
                  height={48}
                  className="rounded-lg border bg-secondary shrink-0 w-12 h-12 object-cover"
                  unoptimized
                />
              ) : (
                <div className="w-12 h-12 rounded-lg border bg-secondary flex items-center justify-center text-base font-semibold text-muted-foreground/60 shrink-0">
                  {(appName || "?").charAt(0).toUpperCase()}
                </div>
              )}
              <div className="min-w-0">
                <p className="text-base font-semibold leading-tight truncate text-foreground">
                  {appName}
                </p>
                {data.packageName ? (
                  <p className="text-xs text-muted-foreground truncate font-mono">
                    {data.packageName}
                  </p>
                ) : null}
              </div>
            </div>

            <div className="absolute -top-11 -right-10 bg-gradient-to-bl from-emerald-500/40 to-emerald-500/0 rounded-full flex items-center justify-center pointer-events-none group-hover:scale-110 group-hover:from-emerald-500 group-hover:to-emerald-500/30 transition-transform p-12 duration-500">
              <ArrowRight
                className="absolute top-12 right-12 text-emerald-600 group-hover:text-white group-hover:-rotate-45 duration-300"
                size={24}
              />
            </div>
          </CardHeader>

          <CardContent className="p-3 sm:p-5 pt-0 space-y-4 flex-grow">
            <div className="flex flex-row flex-wrap items-center gap-2">
              {showOwner ? (
                <div className="inline-flex items-center gap-1.5 rounded-full bg-secondary/50 px-2 py-1 border border-border/40">
                  <Avatar className="h-5 w-5 ring-1 ring-border/40">
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
                  <span className="text-xs font-medium text-foreground/80 truncate max-w-[120px]">
                    {data.appOwnerName}
                  </span>
                  <span className="inline-flex items-center px-1 py-0.5 rounded-md bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-[10px] font-bold">
                    L{data.appOwnerLevel}
                  </span>
                  {data.eliteBadge ? (
                    <span className="-mr-0.5">
                      <EliteBadge size="sm" />
                    </span>
                  ) : null}
                </div>
              ) : null}
              <Badge className="text-xs bg-emerald-500 hover:bg-emerald-500 text-white">
                Available
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Metric label="Testers Joined" value={currentTester} />
              <Metric label="Total Slots" value={totalTester} />
            </div>
          </CardContent>

          <CardFooter className="px-5 pb-5 pt-0 text-xs text-muted-foreground flex justify-between">
            <span>
              Days in test:{" "}
              <span className="font-bold text-foreground">{totalDay}</span>
            </span>
            <span>
              Avg tester rating:{" "}
              <span className="font-bold text-foreground">
                {data.averageRating > 0
                  ? data.averageRating.toFixed(1)
                  : "N/A"}
              </span>
            </span>
          </CardFooter>
        </Card>
      </Link>
    </div>
  );
}
