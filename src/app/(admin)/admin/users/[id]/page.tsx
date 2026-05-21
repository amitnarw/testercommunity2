"use client";

import { useRouter, notFound, useParams } from "next/navigation";
import { ROUTES } from "@/lib/routes";
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
  Globe,
  Wallet,
  XCircle,
  Trash2,
  Ban,
  Briefcase,
  Building2,
  FolderGit,
  Languages,
  Wifi,
  MessageSquare,
  UserCircle,
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
  useUpdateUserProfile,
  useDeleteUser,
} from "@/hooks/useAdmin";
import { useQueryClient } from "@tanstack/react-query";
import { Separator } from "@/components/ui/separator";
import { authClient } from "@/lib/auth-client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import {
  UserProfileType,
  UserJobRole,
  UserExperienceLevel,
  UserCompanySize,
  UserCompanyPosition,
  UserTotalPublishedApps,
  UserDevelopmentPlatform,
  UserPublishFrequency,
  UserTestingServiceReason,
  UserCommunicationMethod,
} from "@/lib/types";
import { countries } from "@/lib/countries";

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

function formatEnum(label: string | null) {
  if (!label) return null;
  return label.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
}

function formatProfileType(val: string | null) {
  if (!val) return null;
  return val.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
}

function formatCompanySize(val: string | null) {
  if (!val) return null;
  return val.replace("SIZE_", "").replace(/_/g, "-").toLowerCase();
}

function formatPublishedApps(val: string | null) {
  if (!val) return null;
  return val.replace("PUB_", "").replace(/_/g, "-").toLowerCase();
}

function formatCommunicationMethods(methods: string[] | undefined) {
  if (!methods || methods.length === 0) return null;
  return methods.map((m) => m.toLowerCase()).join(", ");
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

  const [editProfileData, setEditProfileData] = useState<any>({});

  useEffect(() => {
    if (user) {
      setRoleSelection(user.role);
      setStatusSelection(user.status);
      setBanReason(user.banReason || "");
      setEditProfileData({
        profile_type: user.profileType || "",
        job_role: user.jobRole || "",
        experience_level: user.experience || "",
        phone: user.phone || "",
        country: user.country || "",
        service_usage: user.serviceUsage || "",
        communication_methods: user.communicationMethods || [],
        company_name: user.companyName || "",
        company_website: user.companyWebsite || "",
        company_size: user.companySize || "",
        position_in_company: user.positionInCompany || "",
        total_published_apps: user.totalPublishedApps || "",
        platform_development: user.platformDevelopment || "",
        publish_frequency: user.publishFrequency || "",
        device_company: user.deviceDetails?.company || "",
        device_model: user.deviceDetails?.model || "",
        ram: user.deviceDetails?.ram || "",
        os: user.deviceDetails?.os || "",
        screen_resolution: user.deviceDetails?.screenResolution || "",
        language: user.deviceDetails?.language || "",
        network: user.deviceDetails?.network || "",
      });
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
      router.push(ROUTES.ADMIN.USERS);
    },
    onError: (err: any) => {
      toast({
        title: "Error",
        description: err.message || "Failed to delete user.",
        variant: "destructive",
      });
    },
  });

  const updateProfileMutation = useUpdateUserProfile({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["useUserById", id] });
      setIsEditModalOpen(false);
      toast({
        title: "Profile Updated",
        description: "User profile has been successfully updated.",
      });
    },
    onError: (err: any) => {
      toast({
        title: "Error",
        description: err.message || "Failed to update user profile.",
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
    updateProfileMutation.mutate({
      id: user.id,
      data: editProfileData,
    });
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
          <BackButton href={ROUTES.ADMIN.USERS} />
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

        {/* SUMMARY CARDS */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-10">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <Card className="border-l-4 border-l-slate-500">
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
          </div>

          {/* Economy Summary Card */}
          <div className="lg:col-span-2">
            <Card className="border-l-4 border-l-emerald-500 h-full">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <Wallet className="w-4 h-4 text-emerald-500" /> Account Economy
                </CardTitle>
                <CardDescription>
                  Current wallet balances and lifetime transaction history for this user.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="text-xs font-semibold text-muted-foreground tracking-wide mb-3 uppercase">
                    Current Balances
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <p className="text-xs text-muted-foreground">Total Points</p>
                      <p className="text-2xl font-bold">{user.wallet?.totalPoints || 0}</p>
                    </div>
                    <div className="space-y-1.5">
                      <p className="text-xs text-muted-foreground">Total Packages</p>
                      <p className="text-2xl font-bold">{user.wallet?.totalPackages || 0}</p>
                    </div>
                  </div>
                </div>
                <Separator />
                <div>
                  <h4 className="text-xs font-semibold text-muted-foreground tracking-wide mb-3 uppercase">
                    Lifetime History
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="space-y-1.5">
                      <p className="text-xs text-muted-foreground">Points Earned</p>
                      <p className="text-lg font-bold text-green-600 dark:text-green-400">
                        {user.walletStats?.pointsEarned || 0}
                      </p>
                    </div>
                    <div className="space-y-1.5">
                      <p className="text-xs text-muted-foreground">Points Spent</p>
                      <p className="text-lg font-bold text-red-600 dark:text-red-400">
                        {user.walletStats?.pointsSpent || 0}
                      </p>
                    </div>
                    <div className="space-y-1.5">
                      <p className="text-xs text-muted-foreground">Packages Purchased</p>
                      <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
                        {user.walletStats?.packagesPurchased || 0}
                      </p>
                    </div>
                    <div className="space-y-1.5">
                      <p className="text-xs text-muted-foreground">Packages Used</p>
                      <p className="text-lg font-bold text-orange-600 dark:text-orange-400">
                        {user.walletStats?.packagesUsed || 0}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Activity Summary Card */}
        <div className="mt-8">
          <Card className="border-l-4 border-l-blue-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Activity className="w-4 h-4 text-blue-500" /> Activity Summary
              </CardTitle>
              <CardDescription>
                Testing participation and community contributions by this user.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="text-xs font-semibold text-muted-foreground tracking-wide uppercase">
                    Testing Activity
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <p className="text-xs text-muted-foreground">Tests Participated In</p>
                      <p className="text-2xl font-bold">{user.stats?.totalTests || 0}</p>
                    </div>
                    {isTester && (
                      <>
                        <div className="space-y-1.5">
                          <p className="text-xs text-muted-foreground">Active Tests</p>
                          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                            {user.stats?.activeTests || 0}
                          </p>
                        </div>
                        <div className="space-y-1.5">
                          <p className="text-xs text-muted-foreground">Completed Tests</p>
                          <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                            {user.stats?.completedTests || 0}
                          </p>
                        </div>
                        <div className="space-y-1.5">
                          <p className="text-xs text-muted-foreground">Dropped Tests</p>
                          <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                            {user.stats?.droppedTests || 0}
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                </div>
                <div className="space-y-4">
                  <h4 className="text-xs font-semibold text-muted-foreground tracking-wide uppercase">
                    Community Activity
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <p className="text-xs text-muted-foreground">Feedback Reports Submitted</p>
                      <p className="text-2xl font-bold">{user.stats?.totalFeedbacks || 0}</p>
                    </div>
                    <div className="space-y-1.5">
                      <p className="text-xs text-muted-foreground">Apps Submitted for Testing</p>
                      <p className="text-2xl font-bold">{user.stats?.totalSubmissions || 0}</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* MIDDLE: 2-Column Profile Detail Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-10">
          <div className="space-y-6">
            {/* Role & Professional Info */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <UserCircle className="w-4 h-4" /> Role & Professional Info
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex items-center gap-3">
                  <Briefcase className="w-4 h-4 text-muted-foreground shrink-0" />
                  <span>{formatProfileType(user.profileType) || "—"}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Shield className="w-4 h-4 text-muted-foreground shrink-0" />
                  <span>{formatEnum(user.jobRole) || "—"}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Activity className="w-4 h-4 text-muted-foreground shrink-0" />
                  <span>{formatExperience(user.experience) || "—"}</span>
                </div>
              </CardContent>
            </Card>

            {/* Contact & Communication */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" /> Contact & Communication
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
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-muted-foreground shrink-0" />
                  <span>{user.phone || "—"}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Globe className="w-4 h-4 text-muted-foreground shrink-0" />
                  <span>{user.country || "—"}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Lightbulb className="w-4 h-4 text-muted-foreground shrink-0" />
                  <span className="capitalize">{formatEnum(user.serviceUsage) || "—"}</span>
                </div>
                <div className="flex items-center gap-3">
                  <MessageSquare className="w-4 h-4 text-muted-foreground shrink-0" />
                  <span className="capitalize">{formatCommunicationMethods(user.communicationMethods) || "—"}</span>
                </div>
              </CardContent>
            </Card>

            {/* Wallet */}
            {user.wallet && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-semibold flex items-center gap-2">
                    <Wallet className="w-4 h-4" /> Wallet
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="flex items-center gap-3">
                    <Wallet className="w-4 h-4 text-muted-foreground shrink-0" />
                    <div>
                      <p className="font-medium">{user.wallet.totalPoints || 0} points</p>
                      <p className="text-xs text-muted-foreground">Available Points</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Briefcase className="w-4 h-4 text-muted-foreground shrink-0" />
                    <div>
                      <p className="font-medium">{user.wallet.totalPackages || 0} packages</p>
                      <p className="text-xs text-muted-foreground">Available Packages</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="space-y-6">
            {/* Company Information */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <Building2 className="w-4 h-4" /> Company Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex items-center gap-3">
                  <Building2 className="w-4 h-4 text-muted-foreground shrink-0" />
                  <span>{user.companyName || "—"}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Globe className="w-4 h-4 text-muted-foreground shrink-0" />
                  {user.companyWebsite ? (
                    <a href={user.companyWebsite} target="_blank" rel="noreferrer" className="hover:underline truncate">{user.companyWebsite}</a>
                  ) : (
                    <span>—</span>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <Briefcase className="w-4 h-4 text-muted-foreground shrink-0" />
                  <span>{user.companySize ? `${formatCompanySize(user.companySize)} employees` : "—"}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Shield className="w-4 h-4 text-muted-foreground shrink-0" />
                  <span>{formatEnum(user.positionInCompany) || "—"}</span>
                </div>
              </CardContent>
            </Card>

            {/* Project Information */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <FolderGit className="w-4 h-4" /> Project Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex items-center gap-3">
                  <FolderGit className="w-4 h-4 text-muted-foreground shrink-0" />
                  <span>{user.totalPublishedApps ? `${formatPublishedApps(user.totalPublishedApps)} published apps` : "—"}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Smartphone className="w-4 h-4 text-muted-foreground shrink-0" />
                  <span className="capitalize">{formatEnum(user.platformDevelopment) || "—"}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Activity className="w-4 h-4 text-muted-foreground shrink-0" />
                  <span className="capitalize">{formatEnum(user.publishFrequency) || "—"}</span>
                </div>
              </CardContent>
            </Card>

            {/* Device Information */}
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
                    <p className="font-medium">{user.deviceDetails?.company || "—"}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs">Model</p>
                    <p className="font-medium">{user.deviceDetails?.model || "—"}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs">OS</p>
                    <p className="font-medium">{user.deviceDetails?.os || "—"}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs">RAM</p>
                    <p className="font-medium">{user.deviceDetails?.ram || "—"}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs">Resolution</p>
                    <p className="font-medium">{user.deviceDetails?.screenResolution || "—"}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs">Language</p>
                    <p className="font-medium flex items-center gap-1">
                      <Languages className="w-3 h-3" /> {user.deviceDetails?.language || "—"}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs">Network</p>
                    <p className="font-medium flex items-center gap-1">
                      <Wifi className="w-3 h-3" /> {user.deviceDetails?.network || "—"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* BOTTOM: Tables */}
        <div className="mt-10">
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

      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit {user.name}</DialogTitle>
            <DialogDescription>
              Admin can update all profile fields, role, and status.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-4">

            {/* Role & Status */}
            <div>
              <h4 className="text-base font-bold border-b pb-2 mb-4">Role & Status</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Role</Label>
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
                  <Label>Status</Label>
                  <Select
                    value={statusSelection}
                    onValueChange={(value) => setStatusSelection(value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent position="popper">
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Banned">Banned</SelectItem>
                      <SelectItem value="Inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <Separator />

            {/* Section 1: Role & Professional Info */}
            <div>
              <h4 className="text-base font-bold border-b pb-2 mb-4">Role & Professional Info</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Profile Type</Label>
                  <Select
                    value={editProfileData.profile_type}
                    onValueChange={(val) => setEditProfileData((prev: any) => ({ ...prev, profile_type: val }))}
                  >
                    <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                    <SelectContent>
                      {Object.values(UserProfileType).map((t) => (
                        <SelectItem key={t} value={t}>{t.replace(/_/g, " ").toLowerCase()}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Job Role</Label>
                  <Select
                    value={editProfileData.job_role}
                    onValueChange={(val) => setEditProfileData((prev: any) => ({ ...prev, job_role: val }))}
                  >
                    <SelectTrigger><SelectValue placeholder="Select role" /></SelectTrigger>
                    <SelectContent>
                      {Object.values(UserJobRole).map((r) => (
                        <SelectItem key={r} value={r}>{r.replace(/_/g, " ").toLowerCase()}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Experience Level</Label>
                  <Select
                    value={editProfileData.experience_level}
                    onValueChange={(val) => setEditProfileData((prev: any) => ({ ...prev, experience_level: val }))}
                  >
                    <SelectTrigger><SelectValue placeholder="Select level" /></SelectTrigger>
                    <SelectContent>
                      {Object.values(UserExperienceLevel).map((l) => (
                        <SelectItem key={l} value={l}>{l.replace(/_/g, " ").toLowerCase()}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <Separator />

            {/* Section 2: Company Information */}
            <div>
              <h4 className="text-base font-bold border-b pb-2 mb-4">Company Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Company Name</Label>
                  <Input
                    value={editProfileData.company_name}
                    onChange={(e) => setEditProfileData((prev: any) => ({ ...prev, company_name: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Company Website</Label>
                  <Input
                    value={editProfileData.company_website}
                    onChange={(e) => setEditProfileData((prev: any) => ({ ...prev, company_website: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Company Size</Label>
                  <Select
                    value={editProfileData.company_size}
                    onValueChange={(val) => setEditProfileData((prev: any) => ({ ...prev, company_size: val }))}
                  >
                    <SelectTrigger><SelectValue placeholder="Select size" /></SelectTrigger>
                    <SelectContent>
                      {Object.values(UserCompanySize).map((s) => (
                        <SelectItem key={s} value={s}>{s.replace("SIZE_", "").replace(/_/g, "-").toLowerCase()}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Position in Company</Label>
                  <Select
                    value={editProfileData.position_in_company}
                    onValueChange={(val) => setEditProfileData((prev: any) => ({ ...prev, position_in_company: val }))}
                  >
                    <SelectTrigger><SelectValue placeholder="Select position" /></SelectTrigger>
                    <SelectContent>
                      {Object.values(UserCompanyPosition).map((p) => (
                        <SelectItem key={p} value={p}>{p.replace(/_/g, " ").toLowerCase()}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <Separator />

            {/* Section 3: Project Information */}
            <div>
              <h4 className="text-base font-bold border-b pb-2 mb-4">Project Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Total Published Apps</Label>
                  <Select
                    value={editProfileData.total_published_apps}
                    onValueChange={(val) => setEditProfileData((prev: any) => ({ ...prev, total_published_apps: val }))}
                  >
                    <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>
                      {Object.values(UserTotalPublishedApps).map((a) => (
                        <SelectItem key={a} value={a}>{a.replace("PUB_", "").replace(/_/g, "-").toLowerCase()}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Development Platform</Label>
                  <Select
                    value={editProfileData.platform_development}
                    onValueChange={(val) => setEditProfileData((prev: any) => ({ ...prev, platform_development: val }))}
                  >
                    <SelectTrigger><SelectValue placeholder="Select platform" /></SelectTrigger>
                    <SelectContent>
                      {Object.values(UserDevelopmentPlatform).map((p) => (
                        <SelectItem key={p} value={p}>{p.replace(/_/g, " ").toLowerCase()}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Publish Frequency</Label>
                  <Select
                    value={editProfileData.publish_frequency}
                    onValueChange={(val) => setEditProfileData((prev: any) => ({ ...prev, publish_frequency: val }))}
                  >
                    <SelectTrigger><SelectValue placeholder="Select frequency" /></SelectTrigger>
                    <SelectContent>
                      {Object.values(UserPublishFrequency).map((f) => (
                        <SelectItem key={f} value={f}>{f.replace(/_/g, " ").toLowerCase()}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <Separator />

            {/* Section 4: Device Information */}
            <div>
              <h4 className="text-base font-bold border-b pb-2 mb-4">Device Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Device Company</Label>
                  <Input
                    value={editProfileData.device_company}
                    onChange={(e) => setEditProfileData((prev: any) => ({ ...prev, device_company: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Device Model</Label>
                  <Input
                    value={editProfileData.device_model}
                    onChange={(e) => setEditProfileData((prev: any) => ({ ...prev, device_model: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>RAM</Label>
                  <Select
                    value={editProfileData.ram}
                    onValueChange={(val) => setEditProfileData((prev: any) => ({ ...prev, ram: val }))}
                  >
                    <SelectTrigger><SelectValue placeholder="Select RAM" /></SelectTrigger>
                    <SelectContent>
                      {["2GB","3GB","4GB","6GB","8GB","12GB","16GB","18GB","24GB"].map((r) => (
                        <SelectItem key={r} value={r}>{r}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Operating System</Label>
                  <Select
                    value={editProfileData.os}
                    onValueChange={(val) => setEditProfileData((prev: any) => ({ ...prev, os: val }))}
                  >
                    <SelectTrigger><SelectValue placeholder="Select OS" /></SelectTrigger>
                    <SelectContent>
                      {["Android 16","Android 15","Android 14","Android 13","Android 12","Android 11","Android 10 or older"].map((o) => (
                        <SelectItem key={o} value={o}>{o}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Screen Resolution</Label>
                  <Select
                    value={editProfileData.screen_resolution}
                    onValueChange={(val) => setEditProfileData((prev: any) => ({ ...prev, screen_resolution: val }))}
                  >
                    <SelectTrigger><SelectValue placeholder="Select resolution" /></SelectTrigger>
                    <SelectContent>
                      {["HD+ (720p)","FHD+ (1080p)","QHD+ (2K)","UHD (4K)","UHD (8K)","Other"].map((r) => (
                        <SelectItem key={r} value={r}>{r}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Language</Label>
                  <Select
                    value={editProfileData.language}
                    onValueChange={(val) => setEditProfileData((prev: any) => ({ ...prev, language: val }))}
                  >
                    <SelectTrigger><SelectValue placeholder="Select language" /></SelectTrigger>
                    <SelectContent>
                      {["English (US)","English (UK)","Spanish","Mandarin Chinese","Hindi","Arabic","Portuguese","Bengali","Russian","Japanese","German","French","Other"].map((l) => (
                        <SelectItem key={l} value={l}>{l}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Primary Network</Label>
                  <Select
                    value={editProfileData.network}
                    onValueChange={(val) => setEditProfileData((prev: any) => ({ ...prev, network: val }))}
                  >
                    <SelectTrigger><SelectValue placeholder="Select network" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="WiFi">WiFi</SelectItem>
                      <SelectItem value="Cellular">Cellular</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <Separator />

            {/* Section 5: Contact & Communication */}
            <div>
              <h4 className="text-base font-bold border-b pb-2 mb-4">Contact & Communication</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Country</Label>
                  <Select
                    value={editProfileData.country}
                    onValueChange={(val) => setEditProfileData((prev: any) => ({ ...prev, country: val }))}
                  >
                    <SelectTrigger><SelectValue placeholder="Select country" /></SelectTrigger>
                    <SelectContent>
                      {countries.map((c) => (
                        <SelectItem key={c.code} value={c.name}>{c.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Phone</Label>
                  <Input
                    value={editProfileData.phone}
                    onChange={(e) => setEditProfileData((prev: any) => ({ ...prev, phone: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Service Usage Reason</Label>
                  <Select
                    value={editProfileData.service_usage}
                    onValueChange={(val) => setEditProfileData((prev: any) => ({ ...prev, service_usage: val }))}
                  >
                    <SelectTrigger><SelectValue placeholder="Select reason" /></SelectTrigger>
                    <SelectContent>
                      {Object.values(UserTestingServiceReason).map((r) => (
                        <SelectItem key={r} value={r}>{r.replace(/_/g, " ").toLowerCase()}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2 col-span-2">
                  <Label>Communication Methods</Label>
                  <div className="flex flex-wrap gap-3">
                    {Object.values(UserCommunicationMethod).map((m) => {
                      const checked = (editProfileData.communication_methods || []).includes(m);
                      return (
                        <div key={m} className="flex items-center gap-2">
                          <Checkbox
                            id={`edit-comm-${m}`}
                            checked={checked}
                            onCheckedChange={(c) => {
                              setEditProfileData((prev: any) => {
                                const current = prev.communication_methods || [];
                                return {
                                  ...prev,
                                  communication_methods: c
                                    ? [...current, m]
                                    : current.filter((v: string) => v !== m),
                                };
                              });
                            }}
                          />
                          <Label htmlFor={`edit-comm-${m}`} className="text-sm font-normal cursor-pointer">
                            {m.toLowerCase()}
                          </Label>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

          </div>
          <DialogFooter className="gap-2">
            <Button variant="ghost" onClick={() => setIsEditModalOpen(false)}>Cancel</Button>
            <Button
              onClick={handleSaveChanges}
              disabled={updateProfileMutation.isPending || updateRoleMutation.isPending}
            >
              {(updateProfileMutation.isPending || updateRoleMutation.isPending) && (
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
                onClick={() => updateStatusMutation.mutate({ id: user.id, status: "Active" })}
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
                onClick={() => updateStatusMutation.mutate({ id: user.id, status: "Banned", banReason: "Banned by admin" })}
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
