import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Users, Clock, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export function QuickActions({ stats }: { stats: any }) {
  // Dynamic quick actions with counts
  const dynamicQuickActions = [
    {
      title: "Paid Apps",
      description: "Paid submissions awaiting review",
      icon: Clock,
      href: "/admin/submissions-paid",
      color: "text-amber-500",
      bgColor: "bg-amber-500/10",
      count: stats?.submissionsByAppType?.PAID || 0,
      countBadgeColor: "bg-amber-500/20 text-amber-600",
    },
    {
      title: "Free Apps (Community)",
      description: "Community submissions awaiting review",
      icon: Clock,
      href: "/admin/submissions-free",
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
      count: stats?.submissionsByAppType?.FREE || 0,
      countBadgeColor: "bg-blue-500/20 text-blue-600",
    },
    {
      title: "Manage Users",
      description: "View & manage platform users",
      icon: Users,
      href: "/admin/users",
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      title: "Send Notification",
      description: "Broadcast to all users",
      icon: AlertCircle,
      href: "/admin/notifications",
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
    },
  ];

  return (
    <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4">
      {dynamicQuickActions.map((action) => (
        <Link key={action.href} href={action.href}>
          <Card className="hover:shadow-md transition-shadow cursor-pointer h-full border-none bg-white/50 dark:bg-white/5 backdrop-blur-sm relative overflow-hidden group">
            {/* Background Watermark Icon - Mobile Only */}
            <div className="absolute -right-2 -bottom-2 opacity-5 sm:hidden pointer-events-none transition-transform duration-500 group-hover:scale-110">
              <action.icon
                className={cn("h-16 w-16 rotate-12", action.color)}
              />
            </div>

            <CardContent className="p-2.5 sm:p-4 h-full flex items-center relative z-10">
              <div className="flex items-center gap-2 sm:gap-3 w-full">
                {/* Foreground Icon - Desktop Only */}
                <div
                  className={cn(
                    "hidden sm:flex p-2 rounded-xl shrink-0",
                    action.bgColor,
                  )}
                >
                  <action.icon className={cn("h-5 w-5", action.color)} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-1">
                    <p className="font-bold text-[11px] sm:text-sm text-foreground leading-tight mb-0.5">
                      {action.title}
                    </p>
                    {action.count !== undefined && (
                      <span
                        className={cn(
                          "text-[9px] sm:text-[10px] font-bold px-1.5 py-0.5 rounded-full shrink-0",
                          action.countBadgeColor ||
                            "bg-primary/10 text-primary",
                        )}
                      >
                        {action.count}
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] sm:text-[11px] text-muted-foreground truncate">
                    {action.description}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}
