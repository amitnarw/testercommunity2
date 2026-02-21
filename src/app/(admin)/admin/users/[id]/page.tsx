"use client";

import { notFound, useParams } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Mail,
  Phone,
  Shield,
  CheckCircle,
  Bug,
  Lightbulb,
  Edit,
  Trash2,
  Loader2,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { BackButton } from "@/components/back-button";
import {
  useUserById,
  useUpdateUserRole,
  useUpdateUserStatus,
} from "@/hooks/useAdmin";
import { useQueryClient } from "@tanstack/react-query";

export default function AdminUserDetailsPage() {
  const params = useParams();
  const id = params.id as string;
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch the real user data
  const { data: user, isLoading, isError } = useUserById(id);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [roleSelection, setRoleSelection] = useState<string>("");
  const [statusSelection, setStatusSelection] = useState<string>("");

  useEffect(() => {
    if (user) {
      setRoleSelection(user.role);
      setStatusSelection(user.status);
    }
  }, [user]);

  const updateRoleMutation = useUpdateUserRole({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["useUserById", id] });
      queryClient.invalidateQueries({ queryKey: ["useAllUsers"] });
      queryClient.invalidateQueries({ queryKey: ["useUserCounts"] });
      toast({
        title: "Profile Updated",
        description: `User's role has been successfully updated.`,
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update user role.",
        variant: "destructive",
      });
    },
  });

  const updateStatusMutation = useUpdateUserStatus({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["useUserById", id] });
      queryClient.invalidateQueries({ queryKey: ["useAllUsers"] });
      queryClient.invalidateQueries({ queryKey: ["useUserCounts"] });
      toast({
        title: "Profile Updated",
        description: `User's status has been successfully updated.`,
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update user status.",
        variant: "destructive",
      });
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (isError || !user) {
    notFound();
  }

  const handleSaveChanges = () => {
    if (roleSelection !== user.role) {
      updateRoleMutation.mutate({ id: user.id, role: roleSelection });
    }
    if (statusSelection !== user.status) {
      updateStatusMutation.mutate({
        id: user.id,
        status: statusSelection,
        banReason: statusSelection === "Banned" ? "Banned by admin" : undefined,
      });
    }
    setIsEditModalOpen(false);
  };

  const isTester = user.role === "tester";
  const isSuperAdmin =
    typeof document !== "undefined"
      ? document.cookie
          .split("; ")
          .find((row) => row.startsWith("userRole="))
          ?.split("=")[1] === "Super+Admin"
      : false;

  // Formatting helpers
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

  return (
    <>
      <div className="container mx-auto px-4 md:px-6">
        <div className="sticky top-0 z-[50] pt-2 sm:pt-3 pb-4 w-1/2">
          <BackButton href="/admin/users" />
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center justify-between gap-4 w-full">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-br from-primary to-primary/10 bg-clip-text text-transparent">
                User Details
              </h2>
            </div>
            <div className="flex gap-2 sm:gap-4">
              <Button
                variant="outline"
                className="px-3"
                onClick={() => {
                  setRoleSelection(user.role);
                  setStatusSelection(user.status);
                  setIsEditModalOpen(true);
                }}
              >
                <Edit className="sm:mr-2 !h-3 !w-3 sm:!h-4 sm:!w-4" />
                <span className="hidden sm:block">Edit Profile</span>
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-10">
          <div className="lg:col-span-1 space-y-8">
            <Card>
              <CardContent className="pt-6 flex flex-col items-center text-center">
                <Avatar className="h-24 w-24 mb-4 border border-border">
                  <AvatarImage src={user.image || ""} />
                  <AvatarFallback>{user.name?.charAt(0) || "U"}</AvatarFallback>
                </Avatar>
                <h3 className="text-xl font-bold">{user.name}</h3>
                <p className="text-sm text-muted-foreground">{user.email}</p>
                <div className="flex gap-2 mt-4">
                  <Badge variant="secondary">{formatRoleName(user.role)}</Badge>
                  <Badge
                    variant={
                      user.status === "Banned" || user.status === "Inactive"
                        ? "destructive"
                        : "secondary"
                    }
                    className={
                      user.status === "Active"
                        ? "bg-green-500/20 text-green-700 dark:bg-green-500/10 dark:text-green-400"
                        : ""
                    }
                  >
                    {user.status}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <a href={`mailto:${user.email}`} className="hover:underline">
                    {user.email}
                  </a>
                </div>
                {user.phone && (
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <span>{user.phone}</span>
                  </div>
                )}
              </CardContent>
            </Card>

            {isTester && (
              <Card>
                <CardHeader>
                  <CardTitle>Tester Stats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" /> Tests Completed
                    </span>
                    <span className="font-bold text-lg">0</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground flex items-center gap-2">
                      <Bug className="w-4 h-4" /> Bugs Reported
                    </span>
                    <span className="font-bold text-lg">0</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground flex items-center gap-2">
                      <Lightbulb className="w-4 h-4" /> Suggestions Made
                    </span>
                    <span className="font-bold text-lg">0</span>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
          <div className="lg:col-span-2 space-y-8">
            {!isTester && (
              <Card>
                <CardHeader>
                  <CardTitle>User Activity</CardTitle>
                  <CardDescription>
                    Recent app submissions by this user.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-muted-foreground text-sm">
                    Data fetching for user app submissions is not yet fully
                    implemented on this page.
                  </div>
                </CardContent>
              </Card>
            )}
            {isTester && (
              <Card>
                <CardHeader>
                  <CardTitle>Recent Project History</CardTitle>
                  <CardDescription>
                    Projects this tester has contributed to.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-muted-foreground text-sm">
                    Data fetching for tester project history is not yet fully
                    implemented on this page.
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit {user.name}</DialogTitle>
            <DialogDescription>
              Modify the user's role and status.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="space-y-2">
              <label>Role</label>
              <Select
                value={roleSelection}
                onValueChange={(value) => setRoleSelection(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="tester">Tester</SelectItem>
                  <SelectItem value="support">Support</SelectItem>
                  <SelectItem value="moderator">Moderator</SelectItem>
                  <SelectItem value="admin" disabled={!isSuperAdmin}>
                    Admin {!isSuperAdmin && "(Super Admin only)"}
                  </SelectItem>
                  {isSuperAdmin && (
                    <SelectItem value="super_admin">Super Admin</SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label>Status</label>
              <Select
                value={statusSelection}
                onValueChange={(value) => setStatusSelection(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                  <SelectItem value="Banned">Banned</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="ghost"
              onClick={() => {
                setIsEditModalOpen(false);
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveChanges}
              disabled={
                updateRoleMutation.isPending || updateStatusMutation.isPending
              }
            >
              {(updateRoleMutation.isPending ||
                updateStatusMutation.isPending) && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
