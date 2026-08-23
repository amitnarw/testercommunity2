"use client";

import { Check, Clock, AlertCircle, X, ShieldAlert, RefreshCw } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SafeImage } from "@/components/safe-image";
import { EliteBadge } from "./elite-badge";
import type { TesterStatus } from "@/lib/types";

interface TesterRow {
  id: number;
  status: TesterStatus;
  tester: {
    id: string;
    name: string;
    image: string | null;
    handshakeLevel?: number;
    eliteBadge?: boolean;
    handshakeCompletedCount?: number;
  };
  daysCompleted?: number;
  totalDays?: number;
}

interface TestersTabProps {
  testers: TesterRow[];
  isLoading: boolean;
  title?: string;
}

const STATUS_INFO: Record<
  TesterStatus,
  { label: string; icon: typeof Check; className: string }
> = {
  COMPLETED: { label: "Completed", icon: Check, className: "bg-emerald-500/15 text-emerald-600" },
  IN_PROGRESS: { label: "Testing", icon: Clock, className: "bg-blue-500/15 text-blue-600" },
  PENDING: { label: "Pending", icon: Clock, className: "bg-amber-500/15 text-amber-600" },
  MISSED: { label: "Missed", icon: AlertCircle, className: "bg-orange-500/15 text-orange-600" },
  PENALIZED: { label: "Penalized", icon: ShieldAlert, className: "bg-red-500/15 text-red-600" },
  REPLACED: { label: "Replaced", icon: RefreshCw, className: "bg-zinc-500/15 text-zinc-600" },
  DROPPED: { label: "Dropped", icon: X, className: "bg-zinc-500/15 text-zinc-600" },
  REMOVED: { label: "Removed", icon: X, className: "bg-zinc-500/15 text-zinc-600" },
  REJECTED: { label: "Rejected", icon: X, className: "bg-zinc-500/15 text-zinc-600" },
};

export function TestersTab({ testers, isLoading, title }: TestersTabProps) {
  if (isLoading) {
    return (
      <div className="space-y-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-20 rounded-xl bg-muted animate-pulse" />
        ))}
      </div>
    );
  }

  if (!testers || testers.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border/60 p-8 text-center text-sm text-muted-foreground">
        No testers yet.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {title && (
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
          {title}
        </h3>
      )}
      <div className="space-y-2">
        {testers.map((t) => {
          const info = STATUS_INFO[t.status] ?? STATUS_INFO.PENDING;
          const Icon = info.icon;
          return (
            <Card key={t.id}>
              <CardContent className="p-3">
                <div className="flex items-center gap-3">
                  <div className="relative w-10 h-10 rounded-full overflow-hidden bg-muted flex-shrink-0">
                    {t.tester.image ? (
                      <SafeImage
                        src={t.tester.image}
                        alt={t.tester.name}
                        fill
                        className="object-cover"
                      />
                    ) : null}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-medium truncate">{t.tester.name}</p>
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-primary/10 text-primary">
                        L{t.tester.handshakeLevel ?? 1}
                      </span>
                      {t.tester.eliteBadge && <EliteBadge size="xs" />}
                    </div>
                    {typeof t.daysCompleted === "number" && typeof t.totalDays === "number" && (
                      <p className="text-[11px] text-muted-foreground">
                        Day {t.daysCompleted} of {t.totalDays}
                      </p>
                    )}
                  </div>
                  <Badge variant="outline" className={info.className}>
                    <Icon className="w-3 h-3 mr-1" />
                    {info.label}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
