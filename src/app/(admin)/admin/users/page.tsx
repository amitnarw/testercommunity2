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
} from "@/hooks/useAdmin";
import { useQueryClient } from "@tanstack/react-query";

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

  const [userRole, setUserRole] = useState("");
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
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
    },
  });

  const updateRoleMutation = useUpdateUserRole({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["useAllUsers"] });
      queryClient.invalidateQueries({ queryKey: ["useUserCounts"] });
      setIsEditModalOpen(false);
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
    setIsStatusModalOpen(true);
  };

  const handleStatusUpdate = (status: string) => {
    if (selectedUser) {
      updateStatusMutation.mutate({
        id: selectedUser.id,
        status,
        banReason: status === "Banned" ? "Banned by admin" : undefined,
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
                  isLoading={isLoading}
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
        <DialogContent>
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Status for {selectedUser?.name}</DialogTitle>
            <DialogDescription>
              Update the user's account status. Banning a user will prevent them
              from logging in.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 flex flex-col gap-4">
            <Button
              variant={
                selectedUser?.status === "Active" ? "outline" : "default"
              }
              className="w-full justify-start gap-2"
              onClick={() => handleStatusUpdate("Active")}
              disabled={updateStatusMutation.isPending}
            >
              <CheckCircle className="h-4 w-4" /> Activate Account
            </Button>
            <Button
              variant={
                selectedUser?.status === "Banned" ? "destructive" : "outline"
              }
              className="w-full justify-start gap-2"
              onClick={() => handleStatusUpdate("Banned")}
              disabled={updateStatusMutation.isPending}
            >
              <Ban className="h-4 w-4" /> Ban Account
            </Button>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsStatusModalOpen(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
