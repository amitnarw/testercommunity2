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
  Loader2,
  Smartphone,
  Activity,
  CalendarDays,
  Globe,
  Wallet,
  XCircle,
  Clock,
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
import { Separator } from "@/components/ui/separator";

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

  const { data: user, isLoading, isError } = useUserById(id);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [roleSelection, setRoleSelection] = useState<string>("");
  const [statusSelection, setStatusSelection] = useState<string>("");
  const [userRole, setUserRole] = useState("");

  useEffect(() => {
    if (user) {
      setRoleSelection(user.role);
      setStatusSelection(user.status);
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
  const isSuperAdmin = userRole === "Super Admin" || userRole === "Super+Admin";

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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit {user.name}</DialogTitle>
            <DialogDescription>
              Modify the user&apos;s role and status.
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
            <div className="space-y-2">
              <label>Status</label>
              <Select
                value={statusSelection}
                onValueChange={(value) => setStatusSelection(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a status" />
                </SelectTrigger>
                <SelectContent position="popper">
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
