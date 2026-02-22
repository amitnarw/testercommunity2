"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, Users, Search, Smartphone } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useAllUsers } from "@/hooks/useAdmin";
import { useMutation } from "@tanstack/react-query";
import { assignTestersToApp } from "@/lib/apiCalls";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";

interface AdminManageTestersDialogProps {
  appId: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  totalRequired: number;
  currentAssigned: number;
}

export function AdminManageTestersDialog({
  appId,
  open,
  onOpenChange,
  onSuccess,
  totalRequired,
  currentAssigned,
}: AdminManageTestersDialogProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTesterIds, setSelectedTesterIds] = useState<string[]>([]);

  // Use existing endpoint to fetch users. We can filter for only users who aren't admins in the frontend for now,
  // or pass a specific role parameter to the backend if supported.
  const { data: usersData, isLoading: isLoadingUsers } = useAllUsers({
    role: "USER",
  });

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
    usersData?.data?.filter(
      (user: any) => user.role === "USER" && user.userDetail?.banned === false,
    ) || [];

  const filteredUsers = availableUsers.filter((user: any) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      user.name?.toLowerCase().includes(searchLower) ||
      user.email?.toLowerCase().includes(searchLower) ||
      user.userDetail?.device_company?.toLowerCase().includes(searchLower) ||
      user.userDetail?.device_model?.toLowerCase().includes(searchLower)
    );
  });

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
      <DialogContent className="w-[95vw] sm:max-w-[700px] h-[90vh] sm:h-[80vh] flex flex-col rounded-3xl overflow-hidden p-0 gap-0 border-none shadow-2xl bg-white dark:bg-[#1A1A1A]">
        <div className="bg-primary/5 p-6 border-b border-primary/10 shrink-0">
          <DialogHeader>
            <DialogTitle className="text-primary flex items-center gap-2">
              <Users className="w-5 h-5" />
              Manage Testers
            </DialogTitle>
            <DialogDescription>
              Select testers from the pool to assign to this application.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4 flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search testers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 bg-background"
              />
            </div>
            <div className="flex gap-2">
              <Badge
                variant="outline"
                className="px-3 py-1 text-sm bg-background"
              >
                {currentAssigned} / {totalRequired} Currently Assigned
              </Badge>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-hidden relative bg-muted/10">
          <ScrollArea className="h-full px-6 py-4">
            {isLoadingUsers ? (
              <div className="flex items-center justify-center h-40">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                No testers found matching your search.
              </div>
            ) : (
              <div className="space-y-3 pb-6">
                {filteredUsers.map((user: any) => {
                  const isSelected = selectedTesterIds.includes(user.id);
                  return (
                    <div
                      key={user.id}
                      className={`flex items-center gap-4 p-3 rounded-xl border transition-all cursor-pointer hover:bg-muted/50 ${isSelected ? "bg-primary/5 border-primary/40 ring-1 ring-primary/20" : "bg-card border-border"}`}
                      onClick={() => handleToggleSelect(user.id)}
                    >
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={() => handleToggleSelect(user.id)}
                        className="data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground pointer-events-none"
                      />

                      <Avatar className="h-10 w-10 border border-border">
                        <AvatarImage src={user.image || ""} />
                        <AvatarFallback className="bg-primary/10 text-primary font-medium">
                          {user.name?.charAt(0) || "U"}
                        </AvatarFallback>
                      </Avatar>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 flex-1 items-center">
                        <div className="flex flex-col truncate">
                          <span className="font-medium text-sm truncate">
                            {user.name || "Unknown"}
                          </span>
                          <span className="text-xs text-muted-foreground truncate">
                            {user.email}
                          </span>
                        </div>

                        <div className="hidden sm:flex flex-col truncate items-start">
                          <span className="text-xs font-medium text-muted-foreground">
                            Experience
                          </span>
                          <span className="text-xs truncate">
                            {user?.userDetail?.experience_level ||
                              "Not specified"}
                          </span>
                        </div>

                        <div className="hidden sm:flex flex-col truncate items-start">
                          <span className="text-xs font-medium text-muted-foreground mb-1">
                            Device
                          </span>
                          <Badge
                            variant="outline"
                            className="font-normal text-[10px] gap-1 px-1.5 py-0"
                          >
                            <Smartphone className="w-3 h-3 opacity-70" />
                            <span className="truncate max-w-[80px]">
                              {user?.userDetail?.device_company ||
                              user?.userDetail?.device_model
                                ? `${user?.userDetail?.device_company} ${user?.userDetail?.device_model}`
                                : "N/A"}
                            </span>
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

        <div className="p-4 border-t bg-background shrink-0 flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            {slotsSelected} Selected
          </span>
          <div className="flex gap-3">
            <Button variant="ghost" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleAssign}
              disabled={slotsSelected === 0 || assignTestersMutation.isPending}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {assignTestersMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Assigning...
                </>
              ) : (
                `Assign Testers`
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
