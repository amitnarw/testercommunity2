"use client";

import { RefreshCw, ChevronRight, Activity } from "lucide-react";
import { AutoTransitionLink } from "@/components/auto-transition-link";
import { ActivityRow } from "@/components/dashboard/activity-row";
import { EmptyFeed } from "@/components/dashboard/empty-feed";
import { ROUTES } from "@/lib/routes";
import type { UserTransaction } from "@/lib/apiCalls";
import { StatLabel } from "../ui/stat-label";

interface ActivityCardProps {
  groupedTransactions: { label: string; items: UserTransaction[] }[];
}

export function ActivityCard({ groupedTransactions }: ActivityCardProps) {
  return (
    <div className="rounded-[2.5rem] border border-border/30 bg-card/50 p-5">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <StatLabel>Recent Activity</StatLabel>
        </div>
        <AutoTransitionLink
          href={ROUTES.AUTHENTICATED.WALLET}
          className="text-xs text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
        >
          View All <ChevronRight className="w-3 h-3" />
        </AutoTransitionLink>
      </div>
      <div className="space-y-2">
        {groupedTransactions.length > 0 ? (
          groupedTransactions.map((group) => (
            <div key={group.label}>
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1 px-2.5">
                {group.label}
              </p>
              {group.items.map((t) => (
                <ActivityRow key={t.id} transaction={t} />
              ))}
            </div>
          ))
        ) : (
          <EmptyFeed
            icon={Activity}
            title="No wallet activity yet"
            description="Buy a package or submit an app to get started."
            className="py-6"
          />
        )}
      </div>
    </div>
  );
}
