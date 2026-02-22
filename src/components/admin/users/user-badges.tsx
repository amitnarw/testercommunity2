import { Badge } from "@/components/ui/badge";

export function StatusBadge({ status }: { status: string }) {
  return (
    <Badge
      variant={
        status === "Banned" || status === "Inactive"
          ? "destructive"
          : "secondary"
      }
      className={
        status === "Active"
          ? "bg-green-500/20 text-green-700 dark:bg-green-500/10 dark:text-green-400"
          : ""
      }
    >
      {status}
    </Badge>
  );
}

export function RoleBadge({ role }: { role: string }) {
  // Helper function to format role name for display
  const formatRoleName = (roleName: string): string => {
    const roleDisplayNames: Record<string, string> = {
      super_admin: "Super Admin",
      admin: "Admin",
      moderator: "Moderator",
      support: "Support",
      tester: "Tester",
      user: "User",
    };
    return roleDisplayNames[roleName] || roleName;
  };

  const getRoleStyles = () => {
    switch (role) {
      case "super_admin":
        return "bg-purple-500/20 text-purple-700 dark:bg-purple-500/10 dark:text-purple-400";
      case "admin":
        return "bg-amber-500/20 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400";
      case "moderator":
        return "bg-blue-500/20 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400";
      case "support":
        return "bg-pink-500/20 text-pink-700 dark:bg-pink-500/10 dark:text-pink-400";
      case "tester":
        return "bg-green-500/20 text-green-700 dark:bg-green-500/10 dark:text-green-400";
      default:
        return "bg-secondary text-secondary-foreground";
    }
  };

  return (
    <Badge variant="outline" className={getRoleStyles()}>
      {formatRoleName(role)}
    </Badge>
  );
}
