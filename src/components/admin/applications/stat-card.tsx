import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export function StatCard({
  title,
  value,
  icon: Icon,
  iconColor,
  bgColor,
  isLoading,
  isActive,
}: {
  title: string;
  value: string | number;
  icon: React.ElementType;
  iconColor: string;
  bgColor: string;
  isLoading?: boolean;
  isActive?: boolean;
}) {
  return (
    <Card
      className={cn(
        "transition-all relative",
        isActive && "ring-2 ring-primary shadow-md",
      )}
    >
      <CardContent className="p-4">
        {/* Background Icon - absolute, scaled up, semi-transparent */}
        <div className="absolute top-0 right-0 p-4 opacity-10 transform scale-150">
          <Icon className={iconColor} />
        </div>
        <div className="flex items-center gap-3">
          {/* Visible Icon for desktop */}
          <div className={cn("p-2 rounded-lg", bgColor, "md:block hidden")}>
            <Icon className={cn("h-5 w-5", iconColor)} />
          </div>
          <div className="flex-1">
            {isLoading ? (
              <Skeleton className="h-6 w-16" />
            ) : (
              <p className="text-2xl font-bold">{value}</p>
            )}
            <p className="text-xs text-muted-foreground">{title}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
