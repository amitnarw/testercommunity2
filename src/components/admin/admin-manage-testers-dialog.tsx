"use client";

import { useState, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Loader2,
  Users,
  Search,
  Smartphone,
  Activity,
  CheckCircle2,
  Clock,
  ExternalLink,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useAllUsers } from "@/hooks/useAdmin";
import { useMutation } from "@tanstack/react-query";
import { assignTestersToApp } from "@/lib/apiCalls";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";

interface AdminManageTestersDialogProps {
  appId: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  totalRequired: number;
  currentAssigned: number;
  assignedTesterIds?: string[];
}

const AVAILABILITY_CONFIG: Record<
  string,
  { label: string; color: string; dotClass: string }
> = {
  AVAILABLE: {
    label: "Available",
    color: "text-green-600 dark:text-green-400",
    dotClass: "bg-green-500",
  },
  BUSY: {
    label: "Busy",
    color: "text-yellow-600 dark:text-yellow-400",
    dotClass: "bg-yellow-500",
  },
  AWAY: {
    label: "Away",
    color: "text-orange-600 dark:text-orange-400",
    dotClass: "bg-orange-500",
  },
  DO_NOT_DISTURB: {
    label: "Do Not Disturb",
    color: "text-red-600 dark:text-red-400",
    dotClass: "bg-red-500",
  },
};

function AvailabilityDot({ status }: { status: string }) {
  const config = AVAILABILITY_CONFIG[status] || AVAILABILITY_CONFIG.AVAILABLE;
  return (
    <span
      className={`inline-block w-2.5 h-2.5 rounded-full ${config.dotClass} ring-2 ring-background shrink-0`}
      title={config.label}
    />
  );
}

export function AdminManageTestersDialog({
  appId,
  open,
  onOpenChange,
  onSuccess,
  totalRequired,
  currentAssigned,
  assignedTesterIds = [],
}: AdminManageTestersDialogProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTesterIds, setSelectedTesterIds] = useState<string[]>([]);

  // Only fetch testers when the modal is open (lazy load)
  const { data: usersData, isLoading: isLoadingUsers } = useAllUsers(
    { role: "tester" },
    { enabled: open },
  );

  const assignTestersMutation = useMutation({
    mutationFn: (testerIds: string[]) =>
      assignTestersToApp({
        id: appId.toString(),
        testerIds,
      }),
    onSuccess: () => {
      toast({
        title: "Testers Assigned",
        description: `Successfully assigned ${selectedTesterIds.length} testers.`,
      });
      setSelectedTesterIds([]);
      onOpenChange(false);
      onSuccess?.();
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Assignment Failed",
        description: error.message || "Failed to assign testers.",
      });
    },
  });

  const availableUsers =
    usersData?.filter(
      (user: any) =>
        user.status !== "Banned" && !assignedTesterIds.includes(user.id),
    ) || [];

  const filteredUsers = availableUsers.filter((user: any) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      user.name?.toLowerCase().includes(searchLower) ||
      user.email?.toLowerCase().includes(searchLower) ||
      user.device?.toLowerCase().includes(searchLower)
    );
  });

  // Sort: Available first, then by fewest active tests
  const sortedUsers = useMemo(() => {
    const availabilityOrder: Record<string, number> = {
      AVAILABLE: 0,
      BUSY: 1,
      AWAY: 2,
      DO_NOT_DISTURB: 3,
    };

    return [...filteredUsers].sort((a: any, b: any) => {
      const aOrder = availabilityOrder[a.availability] ?? 4;
      const bOrder = availabilityOrder[b.availability] ?? 4;
      if (aOrder !== bOrder) return aOrder - bOrder;
      return (a.activeTests || 0) - (b.activeTests || 0);
    });
  }, [filteredUsers]);

  const handleToggleSelect = (userId: string) => {
    setSelectedTesterIds((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId],
    );
  };

  const handleAssign = () => {
    if (selectedTesterIds.length === 0) return;
    assignTestersMutation.mutate(selectedTesterIds);
  };

  const slotsRemaining = Math.max(0, totalRequired - currentAssigned);
  const slotsSelected = selectedTesterIds.length;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-[750px] h-[92vh] sm:h-[80vh] flex flex-col rounded-2xl sm:rounded-3xl overflow-hidden p-0 gap-0 border-none shadow-2xl bg-white dark:bg-[#1A1A1A]">
        {/* Header */}
        <div className="bg-primary/5 px-4 py-4 sm:p-6 border-b border-primary/10 shrink-0">
          <DialogHeader>
            <DialogTitle className="text-primary flex items-center gap-2 text-base sm:text-lg">
              <Users className="w-4 h-4 sm:w-5 sm:h-5" />
              Manage Testers
            </DialogTitle>
            <DialogDescription className="text-xs sm:text-sm">
              Select testers to assign. Sorted by availability and workload.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-3 sm:mt-4 flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-center justify-between">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search name, email, device..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 bg-background h-9 text-sm"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              <Badge
                variant="outline"
                className="px-2.5 py-0.5 text-xs bg-background"
              >
                {currentAssigned}/{totalRequired} Assigned
              </Badge>
              {slotsRemaining > 0 && (
                <Badge
                  variant="outline"
                  className="px-2.5 py-0.5 text-xs bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800"
                >
                  {slotsRemaining} Open
                </Badge>
              )}
            </div>
          </div>
          {/* Legend - hidden on very small screens */}
          <div className="mt-2.5 hidden xs:flex gap-3 sm:gap-4 flex-wrap text-[10px] sm:text-[11px] text-muted-foreground">
            {Object.entries(AVAILABILITY_CONFIG).map(([key, config]) => (
              <span key={key} className="flex items-center gap-1">
                <span
                  className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${config.dotClass}`}
                />
                {config.label}
              </span>
            ))}
          </div>
        </div>

        {/* Tester List */}
        <div className="flex-1 overflow-hidden relative bg-muted/10">
          <ScrollArea className="h-full px-3 sm:px-6 py-3 sm:py-4">
            {isLoadingUsers ? (
              <div className="flex items-center justify-center h-40">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
              </div>
            ) : sortedUsers.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground text-sm">
                No testers found matching your search.
              </div>
            ) : (
              <div className="space-y-2 sm:space-y-3 pb-4">
                {sortedUsers.map((user: any) => {
                  const isSelected = selectedTesterIds.includes(user.id);
                  const availConfig =
                    AVAILABILITY_CONFIG[user.availability] ||
                    AVAILABILITY_CONFIG.AVAILABLE;

                  return (
                    <div
                      key={user.id}
                      className={`flex items-start sm:items-center gap-2.5 sm:gap-4 p-3 sm:p-3.5 rounded-xl border transition-all cursor-pointer active:scale-[0.98] hover:bg-muted/50 ${isSelected ? "bg-primary/5 border-primary/40 ring-1 ring-primary/20" : "bg-card border-border"}`}
                      onClick={() => handleToggleSelect(user.id)}
                    >
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={() => handleToggleSelect(user.id)}
                        className="data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground pointer-events-none mt-1 sm:mt-0 shrink-0"
                      />

                      {/* Avatar with availability dot */}
                      <div className="relative shrink-0">
                        <Avatar className="h-9 w-9 sm:h-10 sm:w-10 border border-border">
                          <AvatarImage src={user.image || ""} />
                          <AvatarFallback className="bg-primary/10 text-primary font-medium text-sm">
                            {user.name?.charAt(0) || "U"}
                          </AvatarFallback>
                        </Avatar>
                        <span className="absolute -bottom-0.5 -right-0.5">
                          <AvailabilityDot status={user.availability} />
                        </span>
                      </div>

                      {/* Content — stacked on mobile, grid on desktop */}
                      <div className="flex-1 min-w-0">
                        {/* Top row: name + view details */}
                        <div className="flex items-center justify-between gap-2">
                          <div className="min-w-0">
                            <span className="font-medium text-sm truncate block">
                              {user.name || "Unknown"}
                            </span>
                            <span className="text-[11px] sm:text-xs text-muted-foreground truncate block">
                              {user.email}
                            </span>
                          </div>
                          <Link
                            href={`/admin/users/${user.id}`}
                            target="_blank"
                            onClick={(e) => e.stopPropagation()}
                            title="View tester details"
                            className="shrink-0"
                          >
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-muted-foreground hover:text-primary"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </Button>
                          </Link>
                        </div>

                        {/* Bottom row: stats — always visible */}
                        <div className="flex items-center gap-2 sm:gap-3 mt-1.5 flex-wrap">
                          <div className="flex items-center gap-1">
                            <Activity className="w-3 h-3 text-blue-500" />
                            <span className="text-[10px] sm:text-xs font-medium">
                              {user.activeTests || 0}{" "}
                              <span className="text-muted-foreground font-normal">
                                active
                              </span>
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3 text-green-500" />
                            <span className="text-[10px] sm:text-xs font-medium">
                              {user.completedTests || 0}{" "}
                              <span className="text-muted-foreground font-normal">
                                done
                              </span>
                            </span>
                          </div>
                          {user.device && (
                            <Badge
                              variant="outline"
                              className="font-normal text-[9px] sm:text-[10px] gap-0.5 px-1.5 py-0 h-4"
                            >
                              <Smartphone className="w-2.5 h-2.5 opacity-70" />
                              <span className="truncate max-w-[60px] sm:max-w-[90px]">
                                {user.device}
                              </span>
                            </Badge>
                          )}
                          <Badge
                            variant="outline"
                            className={`text-[9px] sm:text-[10px] px-1.5 py-0 h-4 font-medium ${availConfig.color} border-current/20`}
                          >
                            {availConfig.label}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </ScrollArea>
        </div>

        {/* Footer */}
        <div className="px-3 py-3 sm:p-4 border-t bg-background shrink-0 flex items-center justify-between gap-2">
          <span className="text-xs sm:text-sm text-muted-foreground">
            {slotsSelected} Selected
          </span>
          <div className="flex gap-2 sm:gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleAssign}
              disabled={slotsSelected === 0 || assignTestersMutation.isPending}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {assignTestersMutation.isPending ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" />
                  Assigning...
                </>
              ) : (
                "Assign Testers"
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
