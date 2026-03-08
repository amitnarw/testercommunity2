"use client";

import { useRouter, notFound, useParams } from "next/navigation";
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
  Loader2,
  Smartphone,
  Activity,
  CalendarDays,
  Globe,
  Wallet,
  XCircle,
  Clock,
  Trash2,
  Ban,
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
  useDeleteUser,
} from "@/hooks/useAdmin";
import { useQueryClient } from "@tanstack/react-query";
import { Separator } from "@/components/ui/separator";
import { authClient } from "@/lib/auth-client";
import { Input } from "@/components/ui/input";

const AVAILABILITY_CONFIG: Record<
  string,
  { label: string; color: string; dotClass: string }
> = {
  AVAILABLE: {
    label: "Available",
    color:
      "bg-green-500/20 text-green-700 dark:bg-green-500/10 dark:text-green-400",
    dotClass: "bg-green-500",
  },
  BUSY: {
    label: "Busy",
    color:
      "bg-yellow-500/20 text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-400",
    dotClass: "bg-yellow-500",
  },
  AWAY: {
    label: "Away",
    color:
      "bg-orange-500/20 text-orange-700 dark:bg-orange-500/10 dark:text-orange-400",
    dotClass: "bg-orange-500",
  },
  DO_NOT_DISTURB: {
    label: "Do Not Disturb",
    color: "bg-red-500/20 text-red-700 dark:bg-red-500/10 dark:text-red-400",
    dotClass: "bg-red-500",
  },
};

const STATUS_COLORS: Record<string, string> = {
  IN_PROGRESS:
    "bg-blue-500/20 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400",
  PENDING:
    "bg-yellow-500/20 text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-400",
  COMPLETED:
    "bg-green-500/20 text-green-700 dark:bg-green-500/10 dark:text-green-400",
  DROPPED: "bg-red-500/20 text-red-700 dark:bg-red-500/10 dark:text-red-400",
  REMOVED: "bg-red-500/20 text-red-700 dark:bg-red-500/10 dark:text-red-400",
  REJECTED:
    "bg-gray-500/20 text-gray-700 dark:bg-gray-500/10 dark:text-gray-400",
};

function formatDate(dateStr: string | null) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function formatExperience(exp: string | null) {
  if (!exp) return null;
  const map: Record<string, string> = {
    INTERN: "Intern",
    JUNIOR: "Junior",
    MID: "Mid-Level",
    SENIOR: "Senior",
    LEAD: "Lead",
    DIRECTOR: "Director",
    OTHER: "Other",
  };
  return map[exp] || exp;
}

export default function AdminUserDetailsPage() {
  const params = useParams();
  const id = params.id as string;
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const router = useRouter();
  const { data: session } = authClient.useSession();

  const { data: user, isLoading, isError } = useUserById(id);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [roleSelection, setRoleSelection] = useState<string>("");
  const [statusSelection, setStatusSelection] = useState<string>("");
  const [banReason, setBanReason] = useState("");
  const [userRole, setUserRole] = useState("");

  useEffect(() => {
    if (user) {
      setRoleSelection(user.role);
      setStatusSelection(user.status);
      setBanReason(user.banReason || "");
    }
  }, [user]);

  useEffect(() => {
    const role =
      document.cookie
        .split("; ")
        .find((row) => row.startsWith("userRole="))
        ?.split("=")[1] || "";
    setUserRole(decodeURIComponent(role));
  }, []);

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
    onError: (err: any) => {
      toast({
        title: "Error",
        description: err.message || "Failed to update user role.",
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
    onError: (err: any) => {
      toast({
        title: "Error",
        description: err.message || "Failed to update user status.",
        variant: "destructive",
      });
    },
  });

  const deleteUserMutation = useDeleteUser({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["useAllUsers"] });
      queryClient.invalidateQueries({ queryKey: ["useUserCounts"] });
      toast({
        title: "User Deleted",
        description:
          "The user account and all associated data have been removed.",
      });
      router.push("/admin/users");
    },
    onError: (err: any) => {
      toast({
        title: "Error",
        description: err.message || "Failed to delete user.",
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
        banReason:
          statusSelection === "Banned"
            ? banReason || "Banned by admin"
            : undefined,
      });
    }
    setIsEditModalOpen(false);
  };

  const handleDeleteUser = () => {
    deleteUserMutation.mutate(user.id);
  };

  const isTester = user.role === "tester";
  const isSuperAdmin = userRole === "Super Admin" || userRole === "Super+Admin";
  const isCurrentUser = session?.user?.id === user.id;
  const isTargetSuperAdmin =
    user.role === "super_admin" || user.role === "Super Admin";

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

  const availConfig =
    AVAILABILITY_CONFIG[user.availability] || AVAILABILITY_CONFIG.AVAILABLE;

  return (
    <>
      <div className="container mx-auto px-4 md:px-6 mb-8">
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
                  setBanReason(user.banReason || "");
                  setIsEditModalOpen(true);
                }}
              >
                <Edit className="sm:mr-2 !h-3 !w-3 sm:!h-4 sm:!w-4" />
                <span className="hidden sm:block">Edit Profile</span>
              </Button>

              {!isCurrentUser && (
                <Button
                  variant={user.status === "Banned" ? "default" : "outline"}
                  className="px-3"
                  onClick={() => setIsStatusModalOpen(true)}
                >
                  {user.status === "Banned" ? (
                    <span className="flex items-center gap-1.5 sm:gap-2">
                      <CheckCircle className="!h-3 !w-3 sm:!h-4 sm:!w-4 text-green-500" />
                      <span className="hidden sm:block">Activate User</span>
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5 sm:gap-2">
                      <Ban className="!h-3 !w-3 sm:!h-4 sm:!w-4 text-red-500" />
                      <span className="hidden sm:block">Ban User</span>
                    </span>
                  )}
                </Button>
              )}

              {!isCurrentUser && !isTargetSuperAdmin && (
                <Button
                  variant="destructive"
                  className="px-3"
                  onClick={() => setIsDeleteModalOpen(true)}
                >
                  <Trash2 className="sm:mr-2 !h-3 !w-3 sm:!h-4 sm:!w-4" />
                  <span className="hidden sm:block">Delete User</span>
                </Button>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-10">
          {/* LEFT COLUMN - User Profile & Info */}
          <div className="lg:col-span-1 space-y-6">
            {/* Profile Card */}
            <Card>
              <CardContent className="pt-6 flex flex-col items-center text-center">
                <div className="relative">
                  <Avatar className="h-24 w-24 mb-4 border border-border">
                    <AvatarImage src={user.image || ""} />
                    <AvatarFallback className="text-2xl">
                      {user.name?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                  {isTester && (
                    <span className="absolute bottom-3 right-0">
                      <span
                        className={`w-4 h-4 rounded-full ${availConfig.dotClass} block ring-2 ring-background`}
                        title={availConfig.label}
                      />
                    </span>
                  )}
                </div>
                <h3 className="text-xl font-bold">{user.name}</h3>
                <p className="text-sm text-muted-foreground">{user.email}</p>
                <div className="flex gap-2 mt-4 flex-wrap justify-center">
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
                  {isTester && (
                    <Badge variant="outline" className={availConfig.color}>
                      {availConfig.label}
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-3">
                  Joined {formatDate(user.createdAt)}
                </p>
              </CardContent>
            </Card>

            {/* Contact & Info */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold">
                  Contact & Info
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-muted-foreground shrink-0" />
                  <a
                    href={`mailto:${user.email}`}
                    className="hover:underline truncate"
                  >
                    {user.email}
                  </a>
                </div>
                {user.phone && (
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-muted-foreground shrink-0" />
                    <span>{user.phone}</span>
                  </div>
                )}
                {user.country && (
                  <div className="flex items-center gap-3">
                    <Globe className="w-4 h-4 text-muted-foreground shrink-0" />
                    <span>{user.country}</span>
                  </div>
                )}
                {user.experience && (
                  <div className="flex items-center gap-3">
                    <Shield className="w-4 h-4 text-muted-foreground shrink-0" />
                    <span>{formatExperience(user.experience)}</span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Device Info (Tester only) */}
            {isTester && user.deviceDetails && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-semibold flex items-center gap-2">
                    <Smartphone className="w-4 h-4" /> Device Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm">
                  <div className="grid grid-cols-2 gap-y-3 gap-x-4">
                    <div>
                      <p className="text-muted-foreground text-xs">Brand</p>
                      <p className="font-medium">
                        {user.deviceDetails.company || "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-xs">Model</p>
                      <p className="font-medium">
                        {user.deviceDetails.model || "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-xs">OS</p>
                      <p className="font-medium">
                        {user.deviceDetails.os || "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-xs">RAM</p>
                      <p className="font-medium">
                        {user.deviceDetails.ram || "N/A"}
                      </p>
                    </div>
                    {user.deviceDetails.screenResolution && (
                      <div className="col-span-2">
                        <p className="text-muted-foreground text-xs">
                          Screen Resolution
                        </p>
                        <p className="font-medium">
                          {user.deviceDetails.screenResolution}
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Wallet (if available) */}
            {user.wallet && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-semibold flex items-center gap-2">
                    <Wallet className="w-4 h-4" /> Wallet
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {user.wallet.balance || 0}{" "}
                    <span className="text-sm font-normal text-muted-foreground">
                      points
                    </span>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* RIGHT COLUMN - Stats & Activity */}
          <div className="lg:col-span-2 space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <Card className="p-4">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-xs">Total Tests</span>
                </div>
                <p className="text-2xl font-bold">
                  {user.stats?.totalTests || 0}
                </p>
              </Card>
              {isTester && (
                <Card className="p-4">
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <Activity className="w-4 h-4 text-blue-500" />
                    <span className="text-xs">Active</span>
                  </div>
                  <p className="text-2xl font-bold">
                    {user.stats?.activeTests || 0}
                  </p>
                </Card>
              )}
              {isTester && (
                <Card className="p-4">
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-xs">Completed</span>
                  </div>
                  <p className="text-2xl font-bold">
                    {user.stats?.completedTests || 0}
                  </p>
                </Card>
              )}
              <Card className="p-4">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <Lightbulb className="w-4 h-4 text-yellow-500" />
                  <span className="text-xs">Feedbacks</span>
                </div>
                <p className="text-2xl font-bold">
                  {user.stats?.totalFeedbacks || 0}
                </p>
              </Card>
              {!isTester && (
                <>
                  <Card className="p-4">
                    <div className="flex items-center gap-2 text-muted-foreground mb-1">
                      <Bug className="w-4 h-4 text-red-500" />
                      <span className="text-xs">Submissions</span>
                    </div>
                    <p className="text-2xl font-bold">
                      {user.stats?.totalSubmissions || 0}
                    </p>
                  </Card>
                </>
              )}
              {isTester && (
                <Card className="p-4">
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <XCircle className="w-4 h-4 text-red-500" />
                    <span className="text-xs">Dropped</span>
                  </div>
                  <p className="text-2xl font-bold">
                    {user.stats?.droppedTests || 0}
                  </p>
                </Card>
              )}
            </div>

            {/* Testing History (Tester) */}
            {isTester && (
              <Card>
                <CardHeader>
                  <CardTitle>Testing History</CardTitle>
                  <CardDescription>
                    Projects this tester has been assigned to.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {user.recentTests?.length > 0 ? (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>App Name</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Days</TableHead>
                            <TableHead>Joined</TableHead>
                            <TableHead>Last Activity</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {user.recentTests.map((test: any) => (
                            <TableRow key={test.id}>
                              <TableCell className="font-medium">
                                {test.appName || "Unknown App"}
                              </TableCell>
                              <TableCell>
                                <Badge
                                  variant="outline"
                                  className={STATUS_COLORS[test.status] || ""}
                                >
                                  {test.status?.replace("_", " ")}
                                </Badge>
                              </TableCell>
                              <TableCell>{test.daysCompleted || 0}</TableCell>
                              <TableCell className="text-muted-foreground text-xs">
                                {formatDate(test.joinedAt)}
                              </TableCell>
                              <TableCell className="text-muted-foreground text-xs">
                                {formatDate(test.lastActivityAt)}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-sm py-4 text-center">
                      No testing history yet.
                    </p>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Submissions (Non-Tester) */}
            {!isTester && (
              <Card>
                <CardHeader>
                  <CardTitle>Recent Submissions</CardTitle>
                  <CardDescription>
                    Apps submitted by this user.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {user.recentSubmissions?.length > 0 ? (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>App Name</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Submitted</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {user.recentSubmissions.map((sub: any) => (
                            <TableRow key={sub.id}>
                              <TableCell className="font-medium">
                                {sub.appName || "Unknown"}
                              </TableCell>
                              <TableCell>
                                <Badge variant="outline">{sub.appType}</Badge>
                              </TableCell>
                              <TableCell>
                                <Badge
                                  variant="outline"
                                  className={STATUS_COLORS[sub.status] || ""}
                                >
                                  {sub.status?.replace("_", " ")}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-muted-foreground text-xs">
                                {formatDate(sub.createdAt)}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-sm py-4 text-center">
                      No submissions yet.
                    </p>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit {user.name}</DialogTitle>
            <DialogDescription>
              Modify the user&apos;s role and status.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Role</label>
              <Select
                value={roleSelection}
                onValueChange={(value) => setRoleSelection(value)}
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
                  {isSuperAdmin && (
                    <SelectItem value="super_admin">Super Admin</SelectItem>
                  )}
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

      {/* Status Modal */}
      <Dialog open={isStatusModalOpen} onOpenChange={setIsStatusModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {user.status === "Banned" ? "Activate" : "Ban"} {user.name}
            </DialogTitle>
            <DialogDescription>
              {user.status === "Banned"
                ? "This will allow the user to log in and access all features."
                : "This will session lock the user and prevent them from logging in."}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            {user.status !== "Banned" && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground ml-1">
                  Reason for banning (Optional)
                </label>
                <Input
                  placeholder="e.g. Violation of terms, fraud, etc."
                  value={banReason}
                  onChange={(e) => setBanReason(e.target.value)}
                />
              </div>
            )}
            <div className="bg-secondary/20 p-4 rounded-lg border border-border/50 text-sm">
              <p className="font-medium mb-1">Current Status: {user.status}</p>
              <p className="opacity-70 text-xs text-muted-foreground">
                Last updated at: {formatDate(user.updatedAt)}
              </p>
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="ghost" onClick={() => setIsStatusModalOpen(false)}>
              Cancel
            </Button>
            {user.status === "Banned" ? (
              <Button
                variant="default"
                onClick={() => handleStatusUpdateInternal("Active")}
                disabled={updateStatusMutation.isPending}
                className="bg-green-600 hover:bg-green-700"
              >
                {updateStatusMutation.isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Activate Account
              </Button>
            ) : (
              <Button
                variant="destructive"
                onClick={() => handleStatusUpdateInternal("Banned")}
                disabled={updateStatusMutation.isPending}
              >
                {updateStatusMutation.isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Ban Account
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete User Modal */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-destructive flex items-center gap-2">
              <Trash2 className="h-5 w-5" /> Delete User Account
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete <strong>{user.name}</strong>? This
              action is permanent and will remove all associated data.
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
          <DialogFooter className="gap-2 sm:gap-0 mt-4">
            <Button variant="ghost" onClick={() => setIsDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteUser}
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
    </>
  );
}
