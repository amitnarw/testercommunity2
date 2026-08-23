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

const config: Record<string, { icon: typeof Bell; color: string }> = {
  NEW_TEST: { icon: Gift, color: "text-amber-500" },
  FEEDBACK_RECEIVED: { icon: MessageSquare, color: "text-blue-500" },
  TEST_COMPLETED: { icon: CheckCircle2, color: "text-green-500" },
  BUG_REPORT: { icon: Bug, color: "text-red-500" },
  POINTS_AWARDED: { icon: Star, color: "text-amber-500" },
  APP_SUBMISSION: { icon: ArrowUpRight, color: "text-indigo-500" },
  OTHER: { icon: Bell, color: "text-muted-foreground" },
};

export function NotificationRow({ notification }: NotificationRowProps) {
  const c = config[notification.type] || config.OTHER;
  const Icon = c.icon;
  const isUnread = notification.isActive;

  return (
    <div
      className={cn(
        "relative flex items-start gap-3 px-2 py-3 rounded-xl transition-colors",
        "hover:bg-slate-100/60 dark:hover:bg-white/[0.04]",
        isUnread && "bg-slate-50 dark:bg-white/[0.03]",
      )}
    >
      <div className="rounded-xl p-2.5 shrink-0 bg-slate-100 dark:bg-white/5 ring-1 ring-slate-200/50 dark:ring-white/10">
        <Icon className={cn("w-4 h-4", c.color)} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <p
            className={cn(
              "text-sm truncate",
              isUnread
                ? "font-semibold text-slate-800 dark:text-white"
                : "font-medium text-slate-800 dark:text-white/80",
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
        <p className="text-[11px] text-muted-foreground/60 mt-0.5">
          {formatDistanceToNow(new Date(notification.createdAt), {
            addSuffix: true,
          })}
        </p>
      </div>
    </div>
  );
}
