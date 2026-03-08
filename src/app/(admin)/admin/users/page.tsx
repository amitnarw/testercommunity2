"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, CheckCircle, Ban, Loader2 } from "lucide-react";
import { Tabs, TabsList, TabsContent, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AppPagination } from "@/components/app-pagination";
import {
  useAllUsers,
  useUserCounts,
  useUpdateUserStatus,
  useUpdateUserRole,
  useDeleteUser,
} from "@/hooks/useAdmin";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";
import { authClient } from "@/lib/auth-client";

const UserTable = dynamic(
  () =>
    import("@/components/admin/users/user-table").then((mod) => mod.UserTable),
  {
    ssr: false,
    loading: () => (
      <div className="p-8 text-center text-muted-foreground animate-pulse">
        Loading users table...
      </div>
    ),
  },
);

const ITEMS_PER_PAGE = 5;

export default function AdminUsersPage() {
  const queryClient = useQueryClient();
  const { data: session } = authClient.useSession();

  const [userRole, setUserRole] = useState("");
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [banReason, setBanReason] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch users data - pass role filter to API
  const { data: usersData, isLoading } = useAllUsers({
    role: activeTab === "all" ? undefined : activeTab,
    search: searchQuery || undefined,
  });

  // Fetch counts
  const { data: countsData } = useUserCounts();

  // Mutations
  const updateStatusMutation = useUpdateUserStatus({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["useAllUsers"] });
      queryClient.invalidateQueries({ queryKey: ["useUserCounts"] });
      setIsStatusModalOpen(false);
      setBanReason("");
      toast({
        title: "Success",
        description: "User status updated successfully",
      });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to update status",
      });
    },
  });

  const updateRoleMutation = useUpdateUserRole({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["useAllUsers"] });
      queryClient.invalidateQueries({ queryKey: ["useUserCounts"] });
      setIsEditModalOpen(false);
      toast({
        title: "Success",
        description: "User role updated successfully",
      });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to update role",
      });
    },
  });

  const deleteUserMutation = useDeleteUser({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["useAllUsers"] });
      queryClient.invalidateQueries({ queryKey: ["useUserCounts"] });
      setIsDeleteModalOpen(false);
      toast({
        title: "Success",
        description: "User deleted successfully",
      });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to delete user",
      });
    },
  });

  useEffect(() => {
    const role =
      document.cookie
        .split("; ")
        .find((row) => row.startsWith("userRole="))
        ?.split("=")[1] || "";
    setUserRole(decodeURIComponent(role));
  }, []);

  const isSuperAdmin = userRole === "Super Admin";

  const users = usersData || [];
  const totalPages = Math.ceil(users.length / ITEMS_PER_PAGE);
  const paginatedUsers = users.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const handleEdit = (user: any) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  const handleStatusChange = (user: any) => {
    setSelectedUser(user);
    setBanReason(user.banReason || "");
    setIsStatusModalOpen(true);
  };

  const handleDelete = (user: any) => {
    setSelectedUser(user);
    setIsDeleteModalOpen(true);
  };

  const handleStatusUpdate = (status: string) => {
    if (selectedUser) {
      updateStatusMutation.mutate({
        id: selectedUser.id,
        status,
        banReason: status === "Banned" ? banReason : undefined,
      });
    }
  };

  const handleRoleUpdate = (role: string) => {
    if (selectedUser) {
      updateRoleMutation.mutate({
        id: selectedUser.id,
        role,
      });
    }
  };

  const confirmDelete = () => {
    if (selectedUser) {
      deleteUserMutation.mutate(selectedUser.id);
    }
  };

  return (
    <div className="flex-1 space-y-8 container mx-auto px-4 md:px-6 mb-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl sm:text-4xl font-bold bg-gradient-to-b from-primary to-primary/40 bg-clip-text text-transparent leading-[unset] pb-2">
            User Management
          </h2>
          <p className="text-sm md:text-base text-muted-foreground">
            View, manage, and take action on all user accounts.
          </p>
        </div>
      </div>

      <Tabs
        value={activeTab}
        className="w-full grid grid-cols-1"
        onValueChange={(value) => {
          setActiveTab(value);
          setCurrentPage(1);
        }}
      >
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-auto">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search users..."
              className="pl-8 w-full md:w-[300px]"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
          <TabsList className="w-full md:w-auto flex gap-1 overflow-x-auto h-auto">
            <TabsTrigger value="all">All ({countsData?.All || 0})</TabsTrigger>
            <TabsTrigger value="super_admin">
              Super Admins ({countsData?.super_admin || 0})
            </TabsTrigger>
            <TabsTrigger value="admin">
              Admins ({countsData?.admin || 0})
            </TabsTrigger>
            <TabsTrigger value="moderator">
              Moderators ({countsData?.moderator || 0})
            </TabsTrigger>
            <TabsTrigger value="support">
              Support ({countsData?.support || 0})
            </TabsTrigger>
            <TabsTrigger value="tester">
              Testers ({countsData?.tester || 0})
            </TabsTrigger>
            <TabsTrigger value="user">
              Users ({countsData?.user || 0})
            </TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value={activeTab} className="mt-4 grid grid-cols-1">
          <div className="overflow-x-auto">
            <Card>
              <CardContent className="p-0">
                <UserTable
                  users={paginatedUsers}
                  onEdit={handleEdit}
                  onStatusChange={handleStatusChange}
                  onDelete={handleDelete}
                  isLoading={isLoading}
                  currentUserId={session?.user?.id}
                />
              </CardContent>
            </Card>
          </div>
          {!isLoading && paginatedUsers.length > 0 && (
            <AppPagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          )}
        </TabsContent>
      </Tabs>

      {/* Edit Role Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Role for {selectedUser?.name}</DialogTitle>
            <DialogDescription>
              Change the user's role. This will affect their permissions.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Select
              defaultValue={selectedUser?.role}
              onValueChange={handleRoleUpdate}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent position="popper">
                <SelectItem value="user">User</SelectItem>
                <SelectItem value="tester">Tester</SelectItem>
                <SelectItem value="support">Support</SelectItem>
                <SelectItem value="moderator">Moderator</SelectItem>
                <SelectItem value="admin" disabled={!isSuperAdmin}>
                  Admin {!isSuperAdmin && "(Super Admin only)"}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsEditModalOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => setIsEditModalOpen(false)}
              disabled={updateRoleMutation.isPending}
            >
              {updateRoleMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Change Status Modal */}
      <Dialog open={isStatusModalOpen} onOpenChange={setIsStatusModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Change Status for {selectedUser?.name}</DialogTitle>
            <DialogDescription>
              Update the user's account status. Banning a user will prevent them
              from logging in.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 flex flex-col gap-4">
            {selectedUser?.status === "Active" && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground ml-1">
                  Reason for banning (Optional)
                </label>
                <Input
                  placeholder="e.g. Terms of service violation, fraud, etc."
                  value={banReason}
                  onChange={(e) => setBanReason(e.target.value)}
                />
              </div>
            )}
            <Button
              variant={
                selectedUser?.status === "Active" ? "outline" : "default"
              }
              className="w-full justify-start gap-2 h-auto py-3 px-4"
              onClick={() => handleStatusUpdate("Active")}
              disabled={updateStatusMutation.isPending}
            >
              <CheckCircle className="h-5 w-5" />
              <div className="flex flex-col items-start">
                <span>Activate Account</span>
                <span className="text-xs font-normal opacity-70">
                  Allow user to log in and use features
                </span>
              </div>
            </Button>
            <Button
              variant={
                selectedUser?.status === "Banned" ? "destructive" : "outline"
              }
              className="w-full justify-start gap-2 h-auto py-3 px-4"
              onClick={() => handleStatusUpdate("Banned")}
              disabled={updateStatusMutation.isPending}
            >
              <Ban className="h-5 w-5" />
              <div className="flex flex-col items-start">
                <span>Ban Account</span>
                <span className="text-xs font-normal opacity-70">
                  Prevent user from logging in
                </span>
              </div>
            </Button>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsStatusModalOpen(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-destructive flex items-center gap-2">
              <Ban className="h-5 w-5" /> Delete User Account
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete{" "}
              <strong>{selectedUser?.name}</strong>? This action is permanent
              and will remove all associated data, including apps, feedbacks,
              and transactions.
            </DialogDescription>
          </DialogHeader>
          <div className="bg-destructive/10 p-4 rounded-md border border-destructive/20 text-sm">
            <p className="font-semibold text-destructive mb-1">Warning:</p>
            <ul className="list-disc list-inside space-y-1 opacity-80">
              <li>Permanent account removal</li>
              <li>Deletion of all submitted apps</li>
              <li>Removal of all earnings and history</li>
              <li>This action cannot be undone</li>
            </ul>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="ghost" onClick={() => setIsDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={deleteUserMutation.isPending}
            >
              {deleteUserMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Delete Permanently
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
