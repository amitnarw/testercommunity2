"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { DollarSign, Users2 } from "lucide-react";

interface AppTypeBadgeProps {
  appType: "PAID" | "FREE" | string;
  size?: "sm" | "md" | "lg";
  showIcon?: boolean;
  className?: string;
}

/**
 * A consistent badge component for displaying app type (PAID/FREE) across admin pages.
 * - PAID (Professional): Amber/Gold color scheme
 * - FREE (Community): Blue color scheme
 */
export function AppTypeBadge({ 
  appType, 
  size = "md", 
  showIcon = true,
  className 
}: AppTypeBadgeProps) {
  const isPaid = appType === "PAID";
  
  const sizeClasses = {
    sm: "text-[10px] px-1.5 py-0.5",
    md: "text-xs px-2 py-1",
    lg: "text-sm px-3 py-1.5",
  };

  return (
    <Badge
      variant={isPaid ? "default" : "secondary"}
      className={cn(
        "font-medium border",
        sizeClasses[size],
        isPaid 
          ? "bg-amber-500/20 text-amber-600 dark:text-amber-400 hover:bg-amber-500/30 border-amber-500/30" 
          : "bg-blue-500/20 text-blue-600 dark:text-blue-400 hover:bg-blue-500/30 border-blue-500/30",
        className
      )}
    >
      {showIcon && (
        isPaid 
          ? <DollarSign className="w-3 h-3 mr-1" /> 
          : <Users2 className="w-3 h-3 mr-1" />
      )}
      {isPaid ? "PRO" : "FREE"}
    </Badge>
  );
}

interface StatusBadgeProps {
  status: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

/**
 * A consistent badge component for displaying submission status across admin pages.
 */
export function StatusBadge({ status, size = "md", className }: StatusBadgeProps) {
  const getStatusStyles = () => {
    switch (status) {
      case "ACCEPTED":
      case "AVAILABLE":
      case "IN_TESTING":
      case "COMPLETED":
        return "bg-green-500/20 text-green-700 dark:bg-green-500/10 dark:text-green-400 border-green-500/30";
      case "REJECTED":
        return "bg-red-500/20 text-red-700 dark:bg-red-500/10 dark:text-red-400 border-red-500/30";
      case "IN_REVIEW":
        return "bg-amber-500/20 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400 border-amber-500/30";
      case "DRAFT":
        return "bg-gray-500/20 text-gray-700 dark:bg-gray-500/10 dark:text-gray-400 border-gray-500/30";
      case "ON_HOLD":
        return "bg-purple-500/20 text-purple-700 dark:bg-purple-500/10 dark:text-purple-400 border-purple-500/30";
      case "REQUESTED":
        return "bg-cyan-500/20 text-cyan-700 dark:bg-cyan-500/10 dark:text-cyan-400 border-cyan-500/30";
      default:
        return "bg-secondary text-secondary-foreground border-border";
    }
  };

  const sizeClasses = {
    sm: "text-[10px] px-1.5 py-0.5",
    md: "text-xs px-2 py-1",
    lg: "text-sm px-3 py-1.5",
  };

  return (
    <Badge
      variant="outline"
      className={cn("font-medium border", sizeClasses[size], getStatusStyles(), className)}
    >
      {status.replace(/_/g, " ")}
    </Badge>
  );
}

interface ServiceTypeCardProps {
  type: "PAID" | "FREE";
  title: string;
  description: string;
  count: number;
  isSelected?: boolean;
  onClick?: () => void;
}

/**
 * A card component for filtering by service type (PAID/FREE) in admin pages.
 */
export function ServiceTypeCard({ 
  type, 
  title, 
  description, 
  count, 
  isSelected, 
  onClick 
}: ServiceTypeCardProps) {
  const isPaid = type === "PAID";
  const Icon = isPaid ? DollarSign : Users2;
  
  return (
    <div
      onClick={onClick}
      className={cn(
        "cursor-pointer transition-all hover:shadow-md rounded-lg border p-4",
        isPaid ? "border-amber-500/20" : "border-blue-500/20",
        isSelected && isPaid && "ring-2 ring-amber-500 bg-amber-500/5",
        isSelected && !isPaid && "ring-2 ring-blue-500 bg-blue-500/5",
        !isSelected && "hover:border-primary/50"
      )}
    >
      <div className="flex items-center gap-3">
        <div className={cn(
          "p-2 rounded-lg",
          isPaid ? "bg-amber-500/10" : "bg-blue-500/10"
        )}>
          <Icon className={cn(
            "h-5 w-5",
            isPaid ? "text-amber-500" : "text-blue-500"
          )} />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">{title}</span>
            <AppTypeBadge appType={type} size="sm" showIcon={false} />
          </div>
          <p className="text-xs text-muted-foreground">{description}</p>
          <p className="text-2xl font-bold mt-1">{count}</p>
        </div>
      </div>
    </div>
  );
}
