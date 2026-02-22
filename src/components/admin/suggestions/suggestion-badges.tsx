import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function StatusBadge({ status }: { status: string }) {
  const getStatusStyles = () => {
    switch (status) {
      case "IMPLEMENTED":
        return "bg-green-500/20 text-green-700 dark:bg-green-500/10 dark:text-green-400 border-green-500/30";
      case "PENDING":
        return "bg-blue-500/20 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400 border-blue-500/30";
      case "REVIEWED":
        return "bg-amber-500/20 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400 border-amber-500/30";
      case "REJECTED":
        return "bg-red-500/20 text-red-700 dark:bg-red-500/10 dark:text-red-400 border-red-500/30";
      default:
        return "bg-secondary text-secondary-foreground";
    }
  };

  return (
    <Badge
      variant="outline"
      className={cn("font-medium border", getStatusStyles())}
    >
      {status}
    </Badge>
  );
}

export function TypeBadge({ type }: { type: string }) {
  const getTypeStyles = () => {
    switch (type) {
      case "BUG":
        return "bg-red-500/20 text-red-700 dark:bg-red-500/10 dark:text-red-400 border-red-500/30";
      case "SUGGESTIONS":
        return "bg-blue-500/20 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400 border-blue-500/30";
      case "PRAISE":
        return "bg-green-500/20 text-green-700 dark:bg-green-500/10 dark:text-green-400 border-green-500/30";
      default:
        return "bg-secondary text-secondary-foreground";
    }
  };

  return (
    <Badge
      variant="outline"
      className={cn("font-medium border text-xs", getTypeStyles())}
    >
      {type}
    </Badge>
  );
}
