"use client";

import { Bell, ChevronRight } from "lucide-react";
import { AutoTransitionLink } from "@/components/auto-transition-link";
import { NotificationRow } from "@/components/dashboard/notification-row";
import { EmptyFeed } from "@/components/dashboard/empty-feed";
import { ROUTES } from "@/lib/routes";
import type { NotificationResponse } from "@/lib/types";
import { StatLabel } from "../ui/stat-label";

interface NotificationsCardProps {
  notifications: NotificationResponse[];
  totalUnread: number;
}

export function NotificationsCard({ notifications, totalUnread }: NotificationsCardProps) {
  return (
    <div className="rounded-[2.5rem] border border-border/30 bg-card p-6 overflow-hidden">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <StatLabel>Notifications</StatLabel>
          {totalUnread > 0 && (
            <span className="text-[10px] font-semibold text-indigo-500 bg-indigo-500/10 px-1.5 py-0.5 rounded-full leading-none">
              {totalUnread}
            </span>
          )}
        </div>
        <AutoTransitionLink
          href={ROUTES.AUTHENTICATED.NOTIFICATIONS}
          className="text-xs text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
        >
          View All <ChevronRight className="w-3 h-3" />
        </AutoTransitionLink>
      </div>
      <div className="divide-y divide-slate-100 dark:divide-white/[0.08]">
        {notifications.length > 0 ? (
          notifications.map((n) => (
            <NotificationRow key={n.id} notification={n} />
          ))
        ) : (
          <EmptyFeed
            icon={Bell}
            title="No notifications yet"
            description="Start by submitting an app for testing."
          />
        )}
      </div>
    </div>
  );
}
