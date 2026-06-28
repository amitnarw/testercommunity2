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
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
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
  Send,
  FileText,
  Bell,
  Plus,
  CheckCircle2,
  X,
  ArrowLeftRight,
  Eye,
  Pencil,
  Hand,
  AlertTriangle,
  GripVertical,
  ExternalLink,
  Gift,
} from "lucide-react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { ImmediateAttentionItem } from "@/types/iar";
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
  useUpdateUserWallet,
  useDeleteUser,
  useConvertUserAuthType,
  useCreateNotification,
  useUpdateNotification,
  useDeleteNotification,
  useNotificationTypes,
  useUserInvoices,
  useUpdateInvoice,
  useInvoicePreview,
  useGenerateDemoPayment,
  useCreateInvoice,
  useUserNotifications,
  useUserImmediateAttention,
  useCreateImmediateAttention,
  useUpdateImmediateAttention,
  useDeleteImmediateAttention,
  useReorderImmediateAttention,
  useGiftPointsAndPackages,
  useAllRoles,
} from "@/hooks/useAdmin";
import { useQueryClient } from "@tanstack/react-query";
import { Separator } from "@/components/ui/separator";
import { authClient } from "@/lib/auth-client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import { FeedbackModal } from "@/components/feedback-modal";

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

const APP_TYPE_COLORS: Record<string, string> = {
  PAID: "bg-amber-500/20 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400",
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
  const { data: rolesData } = useAllRoles();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [roleSelection, setRoleSelection] = useState<string>("");
  const [statusSelection, setStatusSelection] = useState<string>("");
  const [banReason, setBanReason] = useState("");
  const [isGiftModalOpen, setIsGiftModalOpen] = useState(false);
  const [giftData, setGiftData] = useState({
    points: 0,
    packages: 0,
  });

  const [isSendNotificationModalOpen, setIsSendNotificationModalOpen] = useState(false);
  const [notificationData, setNotificationData] = useState({
    title: '',
    description: '',
    type: 'OTHER',
    url: '',
  });
  const [feedbackModal, setFeedbackModal] = useState<{
    open: boolean;
    status: "success" | "error" | "warning" | "info" | "loading";
    title: string;
    description: string;
    primaryAction?: { label: string; onClick: () => void };
    secondaryAction?: { label: string; onClick: () => void };
  }>({
    open: false,
    status: "info",
    title: '',
    description: '',
  })

  // IAR state
  const [isCreateIarModalOpen, setIsCreateIarModalOpen] = useState(false);
  const [iarFormData, setIarFormData] = useState({
    title: '',
    description: '',
    url: '',
    color: '#ef4444',
  });
  const [editingIarId, setEditingIarId] = useState<number | null>(null);
  const [editIarFormData, setEditIarFormData] = useState({
    title: '',
    description: '',
    url: '',
    color: '#ef4444',
    isActive: true,
  });

  const { data: iarItems, isLoading: iarLoading } = useUserImmediateAttention(id);
  const createIarMutation = useCreateImmediateAttention({
    onSuccess: () => {
      setIsCreateIarModalOpen(false);
      setIarFormData({ title: '', description: '', url: '', color: '#ef4444' });
      toast({ title: "IAR Item Created", description: "Immediate attention item added successfully." });
    },
    onError: (err: any) => {
      toast({ title: "Error", description: err.message || "Failed to create IAR item.", variant: "destructive" });
    },
  });
  const updateIarMutation = useUpdateImmediateAttention({
    onSuccess: () => {
      setEditingIarId(null);
      toast({ title: "IAR Item Updated" });
    },
    onError: (err: any) => {
      toast({ title: "Error", description: err.message || "Failed to update IAR item.", variant: "destructive" });
    },
  });
  const deleteIarMutation = useDeleteImmediateAttention({
    onSuccess: () => {
      toast({ title: "IAR Item Deleted" });
    },
    onError: (err: any) => {
      toast({ title: "Error", description: err.message || "Failed to delete IAR item.", variant: "destructive" });
    },
  });

  const reorderIarMutation = useReorderImmediateAttention({
    onError: (err: any) => {
      toast({ title: "Error", description: err.message || "Failed to reorder IAR items.", variant: "destructive" });
    },
  });

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id || !iarItems) return;

    const itemsList = iarItems as ImmediateAttentionItem[];
    const oldIndex = itemsList.findIndex((i: any) => i.id.toString() === active.id);
    const newIndex = itemsList.findIndex((i: any) => i.id.toString() === over.id);
    if (oldIndex === -1 || newIndex === -1) return;

    const newOrder = arrayMove(itemsList, oldIndex, newIndex);
    const items = newOrder.map((item: any, idx: number) => ({ id: item.id, sortOrder: idx }));
    reorderIarMutation.mutate({ userId: id, items });
  };

  const [isEconomyEditing, setIsEconomyEditing] = useState(false);
  const [walletEditData, setWalletEditData] = useState({
    totalPoints: 0,
    totalPackages: 0,
  });

  const [isConvertAuthTypeModalOpen, setIsConvertAuthTypeModalOpen] = useState(false);
  const [targetAuthType, setTargetAuthType] = useState<string>("EMAIL_PASSWORD");
  const [convertNewPassword, setConvertNewPassword] = useState("");
  const [convertConfirmPassword, setConvertConfirmPassword] = useState("");

  const [isAddInvoiceModalOpen, setIsAddInvoiceModalOpen] = useState(false);
  const [addInvoicePaymentId, setAddInvoicePaymentId] = useState<number | null>(null);
  const [addInvoicePaymentLabel, setAddInvoicePaymentLabel] = useState("");
  const [addInvoiceFormData, setAddInvoiceFormData] = useState<any>({});

  const { data: userInvoices } = useUserInvoices(id);
  const { data: userNotifications, isLoading: isLoadingNotifications } = useUserNotifications(id);
  const { data: invoicePreviewData } = useInvoicePreview(isAddInvoiceModalOpen ? id : null);

  useEffect(() => {
    if (invoicePreviewData) {
      setAddInvoiceFormData(invoicePreviewData.preview || {});
    }
  }, [invoicePreviewData]);

  const [editingNotificationId, setEditingNotificationId] = useState<number | null>(null);
  const [editFormData, setEditFormData] = useState({
    title: '',
    description: '',
    url: '',
    isActive: true,
  });

  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);
  const [invoiceEditData, setInvoiceEditData] = useState<any>({});

  const [editProfileData, setEditProfileData] = useState<any>({});

  useEffect(() => {
    if (user) {
      setRoleSelection(user.role);
      setStatusSelection(user.status);
      setBanReason(user.banReason || "");
      setWalletEditData({
        totalPoints: user.wallet?.totalPoints || 0,
        totalPackages: user.wallet?.totalPackages || 0,
      });
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
        discovery_source: user.discoverySource || "",
      });
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

  const { data: notificationTypes, isLoading: isLoadingTypes } = useNotificationTypes();

  const updateInvoiceMutation = useUpdateInvoice({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["useUserInvoices", id] });
      setIsInvoiceModalOpen(false);
      setSelectedInvoice(null);
      toast({
        title: "Invoice Updated",
        description: "Invoice has been updated successfully.",
      });
    },
    onError: (err: any) => {
      toast({
        title: "Error",
        description: err.message || "Failed to update invoice.",
        variant: "destructive",
      });
    },
  });

  const generateDemoPaymentMutation = useGenerateDemoPayment({
    onSuccess: (data: any) => {
      setAddInvoicePaymentId(data.paymentId);
      setAddInvoicePaymentLabel(`Demo Payment: ${data.razorpayPaymentId}`);
      setAddInvoiceFormData((prev: any) => ({
        ...prev,
        invoice_type: prev.invoice_type || "IND",
      }));
      toast({
        title: "Demo Payment Generated",
        description: `Payment ID: ${data.razorpayPaymentId}`,
      });
    },
    onError: (err: any) => {
      toast({
        title: "Error",
        description: err.message || "Failed to generate demo payment.",
        variant: "destructive",
      });
    },
  });

  const createInvoiceMutation = useCreateInvoice({
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ["useUserInvoices", id] });
      setIsAddInvoiceModalOpen(false);
      setAddInvoicePaymentId(null);
      setAddInvoicePaymentLabel("");
      setAddInvoiceFormData({});
      toast({
        title: "Invoice Created",
        description: `Invoice #${data?.invoice_number || ""} created successfully.`,
      });
    },
    onError: (err: any) => {
      toast({
        title: "Error",
        description: err.message || "Failed to create invoice.",
        variant: "destructive",
      });
    },
  });

  const updateWalletMutation = useUpdateUserWallet({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["useUserById", id] });
      setIsEconomyEditing(false);
      toast({
        title: "Wallet Updated",
        description: "User's wallet balance has been updated successfully.",
      });
    },
    onError: (err: any) => {
      toast({
        title: "Error",
        description: err.message || "Failed to update wallet balance.",
        variant: "destructive",
      });
    },
  });

  const giftMutation = useGiftPointsAndPackages({
    onSuccess: () => {
      setIsGiftModalOpen(false);
      setGiftData({ points: 0, packages: 0 });
      toast({
        title: "Gift Sent!",
        description: "Points and packages have been gifted successfully.",
      });
    },
    onError: (err: any) => {
      toast({
        title: "Error",
        description: err.message || "Failed to gift points and packages.",
        variant: "destructive",
      });
    },
  });

  const createNotificationMutation = useCreateNotification({
    onSuccess: () => {
      setIsSendNotificationModalOpen(false);
      setNotificationData({ title: '', description: '', type: 'OTHER', url: '' });
      queryClient.invalidateQueries({ queryKey: ["useUserNotifications", id] });
      setFeedbackModal({
        open: true,
        status: 'success',
        title: 'Notification Sent!',
        description: 'The notification has been sent to the user successfully.',
        primaryAction: { label: 'OK', onClick: () => setFeedbackModal(prev => ({ ...prev, open: false })) },
      });
    },
    onError: (error: any) => {
      setFeedbackModal({
        open: true,
        status: 'error',
        title: 'Failed to Send',
        description: error?.message || 'Something went wrong. Please try again.',
        primaryAction: { label: 'OK', onClick: () => setFeedbackModal(prev => ({ ...prev, open: false })) },
      });
    },
  });

  const updateNotificationMutation = useUpdateNotification({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["useUserNotifications", id] });
      setEditingNotificationId(null);
      toast({ title: "Notification Updated" });
    },
    onError: (err: any) => {
      toast({ title: "Error", description: err.message || "Failed to update notification.", variant: "destructive" });
    },
  });

  const deleteNotificationMutation = useDeleteNotification({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["useUserNotifications", id] });
      setFeedbackModal(prev => ({ ...prev, open: false }));
      toast({ title: "Notification Deleted" });
    },
    onError: (err: any) => {
      toast({ title: "Error", description: err.message || "Failed to delete notification.", variant: "destructive" });
    },
  });

  const convertAuthTypeMutation = useConvertUserAuthType({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["useUserById", id] });
      queryClient.invalidateQueries({ queryKey: ["useAllUsers"] });
      setIsConvertAuthTypeModalOpen(false);
      setConvertNewPassword("");
      setConvertConfirmPassword("");
      setFeedbackModal({
        open: true,
        status: "success",
        title: "Login Method Converted",
        description: "The user's login method has been updated successfully.",
        primaryAction: { label: "OK", onClick: () => setFeedbackModal(prev => ({ ...prev, open: false })) },
      });
    },
    onError: (err: any) => {
      toast({
        title: "Error",
        description: err.message || "Failed to convert auth type.",
        variant: "destructive",
      });
    },
  });

  const handleSendNotification = () => {
    if (!notificationData.title || !notificationData.description) return;
    createNotificationMutation.mutate({
      title: notificationData.title,
      description: notificationData.description,
      type: notificationData.type || 'OTHER',
      url: notificationData.url || undefined,
      userId: id,
    });
  };

  const handleDeleteIar = (iarId: number) => {
    setFeedbackModal({
      open: true,
      status: 'warning',
      title: 'Delete IAR Item?',
      description: 'This action cannot be undone. The IAR item will be permanently removed.',
      primaryAction: {
        label: 'Delete',
        onClick: () => deleteIarMutation.mutate({ id: iarId, userId: id }),
      },
      secondaryAction: {
        label: 'Cancel',
        onClick: () => setFeedbackModal(prev => ({ ...prev, open: false })),
      },
    });
  };

  const handleDeleteNotification = (notifId: number) => {
    setFeedbackModal({
      open: true,
      status: 'warning',
      title: 'Delete Notification?',
      description: 'This action cannot be undone. The notification will be permanently removed.',
      primaryAction: {
        label: 'Delete',
        onClick: () => deleteNotificationMutation.mutate(notifId),
      },
      secondaryAction: {
        label: 'Cancel',
        onClick: () => setFeedbackModal(prev => ({ ...prev, open: false })),
      },
    });
  };

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
  const isSuperAdmin = (() => {
    const role = (session as any)?.role;
    const roleName = (typeof role === "string" ? role : role?.name)?.toLowerCase();
    return roleName === "super_admin" || roleName === "super admin";
  })();
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
    return roleDisplayNames[roleName] || roleName.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
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
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 w-full">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-br from-primary to-primary/10 bg-clip-text text-transparent">
                User Details
              </h2>
            </div>
            <div className="flex gap-2 sm:gap-4">
              <Button
                variant="outline"
                className="px-3"
                onClick={() => setIsSendNotificationModalOpen(true)}
              >
                <Send className="sm:mr-2 !h-3 !w-3 sm:!h-4 sm:!w-4" />
                <span className="hidden sm:block">Send Notification</span>
              </Button>
              {user.role === "user" && (
                <Button
                  variant="outline"
                  className="px-3"
                  onClick={() => {
                    setGiftData({ points: 0, packages: 0 });
                    setIsGiftModalOpen(true);
                  }}
                >
                  <Gift className="sm:mr-2 !h-3 !w-3 sm:!h-4 sm:!w-4" />
                  <span className="hidden sm:block">Gift Points & Packages</span>
                </Button>
              )}
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

              {isSuperAdmin && !isCurrentUser && user.status !== "Banned" && (
                <Button
                  variant="outline"
                  className="px-3"
                  onClick={() => {
                    setTargetAuthType(user.authType === "GOOGLE" ? "EMAIL_PASSWORD" : "GOOGLE");
                    setConvertNewPassword("");
                    setConvertConfirmPassword("");
                    setIsConvertAuthTypeModalOpen(true);
                  }}
                >
                  <ArrowLeftRight className="sm:mr-2 !h-3 !w-3 sm:!h-4 sm:!w-4" />
                  <span className="hidden sm:block">Convert Login Method</span>
                </Button>
              )}

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
                  {user.authType === "GOOGLE" ? (
                    <Badge variant="outline" className="border-blue-500 text-blue-600 dark:text-blue-400">
                      Google
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="border-green-500 text-green-600 dark:text-green-400">
                      Email & Password
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
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-semibold flex items-center gap-2">
                    <Wallet className="w-4 h-4 text-emerald-500" /> Account Economy
                  </CardTitle>
                  {isSuperAdmin && !isEconomyEditing && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setWalletEditData({
                          totalPoints: user.wallet?.totalPoints || 0,
                          totalPackages: user.wallet?.totalPackages || 0,
                        });
                        setIsEconomyEditing(true);
                      }}
                    >
                      <Edit className="w-4 h-4 mr-1" /> Edit
                    </Button>
                  )}
                </div>
                <CardDescription>
                  {isEconomyEditing
                    ? "Modify wallet balances directly. Changes take effect immediately."
                    : "Current wallet balances and lifetime transaction history for this user."}
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
                      {isEconomyEditing ? (
                        <Input
                          type="number"
                          min="0"
                          value={walletEditData.totalPoints}
                          onChange={(e) =>
                            setWalletEditData((prev) => ({
                              ...prev,
                              totalPoints: Math.max(0, parseInt(e.target.value) || 0),
                            }))
                          }
                        />
                      ) : (
                        <p className="text-2xl font-bold">{user.wallet?.totalPoints || 0}</p>
                      )}
                    </div>
                    <div className="space-y-1.5">
                      <p className="text-xs text-muted-foreground">Total Packages</p>
                      {isEconomyEditing ? (
                        <Input
                          type="number"
                          min="0"
                          value={walletEditData.totalPackages}
                          onChange={(e) =>
                            setWalletEditData((prev) => ({
                              ...prev,
                              totalPackages: Math.max(0, parseInt(e.target.value) || 0),
                            }))
                          }
                        />
                      ) : (
                        <p className="text-2xl font-bold">{user.wallet?.totalPackages || 0}</p>
                      )}
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
                {isEconomyEditing && (
                  <div className="flex items-center justify-end gap-2 pt-2">
                    <Button
                      variant="ghost"
                      onClick={() => setIsEconomyEditing(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={() =>
                        updateWalletMutation.mutate({
                          id: user.id,
                          totalPoints: walletEditData.totalPoints,
                          totalPackages: walletEditData.totalPackages,
                        })
                      }
                      disabled={updateWalletMutation.isPending}
                    >
                      {updateWalletMutation.isPending && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      Save Changes
                    </Button>
                  </div>
                )}
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

        {/* Notifications History */}
        <div className="mt-8">
          <Card className="border-l-4 border-l-purple-500">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <Bell className="w-4 h-4 text-purple-500" /> Notifications History
                </CardTitle>
                  <Button size="sm" onClick={() => {
                    setNotificationData({ title: '', description: '', type: 'OTHER', url: '' });
                    setIsSendNotificationModalOpen(true);
                  }}>
                    <Plus className="w-4 h-4 mr-0 sm:mr-2" /> <span className="hidden sm:inline">Send Notification</span>
                  </Button>
              </div>
              <CardDescription>
                All notifications sent to this user, including wallet updates and admin messages.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Notifications Table */}
              {isLoadingNotifications ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : userNotifications && userNotifications.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead className="max-w-xs">Description</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="w-[100px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {userNotifications.map((notif: any) => (
                      <TableRow key={notif.id}>
                        {editingNotificationId === notif.id ? (
                          <>
                            <TableCell>
                              <Input
                                value={editFormData.title}
                                onChange={(e) =>
                                  setEditFormData((prev) => ({ ...prev, title: e.target.value }))
                                }
                              />
                            </TableCell>
                            <TableCell>
                              <Textarea
                                className="min-h-[60px]"
                                value={editFormData.description}
                                onChange={(e) =>
                                  setEditFormData((prev) => ({
                                    ...prev,
                                    description: e.target.value,
                                  }))
                                }
                              />
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline" className="text-xs">
                                {notif.type?.replace(/_/g, " ")}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Button
                                variant="ghost"
                                size="sm"
                                className={`text-xs ${
                                  editFormData.isActive
                                    ? "text-green-600 dark:text-green-400"
                                    : "text-muted-foreground"
                                }`}
                                onClick={() =>
                                  setEditFormData((prev) => ({
                                    ...prev,
                                    isActive: !prev.isActive,
                                  }))
                                }
                              >
                                <span
                                  className={`h-1.5 w-1.5 rounded-full mr-1.5 ${
                                    editFormData.isActive
                                      ? "bg-green-500"
                                      : "bg-muted-foreground"
                                  }`}
                                />
                                {editFormData.isActive ? "Active" : "Inactive"}
                              </Button>
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground">
                              {formatDate(notif.createdAt)}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0"
                                  onClick={() =>
                                    updateNotificationMutation.mutate({
                                      id: notif.id,
                                      title: editFormData.title,
                                      description: editFormData.description,
                                      isActive: editFormData.isActive,
                                      url: editFormData.url || undefined,
                                    })
                                  }
                                  disabled={updateNotificationMutation.isPending}
                                  title="Save"
                                >
                                  {updateNotificationMutation.isPending ? (
                                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                  ) : (
                                    <CheckCircle2 className="h-3.5 w-3.5" />
                                  )}
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0"
                                  onClick={() => setEditingNotificationId(null)}
                                  title="Cancel"
                                >
                                  <X className="h-3.5 w-3.5" />
                                </Button>
                              </div>
                            </TableCell>
                          </>
                        ) : (
                          <>
                            <TableCell className="font-medium">{notif.title}</TableCell>
                            <TableCell
                              className="max-w-xs truncate"
                              title={notif.description}
                            >
                              {notif.description}
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline" className="text-xs">
                                {notif.type?.replace(/_/g, " ")}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <button
                                className={`inline-flex items-center gap-1.5 text-xs cursor-pointer hover:opacity-80 ${
                                  notif.isActive
                                    ? "text-green-600 dark:text-green-400"
                                    : "text-muted-foreground"
                                }`}
                                onClick={() => {
                                  setEditFormData({
                                    title: notif.title,
                                    description: notif.description,
                                    url: notif.url || '',
                                    isActive: !notif.isActive,
                                  });
                                  updateNotificationMutation.mutate({
                                    id: notif.id,
                                    isActive: !notif.isActive,
                                  });
                                }}
                                title="Toggle status"
                              >
                                <span
                                  className={`h-1.5 w-1.5 rounded-full ${
                                    notif.isActive ? "bg-green-500" : "bg-muted-foreground"
                                  }`}
                                />
                                {notif.isActive ? "Active" : "Inactive"}
                              </button>
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground">
                              {formatDate(notif.createdAt)}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0"
                                  onClick={() => {
                                    setEditingNotificationId(notif.id);
                                    setEditFormData({
                                      title: notif.title,
                                      description: notif.description,
                                      url: notif.url || '',
                                      isActive: notif.isActive,
                                    });
                                  }}
                                >
                                  <Edit className="h-3.5 w-3.5" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0 text-red-500 hover:text-red-600"
                                  onClick={() => handleDeleteNotification(notif.id)}
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </Button>
                              </div>
                            </TableCell>
                          </>
                        )}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="py-8 text-center text-sm text-muted-foreground">
                  <Bell className="h-8 w-8 mx-auto mb-2 opacity-30" />
                  <p>No notifications sent to this user yet.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Immediate Attention Required */}
        <div className="mt-8">
          <Card className="border-l-4 border-l-red-500">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-500" /> Immediate Attention Required
                </CardTitle>
                <Button size="sm" onClick={() => {
                  setIarFormData({ title: '', description: '', url: '', color: '#ef4444' });
                  setIsCreateIarModalOpen(true);
                }}>
                  <Plus className="w-4 h-4 mr-0 sm:mr-2" /> <span className="hidden sm:inline">Add IAR</span>
                </Button>
              </div>
              <CardDescription>
                Admin-managed urgent cards shown to this user on their dashboard.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {iarLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : iarItems && iarItems.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-10"></TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead className="max-w-xs">Description</TableHead>
                      <TableHead>URL</TableHead>
                      <TableHead>Color</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="w-[80px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                    <SortableContext items={iarItems.map((i: any) => i.id.toString())} strategy={verticalListSortingStrategy}>
                      <TableBody>
                        {iarItems.map((item: any) => (
                          <IarTableRow
                            key={item.id}
                            item={item}
                            isEditing={editingIarId === item.id}
                            editFormData={editIarFormData}
                            updatePending={updateIarMutation.isPending}
                            onFormChange={(key: string, value: any) =>
                              setEditIarFormData((prev) => ({ ...prev, [key]: value }))
                            }
                            onSave={() => {
                              const payload: any = { id: item.id, userId: id };
                              if (editIarFormData.title !== item.title) payload.title = editIarFormData.title;
                              if (editIarFormData.description !== item.description) payload.description = editIarFormData.description;
                              if (editIarFormData.url !== (item.url || '')) payload.url = editIarFormData.url || null;
                              if (editIarFormData.color !== item.color) payload.color = editIarFormData.color;
                              if (editIarFormData.isActive !== item.isActive) payload.isActive = editIarFormData.isActive;
                              updateIarMutation.mutate(payload);
                            }}
                            onCancel={() => setEditingIarId(null)}
                            onStartEdit={() => {
                              setEditingIarId(item.id);
                              setEditIarFormData({
                                title: item.title,
                                description: item.description,
                                url: item.url || '',
                                color: item.color || '#ef4444',
                                isActive: item.isActive,
                              });
                            }}
                            onDelete={() => handleDeleteIar(item.id)}
                            onToggleStatus={() => updateIarMutation.mutate({ id: item.id, userId: id, isActive: !item.isActive })}
                          />
                        ))}
                      </TableBody>
                    </SortableContext>
                  </DndContext>
                </Table>
              ) : (
                <div className="py-8 text-center text-sm text-muted-foreground">
                  <AlertTriangle className="h-8 w-8 mx-auto mb-2 opacity-30" />
                  <p>No immediate attention items for this user.</p>
                </div>
              )}
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

            {/* Discovery Source */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <Hand className="w-4 h-4" /> Discovery Source
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm">
                {user.discoverySourceAnswered ? (
                  <div className="flex items-center gap-2">
                    <span className="font-medium capitalize">{user.discoverySource?.replace(/_/g, " ") || "—"}</span>
                  </div>
                ) : (
                  <p className="text-muted-foreground text-sm">Not Answered</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Invoices */}
        {isSuperAdmin && (
          <div className="mt-10">
            <Card className="border-l-4 border-l-purple-500">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-semibold flex items-center gap-2">
                    <FileText className="w-4 h-4 text-purple-500" /> Invoices
                  </CardTitle>
                  <Button size="sm" onClick={() => {
                    setAddInvoiceFormData({});
                    setAddInvoicePaymentId(null);
                    setAddInvoicePaymentLabel("");
                    setIsAddInvoiceModalOpen(true);
                  }}>
                    <Plus className="w-4 h-4 mr-0 sm:mr-2" /> <span className="hidden sm:inline">Add New Invoice</span>
                  </Button>
                </div>
                <CardDescription>
                  All invoices issued to this user.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {userInvoices?.invoices?.length > 0 ? (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Invoice #</TableHead>
                          <TableHead>Service</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {userInvoices.invoices.map((inv: any) => (
                          <TableRow key={inv.id}>
                            <TableCell className="font-mono text-xs font-medium">
                              {inv.invoice_number}
                            </TableCell>
                            <TableCell>{inv.service_name}</TableCell>
                            <TableCell>
                              {inv.payment?.currency || "INR"} {((inv.payment?.amount || 0) / 100).toLocaleString("en-IN")}
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant="outline"
                                className={
                                  inv.payment?.status === "CAPTURED"
                                    ? "bg-green-500/20 text-green-700 dark:bg-green-500/10 dark:text-green-400"
                                    : "bg-yellow-500/20 text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-400"
                                }
                              >
                                {inv.payment?.status || "UNKNOWN"}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-muted-foreground text-xs">
                              {formatDate(inv.createdAt)}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-1">
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => window.open(`/admin/invoice/${inv.invoice_number}`, "_blank")}
                                    >
                                      <Eye className="w-4 h-4" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>View invoice</TooltipContent>
                                </Tooltip>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => {
                                        setSelectedInvoice(inv);
                                        setInvoiceEditData({
                                      invoice_number: inv.invoice_number || "",
                                      service_name: inv.service_name || "",
                                      period: inv.period || "",
                                      quantity: inv.quantity || 1,
                                      unit_price: inv.unit_price || 0,
                                      tax_rate: inv.tax_rate || 0,
                                      cgst_amount: inv.cgst_amount || 0,
                                      sgst_amount: inv.sgst_amount || 0,
                                      igst_amount: inv.igst_amount || 0,
                                      due_date: inv.due_date ? inv.due_date.split("T")[0] : "",
                                      place_of_supply: inv.place_of_supply || "",
                                      supply_type: inv.supply_type || "",
                                      amount_in_words: inv.amount_in_words || "",
                                      lut_number: inv.lut_number || "",
                                      sac_code: inv.sac_code || "",
                                    });
                                    setIsInvoiceModalOpen(true);
                                  }}
                                >
                                  <Pencil className="w-4 h-4" />
                                </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>Edit invoice</TooltipContent>
                                </Tooltip>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <p className="text-muted-foreground text-sm py-4 text-center">
                    No invoices found for this user.
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        )}

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
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {user.recentSubmissions.map((sub: any) => (
                            <TableRow key={sub.id}>
                              <TableCell className="font-medium">
                                {sub.appName || "Unknown"}
                              </TableCell>
                              <TableCell>
                                <Badge variant="outline" className={APP_TYPE_COLORS[sub.appType] || ""}>{sub.appType}</Badge>
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
                              <TableCell className="text-right">
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => {
                                        const baseUrl = sub.appType === "PAID" ? "/admin/submissions-paid" : "/admin/submissions-free";
                                        window.open(`${baseUrl}/${sub.id}`, "_blank");
                                      }}
                                    >
                                      <Eye className="w-4 h-4" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>View app</TooltipContent>
                                </Tooltip>
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
                      {(rolesData || []).map((role: { name: string; isProtected: boolean }) => {
                        const isElevated = role.name === "admin" || role.name === "super_admin";
                        const disabled = isElevated && !isSuperAdmin;
                        return (
                          <SelectItem key={role.name} value={role.name} disabled={disabled}>
                            {role.name.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                            {disabled && " (Super Admin only)"}
                          </SelectItem>
                        );
                      })}
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

            <Separator />

            {/* Section 6: Discovery Source */}
            <div>
              <h4 className="text-base font-bold border-b pb-2 mb-4">Discovery Source</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>How did this user discover us?</Label>
                  <Select
                    value={editProfileData.discovery_source}
                    onValueChange={(val) => setEditProfileData((prev: any) => ({ ...prev, discovery_source: val }))}
                  >
                    <SelectTrigger><SelectValue placeholder="Not answered" /></SelectTrigger>
                    <SelectContent position="popper">
                      <SelectItem value="youtube">YouTube</SelectItem>
                      <SelectItem value="google_search">Google Search</SelectItem>
                      <SelectItem value="chatgpt">ChatGPT</SelectItem>
                      <SelectItem value="gemini">Gemini</SelectItem>
                      <SelectItem value="twitter_x">Twitter / X</SelectItem>
                      <SelectItem value="reddit">Reddit</SelectItem>
                      <SelectItem value="friend_colleague">Friend or Colleague</SelectItem>
                      <SelectItem value="blog_article">Blog or Article</SelectItem>
                      <SelectItem value="linkedin">LinkedIn</SelectItem>
                      <SelectItem value="facebook_instagram">Facebook / Instagram</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
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

      {/* Send Notification Modal */}
      <Dialog open={isSendNotificationModalOpen} onOpenChange={setIsSendNotificationModalOpen}>
        <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>Send Notification to {user.name}</DialogTitle>
            <DialogDescription>
              Send a notification directly to this user.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4 overflow-y-auto flex-1 pr-2 -mr-2">
            <div className="grid gap-2">
              <Label htmlFor="notif-title">Title</Label>
              <Input
                id="notif-title"
                placeholder="Notification title"
                value={notificationData.title}
                onChange={(e) => setNotificationData({ ...notificationData, title: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="notif-description">Description</Label>
              <Textarea
                id="notif-description"
                placeholder="Notification description"
                value={notificationData.description}
                onChange={(e) => setNotificationData({ ...notificationData, description: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="notif-type">Type</Label>
              {isLoadingTypes ? (
                <div className="flex items-center justify-center h-10 rounded-md border border-input bg-background">
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                </div>
              ) : (
                <Select
                  value={notificationData.type}
                  onValueChange={(value) => setNotificationData({ ...notificationData, type: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {(notificationTypes || []).map((type: string) => (
                      <SelectItem key={type} value={type}>
                        {type.replace(/_/g, ' ')}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="notif-url">URL (Optional)</Label>
              <Input
                id="notif-url"
                placeholder="https://example.com"
                value={notificationData.url}
                onChange={(e) => setNotificationData({ ...notificationData, url: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter className="shrink-0">
            <Button variant="ghost" onClick={() => setIsSendNotificationModalOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSendNotification}
              disabled={createNotificationMutation.isPending || !notificationData.title || !notificationData.description}
            >
              {createNotificationMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Send Notification
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Gift Points & Packages Modal */}
      <Dialog open={isGiftModalOpen} onOpenChange={setIsGiftModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Gift Points & Packages to {user.name}</DialogTitle>
            <DialogDescription>
              Gift points and/or packages to this user. The amounts will be added to their existing balances.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="gift-points">Points</Label>
              <Input
                id="gift-points"
                type="number"
                min="0"
                placeholder="0"
                value={giftData.points || ""}
                onChange={(e) =>
                  setGiftData((prev) => ({
                    ...prev,
                    points: Math.max(0, parseInt(e.target.value) || 0),
                  }))
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="gift-packages">Packages</Label>
              <Input
                id="gift-packages"
                type="number"
                min="0"
                placeholder="0"
                value={giftData.packages || ""}
                onChange={(e) =>
                  setGiftData((prev) => ({
                    ...prev,
                    packages: Math.max(0, parseInt(e.target.value) || 0),
                  }))
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsGiftModalOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() =>
                giftMutation.mutate({
                  id,
                  points: giftData.points || undefined,
                  packages: giftData.packages || undefined,
                })
              }
              disabled={
                giftMutation.isPending ||
                (giftData.points <= 0 && giftData.packages <= 0)
              }
            >
              {giftMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Gift
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Immediate Attention Required Modal */}
      <Dialog open={isCreateIarModalOpen} onOpenChange={setIsCreateIarModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add Immediate Attention Required</DialogTitle>
            <DialogDescription>
              Create an urgent card that will appear on {user.name}'s dashboard.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="iar-title">Title</Label>
              <Input
                id="iar-title"
                placeholder="Card title"
                value={iarFormData.title}
                onChange={(e) => setIarFormData({ ...iarFormData, title: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="iar-description">Description</Label>
              <Textarea
                id="iar-description"
                placeholder="Card description"
                value={iarFormData.description}
                onChange={(e) => setIarFormData({ ...iarFormData, description: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="iar-url">URL (Optional)</Label>
              <Input
                id="iar-url"
                placeholder="https://example.com"
                value={iarFormData.url}
                onChange={(e) => setIarFormData({ ...iarFormData, url: e.target.value })}
              />
              {iarFormData.url && !/^https?:\/\/.+/.test(iarFormData.url) && (
                <p className="text-xs text-red-500">URL must start with http:// or https://</p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="iar-color">Card Color</Label>
              <div className="flex items-center gap-3">
                <Input
                  id="iar-color"
                  type="color"
                  value={iarFormData.color}
                  onChange={(e) => setIarFormData({ ...iarFormData, color: e.target.value })}
                  className="w-14 h-10 p-1 cursor-pointer"
                />
                <span className="text-xs text-muted-foreground">{iarFormData.color}</span>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsCreateIarModalOpen(false)}>Cancel</Button>
            <Button
              onClick={() => {
                if (iarFormData.url && !/^https?:\/\/.+/.test(iarFormData.url)) {
                  toast({ title: "Validation Error", description: "URL must start with http:// or https://", variant: "destructive" });
                  return;
                }
                createIarMutation.mutate({
                  userId: id,
                  title: iarFormData.title,
                  description: iarFormData.description,
                  url: iarFormData.url || undefined,
                  color: iarFormData.color,
                });
              }}
              disabled={createIarMutation.isPending || !iarFormData.title || !iarFormData.description}
            >
              {createIarMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create IAR Item
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Invoice Modal */}
      <Dialog open={isInvoiceModalOpen} onOpenChange={(open) => { setIsInvoiceModalOpen(open); if (!open) setSelectedInvoice(null); }}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" /> Edit Invoice
            </DialogTitle>
            <DialogDescription>
              Invoice #{selectedInvoice?.invoice_number} for {user.name}.
            </DialogDescription>
          </DialogHeader>
          <div className="bg-amber-500/10 border border-amber-500/20 p-3 rounded-md text-xs text-amber-700 dark:text-amber-400 mb-4">
            Only Super Admins can modify invoices. Changes take effect immediately.
          </div>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Invoice Number</Label>
              <Input
                value={invoiceEditData.invoice_number || ""}
                onChange={(e) => setInvoiceEditData((prev: any) => ({ ...prev, invoice_number: e.target.value }))}
              />
              <p className="text-xs text-amber-600 dark:text-amber-400">
                Changing the invoice number breaks existing links.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Service Name</Label>
                <Input
                  value={invoiceEditData.service_name || ""}
                  onChange={(e) => setInvoiceEditData((prev: any) => ({ ...prev, service_name: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>SAC Code</Label>
                <Input
                  value={invoiceEditData.sac_code || ""}
                  onChange={(e) => setInvoiceEditData((prev: any) => ({ ...prev, sac_code: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Period</Label>
                <Input
                  value={invoiceEditData.period || ""}
                  onChange={(e) => setInvoiceEditData((prev: any) => ({ ...prev, period: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Quantity</Label>
                <Input
                  type="number"
                  min="1"
                  value={invoiceEditData.quantity || 1}
                  onChange={(e) => setInvoiceEditData((prev: any) => ({ ...prev, quantity: Math.max(1, parseInt(e.target.value) || 1) }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Unit Price (in paise)</Label>
                <Input
                  type="number"
                  min="0"
                  value={invoiceEditData.unit_price || 0}
                  onChange={(e) => setInvoiceEditData((prev: any) => ({ ...prev, unit_price: Math.max(0, parseInt(e.target.value) || 0) }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Tax Rate (%)</Label>
                <Input
                  type="number"
                  min="0"
                  value={invoiceEditData.tax_rate || 0}
                  onChange={(e) => setInvoiceEditData((prev: any) => ({ ...prev, tax_rate: Math.max(0, parseInt(e.target.value) || 0) }))}
                />
              </div>
              <div className="space-y-2">
                <Label>CGST Amount</Label>
                <Input
                  type="number"
                  min="0"
                  value={invoiceEditData.cgst_amount || 0}
                  onChange={(e) => setInvoiceEditData((prev: any) => ({ ...prev, cgst_amount: Math.max(0, parseInt(e.target.value) || 0) }))}
                />
              </div>
              <div className="space-y-2">
                <Label>SGST Amount</Label>
                <Input
                  type="number"
                  min="0"
                  value={invoiceEditData.sgst_amount || 0}
                  onChange={(e) => setInvoiceEditData((prev: any) => ({ ...prev, sgst_amount: Math.max(0, parseInt(e.target.value) || 0) }))}
                />
              </div>
              <div className="space-y-2">
                <Label>IGST Amount</Label>
                <Input
                  type="number"
                  min="0"
                  value={invoiceEditData.igst_amount || 0}
                  onChange={(e) => setInvoiceEditData((prev: any) => ({ ...prev, igst_amount: Math.max(0, parseInt(e.target.value) || 0) }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Due Date</Label>
                <Input
                  type="date"
                  value={invoiceEditData.due_date || ""}
                  onChange={(e) => setInvoiceEditData((prev: any) => ({ ...prev, due_date: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Place of Supply</Label>
                <Input
                  value={invoiceEditData.place_of_supply || ""}
                  onChange={(e) => setInvoiceEditData((prev: any) => ({ ...prev, place_of_supply: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Supply Type</Label>
                <Input
                  value={invoiceEditData.supply_type || ""}
                  onChange={(e) => setInvoiceEditData((prev: any) => ({ ...prev, supply_type: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>LUT Number</Label>
                <Input
                  value={invoiceEditData.lut_number || ""}
                  onChange={(e) => setInvoiceEditData((prev: any) => ({ ...prev, lut_number: e.target.value }))}
                />
              </div>
              <div className="space-y-2 col-span-2">
                <Label>Amount in Words</Label>
                <Textarea
                  value={invoiceEditData.amount_in_words || ""}
                  onChange={(e) => setInvoiceEditData((prev: any) => ({ ...prev, amount_in_words: e.target.value }))}
                />
              </div>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="ghost" onClick={() => { setIsInvoiceModalOpen(false); setSelectedInvoice(null); }}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (!selectedInvoice) return;
                const payload: any = { id: selectedInvoice.id };
                const fields = [
                  "invoice_number", "service_name", "period", "quantity", "unit_price",
                  "tax_rate", "cgst_amount", "sgst_amount", "igst_amount",
                  "due_date", "place_of_supply", "supply_type",
                  "amount_in_words", "lut_number", "sac_code",
                ];
                for (const f of fields) {
                  if (invoiceEditData[f] !== undefined) {
                    payload[f] = invoiceEditData[f];
                  }
                }
                updateInvoiceMutation.mutate(payload);
              }}
              disabled={updateInvoiceMutation.isPending}
            >
              {updateInvoiceMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Save Invoice
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Convert Auth Type Modal */}
      <Dialog open={isConvertAuthTypeModalOpen} onOpenChange={(open) => { setIsConvertAuthTypeModalOpen(open); if (!open) { setConvertNewPassword(""); setConvertConfirmPassword(""); setTargetAuthType(""); } }}>
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ArrowLeftRight className="w-5 h-5" /> Convert Login Method
            </DialogTitle>
            <DialogDescription>
              Change how this user authenticates. All active sessions will be invalidated.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex items-center justify-center gap-3 text-sm">
              <Badge variant="secondary" className="text-xs px-3 py-1">
                {user.authType === "GOOGLE" ? "Google" : "Email & Password"}
              </Badge>
              <ArrowLeftRight className="w-4 h-4 text-muted-foreground" />
              <Badge variant="secondary" className="text-xs px-3 py-1">
                {targetAuthType === "GOOGLE" ? "Google" : "Email & Password"}
              </Badge>
            </div>

            {targetAuthType === "EMAIL_PASSWORD" ? (
              <>
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    placeholder="Minimum 8 characters"
                    maxLength={128}
                    value={convertNewPassword}
                    onChange={(e) => setConvertNewPassword(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Re-enter password"
                    maxLength={128}
                    value={convertConfirmPassword}
                    onChange={(e) => setConvertConfirmPassword(e.target.value)}
                  />
                </div>
                {convertNewPassword && convertConfirmPassword && convertNewPassword !== convertConfirmPassword && (
                  <p className="text-xs text-red-500">Passwords do not match</p>
                )}
              </>
            ) : (
              <div className="bg-amber-500/10 border border-amber-500/20 p-3 rounded-md text-xs text-amber-700 dark:text-amber-400">
                The credential account will be removed and the user's sessions will be invalidated.
                The user must sign in with Google on their next login to re-link their account.
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsConvertAuthTypeModalOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (targetAuthType === "EMAIL_PASSWORD") {
                  if (!convertNewPassword || convertNewPassword.length < 8 || convertNewPassword.length > 128) return;
                  if (convertNewPassword !== convertConfirmPassword) return;
                  convertAuthTypeMutation.mutate({
                    userId: id,
                    newAuthType: "EMAIL_PASSWORD",
                    newPassword: convertNewPassword,
                  });
                } else {
                  convertAuthTypeMutation.mutate({
                    userId: id,
                    newAuthType: "GOOGLE",
                  });
                }
              }}
              disabled={
                convertAuthTypeMutation.isPending ||
                (targetAuthType === "EMAIL_PASSWORD" &&
                  (!convertNewPassword || convertNewPassword.length < 8 || convertNewPassword.length > 128 || convertNewPassword !== convertConfirmPassword))
              }
            >
              {convertAuthTypeMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Convert to {targetAuthType === "GOOGLE" ? "Google" : "Email & Password"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Invoice Modal */}
      <Dialog open={isAddInvoiceModalOpen} onOpenChange={(open) => { setIsAddInvoiceModalOpen(open); if (!open) { setAddInvoicePaymentId(null); setAddInvoicePaymentLabel(""); setAddInvoiceFormData({}); } }}>
        <DialogContent className="sm:max-w-[650px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" /> Add New Invoice
            </DialogTitle>
            <DialogDescription>
              Create a new invoice for {user?.name}. All fields can be edited before saving.
            </DialogDescription>
          </DialogHeader>

          <div className="bg-amber-500/10 border border-amber-500/20 p-3 rounded-md text-xs text-amber-700 dark:text-amber-400 mb-4">
            Only Super Admins can create invoices. Changes take effect immediately.
          </div>

          {/* Payment ID */}
          <div className="border border-border rounded-md p-4 mb-4">
            <Label className="text-sm font-semibold mb-3 block">Payment ID</Label>
            <div className="flex items-center gap-3">
              <Input
                type="number"
                min="1"
                placeholder="Enter payment ID..."
                value={addInvoicePaymentId ?? ""}
                onChange={(e) => setAddInvoicePaymentId(e.target.value ? parseInt(e.target.value) : null)}
                className="flex-1"
              />
              <Button
                size="sm"
                onClick={() => {
                  const unitPrice = Math.max(0, Math.round(addInvoiceFormData.unit_price || 0));
                  const quantity = Math.max(1, Math.round(addInvoiceFormData.quantity || 1));
                  const amount = unitPrice * quantity;
                  generateDemoPaymentMutation.mutate({
                    userId: id,
                    amount,
                    quantity,
                    currency: "INR",
                  });
                }}
                disabled={generateDemoPaymentMutation.isPending || (addInvoiceFormData.unit_price || 0) <= 0}
              >
                {generateDemoPaymentMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Generate Demo
              </Button>
            </div>
            {addInvoicePaymentLabel && (
              <p className="text-xs mt-2 text-green-600 dark:text-green-400">{addInvoicePaymentLabel}</p>
            )}
          </div>

          {/* Invoice Fields */}
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Invoice Number</Label>
              <Input
                value={addInvoiceFormData.invoice_number || ""}
                onChange={(e) => setAddInvoiceFormData((prev: any) => ({ ...prev, invoice_number: e.target.value }))}
                placeholder="Auto-generated if empty"
              />
              <p className="text-xs text-amber-600 dark:text-amber-400">
                Changing the invoice number may generate a new unique one if taken.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Service Name</Label>
                <Input
                  value={addInvoiceFormData.service_name || ""}
                  onChange={(e) => setAddInvoiceFormData((prev: any) => ({ ...prev, service_name: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>SAC Code</Label>
                <Input
                  value={addInvoiceFormData.sac_code || ""}
                  onChange={(e) => setAddInvoiceFormData((prev: any) => ({ ...prev, sac_code: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Period</Label>
                <Input
                  value={addInvoiceFormData.period || ""}
                  onChange={(e) => setAddInvoiceFormData((prev: any) => ({ ...prev, period: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Quantity</Label>
                <Input
                  type="number"
                  min="1"
                  value={addInvoiceFormData.quantity || 1}
                  onChange={(e) => {
                    const qty = Math.max(1, parseInt(e.target.value) || 1);
                    setAddInvoiceFormData((prev: any) => ({
                      ...prev,
                      quantity: qty,
                    }));
                  }}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Unit Price (in paise)</Label>
                  <Input
                    type="number"
                    min="0"
                    value={addInvoiceFormData.unit_price || 0}
                    onChange={(e) => {
                      const price = Math.max(0, parseInt(e.target.value) || 0);
                      setAddInvoiceFormData((prev: any) => ({
                        ...prev,
                        unit_price: price,
                      }));
                    }}
                />
              </div>
              <div className="space-y-2">
                <Label>Tax Rate (%)</Label>
                <Input
                  type="number"
                  min="0"
                  value={addInvoiceFormData.tax_rate || 0}
                  disabled
                  className="bg-muted"
                />
              </div>
              <div className="space-y-2">
                <Label>CGST Amount</Label>
                <Input
                  type="number"
                  min="0"
                  value={addInvoiceFormData.cgst_amount || 0}
                  disabled
                  className="bg-muted"
                />
              </div>
              <div className="space-y-2">
                <Label>SGST Amount</Label>
                <Input
                  type="number"
                  min="0"
                  value={addInvoiceFormData.sgst_amount || 0}
                  disabled
                  className="bg-muted"
                />
              </div>
              <div className="space-y-2">
                <Label>IGST Amount</Label>
                <Input
                  type="number"
                  min="0"
                  value={addInvoiceFormData.igst_amount || 0}
                  disabled
                  className="bg-muted"
                />
              </div>
              <div className="col-span-2">
                <p className="text-xs text-muted-foreground">
                  Tax is auto-calculated on save based on unit price, quantity, and invoice type. Edit tax after creation via the Edit Invoice modal.
                </p>
              </div>
              <div className="space-y-2">
                <Label>Due Date</Label>
                <Input
                  type="date"
                  value={addInvoiceFormData.due_date || ""}
                  onChange={(e) => setAddInvoiceFormData((prev: any) => ({ ...prev, due_date: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Place of Supply</Label>
                <Input
                  value={addInvoiceFormData.place_of_supply || ""}
                  onChange={(e) => setAddInvoiceFormData((prev: any) => ({ ...prev, place_of_supply: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Supply Type</Label>
                <Input
                  value={addInvoiceFormData.supply_type || ""}
                  onChange={(e) => setAddInvoiceFormData((prev: any) => ({ ...prev, supply_type: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>LUT Number</Label>
                <Input
                  value={addInvoiceFormData.lut_number || ""}
                  onChange={(e) => setAddInvoiceFormData((prev: any) => ({ ...prev, lut_number: e.target.value }))}
                />
              </div>
              <div className="space-y-2 col-span-2">
                <Label>Amount in Words</Label>
                <Textarea
                  value={addInvoiceFormData.amount_in_words || ""}
                  onChange={(e) => setAddInvoiceFormData((prev: any) => ({ ...prev, amount_in_words: e.target.value }))}
                />
                <p className="text-xs text-muted-foreground">
                  Auto-calculated on save based on unit price, quantity, and tax if left empty.
                </p>
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button variant="ghost" onClick={() => { setIsAddInvoiceModalOpen(false); setAddInvoicePaymentId(null); setAddInvoicePaymentLabel(""); }}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (!addInvoicePaymentId) return;
                createInvoiceMutation.mutate({
                  paymentId: addInvoicePaymentId,
                  userId: id,
                  invoice_number: addInvoiceFormData.invoice_number || undefined,
                  invoice_type: addInvoiceFormData.invoice_type || "IND",
                  service_name: addInvoiceFormData.service_name || undefined,
                  sac_code: addInvoiceFormData.sac_code || undefined,
                  period: addInvoiceFormData.period || undefined,
                  quantity: addInvoiceFormData.quantity || 1,
                  unit_price: addInvoiceFormData.unit_price || 0,
                  tax_rate: addInvoiceFormData.tax_rate || 0,
                  cgst_amount: addInvoiceFormData.cgst_amount || 0,
                  sgst_amount: addInvoiceFormData.sgst_amount || 0,
                  igst_amount: addInvoiceFormData.igst_amount || 0,
                  due_date: addInvoiceFormData.due_date || undefined,
                  place_of_supply: addInvoiceFormData.place_of_supply || undefined,
                  supply_type: addInvoiceFormData.supply_type || undefined,
                  amount_in_words: addInvoiceFormData.amount_in_words || undefined,
                  lut_number: addInvoiceFormData.lut_number || undefined,
                });
              }}
              disabled={!addInvoicePaymentId || createInvoiceMutation.isPending}
            >
              {createInvoiceMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Invoice
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <FeedbackModal
        open={feedbackModal.open}
        onOpenChange={(open) => setFeedbackModal(prev => ({ ...prev, open }))}
        status={feedbackModal.status}
        title={feedbackModal.title}
        description={feedbackModal.description}
        primaryAction={feedbackModal.primaryAction}
        secondaryAction={feedbackModal.secondaryAction}
      />
    </>
  );
}

function IarTableRow({
  item,
  isEditing,
  editFormData,
  onFormChange,
  onSave,
  onCancel,
  onStartEdit,
  onDelete,
  onToggleStatus,
  updatePending,
}: {
  item: ImmediateAttentionItem;
  isEditing: boolean;
  editFormData: { title: string; description: string; url: string; color: string; isActive: boolean };
  onFormChange: (key: string, value: any) => void;
  onSave: () => void;
  onCancel: () => void;
  onStartEdit: () => void;
  onDelete: () => void;
  onToggleStatus: () => void;
  updatePending: boolean;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: item.id.toString(),
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : undefined,
  };

  return (
    <TableRow ref={setNodeRef} style={style} className={isDragging ? "relative z-50" : ""}>
      {isEditing ? (
        <>
          <TableCell>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0 cursor-default">
                <GripVertical className="h-3.5 w-3.5 opacity-30" />
              </Button>
            </div>
          </TableCell>
          <TableCell>
            <Input
              value={editFormData.title}
              onChange={(e) => onFormChange("title", e.target.value)}
            />
          </TableCell>
          <TableCell>
            <Textarea
              className="min-h-[60px]"
              value={editFormData.description}
              onChange={(e) => onFormChange("description", e.target.value)}
            />
          </TableCell>
          <TableCell>
            <Input
              value={editFormData.url}
              onChange={(e) => onFormChange("url", e.target.value)}
              placeholder="https://"
            />
          </TableCell>
          <TableCell>
            <Input
              type="color"
              value={editFormData.color}
              onChange={(e) => onFormChange("color", e.target.value)}
              className="w-12 h-9 p-1 cursor-pointer"
            />
          </TableCell>
          <TableCell>
            <Button
              variant="ghost"
              size="sm"
              className={`text-xs ${editFormData.isActive ? "text-green-600 dark:text-green-400" : "text-muted-foreground"}`}
              onClick={() => onFormChange("isActive", !editFormData.isActive)}
            >
              <span className={`h-1.5 w-1.5 rounded-full mr-1.5 ${editFormData.isActive ? "bg-green-500" : "bg-muted-foreground"}`} />
              {editFormData.isActive ? "Active" : "Inactive"}
            </Button>
          </TableCell>
          <TableCell>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={onSave} disabled={updatePending} title="Save">
                {updatePending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <CheckCircle2 className="h-3.5 w-3.5" />}
              </Button>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={onCancel} title="Cancel">
                <X className="h-3.5 w-3.5" />
              </Button>
            </div>
          </TableCell>
        </>
      ) : (
        <>
          <TableCell>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0 cursor-grab" {...attributes} {...listeners}>
                <GripVertical className="h-3.5 w-3.5 text-muted-foreground" />
              </Button>
            </div>
          </TableCell>
          <TableCell className="font-medium">{item.title}</TableCell>
          <TableCell className="max-w-xs truncate" title={item.description}>{item.description}</TableCell>
          <TableCell>
            {item.url ? (
              <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-500 hover:underline truncate block max-w-[120px]">{item.url}</a>
            ) : (
              <span className="text-xs text-muted-foreground">—</span>
            )}
          </TableCell>
          <TableCell>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded border border-border" style={{ backgroundColor: item.color }} />
              <span className="text-xs text-muted-foreground">{item.color}</span>
            </div>
          </TableCell>
          <TableCell>
            <button className={`inline-flex items-center gap-1.5 text-xs cursor-pointer hover:opacity-80 ${item.isActive ? "text-green-600 dark:text-green-400" : "text-muted-foreground"}`}
              onClick={onToggleStatus}
              title="Toggle status"
            >
              <span className={`h-1.5 w-1.5 rounded-full ${item.isActive ? "bg-green-500" : "bg-muted-foreground"}`} />
              {item.isActive ? "Active" : "Inactive"}
            </button>
          </TableCell>
          <TableCell>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={onStartEdit}>
                <Edit className="h-3.5 w-3.5" />
              </Button>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-500 hover:text-red-600" onClick={onDelete}>
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          </TableCell>
        </>
      )}
    </TableRow>
  );
}
