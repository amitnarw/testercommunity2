"use client";

import { ExternalLink, Camera, CalendarDays } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SafeImage } from "@/components/safe-image";
import Link from "next/link";

interface MyTaskRowProps {
  appId: number;
  appName: string;
  appLogoUrl: string;
  packageName?: string;
  status: string;
  currentDay: number;
  totalDays: number;
  deadline?: string;
  proofRequired: boolean;
}

export function MyTaskRow({
  appId,
  appName,
  appLogoUrl,
  packageName,
  status,
  currentDay,
  totalDays,
  deadline,
  proofRequired,
}: MyTaskRowProps) {
  const statusInfo: Record<string, { label: string; className: string }> = {
    PENDING: { label: "Pending", className: "bg-amber-500/15 text-amber-600 border-amber-500/20" },
    IN_PROGRESS: { label: "In progress", className: "bg-blue-500/15 text-blue-600 border-blue-500/20" },
    COMPLETED: { label: "Completed", className: "bg-emerald-500/15 text-emerald-600 border-emerald-500/20" },
    MISSED: { label: "Missed", className: "bg-orange-500/15 text-orange-600 border-orange-500/20" },
    PENALIZED: { label: "Penalized", className: "bg-red-500/15 text-red-600 border-red-500/20" },
    REPLACED: { label: "Replaced", className: "bg-zinc-500/15 text-zinc-600 border-zinc-500/20" },
    REMOVED: { label: "Removed", className: "bg-zinc-500/15 text-zinc-600 border-zinc-500/20" },
    DROPPED: { label: "Dropped", className: "bg-zinc-500/15 text-zinc-600 border-zinc-500/20" },
  };
  const info = statusInfo[status] ?? statusInfo.PENDING;

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-muted flex-shrink-0">
            {appLogoUrl ? (
              <SafeImage src={appLogoUrl} alt={appName} fill className="object-cover" />
            ) : null}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="font-semibold truncate">{appName}</p>
              <Badge variant="outline" className={info.className}>
                {info.label}
              </Badge>
            </div>
            <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground flex-wrap">
              <span>Day {currentDay} / {totalDays}</span>
              {deadline && (
                <span className="inline-flex items-center gap-1">
                  <CalendarDays className="w-3 h-3" />
                  Due {new Date(deadline).toLocaleDateString()}
                </span>
              )}
              {proofRequired && (
                <span className="inline-flex items-center gap-1">
                  <Camera className="w-3 h-3" />
                  Screenshot required
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            {packageName && (
              <Link href={`https://play.google.com/store/apps/details?id=${packageName}`} target="_blank" rel="noopener noreferrer">
                <Button size="sm" variant="outline">
                  <ExternalLink className="w-4 h-4 mr-1" />
                  Open
                </Button>
              </Link>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
