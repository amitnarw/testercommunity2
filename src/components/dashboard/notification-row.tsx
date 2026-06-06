"use client";

import { formatDistanceToNow } from "date-fns";
import {
  Gift,
  MessageSquare,
  CheckCircle2,
  Bug,
  Star,
  ArrowUpRight,
  Bell,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { NotificationResponse } from "@/lib/types";

interface NotificationRowProps {
  notification: NotificationResponse;
}

const config: Record<
  string,
  { icon: typeof Bell; color: string; bg: string }
> = {
  NEW_TEST: {
    icon: Gift,
    color: "text-amber-500",
    bg: "bg-amber-500/10",
  },
  FEEDBACK_RECEIVED: {
    icon: MessageSquare,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  },
  TEST_COMPLETED: {
    icon: CheckCircle2,
    color: "text-green-500",
    bg: "bg-green-500/10",
  },
  BUG_REPORT: {
    icon: Bug,
    color: "text-red-500",
    bg: "bg-red-500/10",
  },
  POINTS_AWARDED: {
    icon: Star,
    color: "text-amber-500",
    bg: "bg-amber-500/10",
  },
  APP_SUBMISSION: {
    icon: ArrowUpRight,
    color: "text-indigo-500",
    bg: "bg-indigo-500/10",
  },
  OTHER: {
    icon: Bell,
    color: "text-muted-foreground",
    bg: "bg-muted",
  },
};

export function NotificationRow({ notification }: NotificationRowProps) {
  const c = config[notification.type] || config.OTHER;
  const Icon = c.icon;
  const isUnread = notification.isActive;

  return (
    <div
      className={cn(
        "relative flex items-start gap-3 p-2.5 rounded-xl transition-all duration-200",
        isUnread ? "bg-card/80" : "hover:bg-muted/40",
      )}
    >
      <div className={cn("rounded-xl p-2.5 shrink-0", c.bg)}>
        <Icon className={cn("w-4 h-4", c.color)} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <p
            className={cn(
              "text-sm truncate",
              isUnread ? "font-semibold text-foreground" : "font-medium text-foreground/80",
            )}
          >
            {notification.title}
          </p>
          {isUnread && (
            <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-indigo-500" />
          )}
        </div>
        <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
          {notification.description}
        </p>
        <p className="text-[10px] text-muted-foreground/50 mt-0.5">
          {formatDistanceToNow(new Date(notification.createdAt), {
            addSuffix: true,
          })}
        </p>
      </div>
    </div>
  );
}
