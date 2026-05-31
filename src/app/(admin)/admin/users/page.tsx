"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, CheckCircle, Ban, Loader2, Plus } from "lucide-react";
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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import {
  useAllUsers,
  useUserCounts,
  useUpdateUserStatus,
  useUpdateUserRole,
  useDeleteUser,
  useCreateUser,
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

  const sessionRoleName = (session as any)?.role?.name;
  const isSuperAdmin = sessionRoleName === "super_admin";

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

  // Add User form state
  const defaultNewUser = {
    email: "",
    password: "",
    name: "",
    role: "user",
    emailVerified: true,
    auth_type: "EMAIL_PASSWORD",
    first_name: "",
    last_name: "",
    phone: "",
    country: "",
    banned: false,
    ban_reason: "",
    bio: "",
    years_of_experience: "",
    profile_type: "",
    job_role: "",
    company_name: "",
    company_size: "",
    position_in_company: "",
    company_website: "",
    experience_level: "",
    total_published_apps: "",
    platform_development: "",
    publish_frequency: "",
    service_usage: "",
    communication_methods: "",
    notification_preference: "",
    device_company: "",
    device_model: "",
    ram: "",
    os: "",
    screen_resolution: "",
    language: "",
    network: "",
    testing_types: "",
    tester_devices: "",
    tester_os_versions: "",
    areas_of_expertise: "",
    initial: "",
    application_status: "",
    discovery_source: "",
    discovery_source_answered: false,
    availability: "AVAILABLE",
  };

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newUser, setNewUser] = useState<any>({ ...defaultNewUser });

  const updateField = (field: string, value: any) => {
    setNewUser((prev: any) => ({ ...prev, [field]: value }));
  };

  const createUserMutation = useCreateUser({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["useAllUsers"] });
      queryClient.invalidateQueries({ queryKey: ["useUserCounts"] });
      setIsAddModalOpen(false);
      setNewUser({ ...defaultNewUser });
      toast({
        title: "Success",
        description: "User created successfully",
      });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to create user",
      });
    },
  });

  const handleCreateUser = () => {
    const payload: any = { ...newUser };

    // Parse comma-separated arrays
    for (const f of ["testing_types", "tester_devices", "tester_os_versions", "areas_of_expertise", "communication_methods", "notification_preference"]) {
      if (typeof payload[f] === "string" && payload[f].trim()) {
        payload[f] = payload[f].split(",").map((s: string) => s.trim());
      } else if (typeof payload[f] === "string" && !payload[f].trim()) {
        payload[f] = [];
      }
    }

    // Remove empty strings for optional enums
    const nullableFields = ["profile_type", "job_role", "company_size", "position_in_company", "experience_level", "total_published_apps", "platform_development", "publish_frequency", "service_usage", "application_status", "availability", "initial"];
    for (const f of nullableFields) {
      if (payload[f] === "") payload[f] = undefined;
    }

    // Map emailVerified
    payload.emailVerified = payload.emailVerified === true;

    createUserMutation.mutate(payload);
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
        <Button onClick={() => setIsAddModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add User
        </Button>
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

      {/* Add User Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New User</DialogTitle>
            <DialogDescription>
              Fill in the details to create a new user account. Required fields
              are marked.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2">
            {/* Account Essentials — always visible */}
            <div className="space-y-4 border rounded-lg p-4 bg-muted/30">
              <h3 className="text-sm font-semibold text-foreground">
                Account Essentials
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>
                    Full Name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    placeholder="John Doe"
                    value={newUser.name}
                    onChange={(e) => updateField("name", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>
                    Email <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    placeholder="user@example.com"
                    type="email"
                    value={newUser.email}
                    onChange={(e) => updateField("email", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>
                    Password <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    placeholder="Minimum 8 characters"
                    type="password"
                    value={newUser.password}
                    onChange={(e) => updateField("password", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>
                    Role <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    value={newUser.role}
                    onValueChange={(v) => updateField("role", v)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="user">User</SelectItem>
                      <SelectItem value="tester">Tester</SelectItem>
                      <SelectItem value="support">Support</SelectItem>
                      <SelectItem value="moderator">Moderator</SelectItem>
                      <SelectItem
                        value="admin"
                        disabled={!isSuperAdmin}
                      >
                        Admin {!isSuperAdmin && "(Super Admin only)"}
                      </SelectItem>
                      <SelectItem
                        value="super_admin"
                        disabled={!isSuperAdmin}
                      >
                        Super Admin {!isSuperAdmin && "(Super Admin only)"}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Email Verified</Label>
                  <div className="flex items-center gap-3 pt-2">
                    <Switch
                      checked={newUser.emailVerified}
                      onCheckedChange={(v) => updateField("emailVerified", v)}
                    />
                    <span className="text-sm text-muted-foreground">
                      {newUser.emailVerified
                        ? "User can log in immediately"
                        : "User must verify email first"}
                    </span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Auth Type</Label>
                  <Select
                    value={newUser.auth_type}
                    onValueChange={(v) => updateField("auth_type", v)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="EMAIL_PASSWORD">
                        Email & Password
                      </SelectItem>
                      <SelectItem value="GOOGLE">Google OAuth</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <Accordion type="multiple" className="w-full space-y-1">
              {/* Basic Profile */}
              <AccordionItem value="basic-profile">
                <AccordionTrigger className="text-sm font-semibold px-1">
                  Basic Profile
                </AccordionTrigger>
                <AccordionContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    <div className="space-y-2">
                      <Label>First Name</Label>
                      <Input
                        placeholder="John"
                        value={newUser.first_name}
                        onChange={(e) =>
                          updateField("first_name", e.target.value)
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Last Name</Label>
                      <Input
                        placeholder="Doe"
                        value={newUser.last_name}
                        onChange={(e) =>
                          updateField("last_name", e.target.value)
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Phone</Label>
                      <Input
                        placeholder="+1 (555) 123-4567"
                        value={newUser.phone}
                        onChange={(e) => updateField("phone", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Country</Label>
                      <Input
                        placeholder="United States"
                        value={newUser.country}
                        onChange={(e) => updateField("country", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label>Bio</Label>
                      <Textarea
                        placeholder="Short bio about the user"
                        value={newUser.bio}
                        onChange={(e) => updateField("bio", e.target.value)}
                      />
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Professional Info */}
              <AccordionItem value="professional">
                <AccordionTrigger className="text-sm font-semibold px-1">
                  Professional Info
                </AccordionTrigger>
                <AccordionContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    <div className="space-y-2">
                      <Label>Profile Type</Label>
                      <Select
                        value={newUser.profile_type}
                        onValueChange={(v) =>
                          updateField("profile_type", v)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Not set" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="INDIVIDUAL">
                            Individual
                          </SelectItem>
                          <SelectItem value="COMPANY">Company</SelectItem>
                          <SelectItem value="AGENCY">Agency</SelectItem>
                          <SelectItem value="CLIENT_MANAGER">
                            Client Manager
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Job Role</Label>
                      <Select
                        value={newUser.job_role}
                        onValueChange={(v) => updateField("job_role", v)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Not set" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="DEVELOPER">
                            Developer
                          </SelectItem>
                          <SelectItem value="QA_TESTER">
                            QA Tester
                          </SelectItem>
                          <SelectItem value="PRODUCT_MANAGER">
                            Product Manager
                          </SelectItem>
                          <SelectItem value="DESIGNER">Designer</SelectItem>
                          <SelectItem value="BUSINESS_OWNER">
                            Business Owner
                          </SelectItem>
                          <SelectItem value="MARKETING">
                            Marketing
                          </SelectItem>
                          <SelectItem value="SALES">Sales</SelectItem>
                          <SelectItem value="PROJECT_MANAGER">
                            Project Manager
                          </SelectItem>
                          <SelectItem value="STUDENT">Student</SelectItem>
                          <SelectItem value="HOBBYIST">Hobbyist</SelectItem>
                          <SelectItem value="AGENCY">Agency</SelectItem>
                          <SelectItem value="OTHER">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Experience Level</Label>
                      <Select
                        value={newUser.experience_level}
                        onValueChange={(v) =>
                          updateField("experience_level", v)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Not set" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="INTERN">Intern</SelectItem>
                          <SelectItem value="JUNIOR">Junior</SelectItem>
                          <SelectItem value="MID">Mid</SelectItem>
                          <SelectItem value="SENIOR">Senior</SelectItem>
                          <SelectItem value="LEAD">Lead</SelectItem>
                          <SelectItem value="DIRECTOR">Director</SelectItem>
                          <SelectItem value="OTHER">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Years of Experience</Label>
                      <Input
                        placeholder="e.g. 5"
                        value={newUser.years_of_experience}
                        onChange={(e) =>
                          updateField("years_of_experience", e.target.value)
                        }
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label>Areas of Expertise</Label>
                      <Input
                        placeholder="Comma separated, e.g. Android, iOS, Web"
                        value={newUser.areas_of_expertise}
                        onChange={(e) =>
                          updateField("areas_of_expertise", e.target.value)
                        }
                      />
                      <p className="text-xs text-muted-foreground">
                        Separate values with commas
                      </p>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Company Details */}
              <AccordionItem value="company">
                <AccordionTrigger className="text-sm font-semibold px-1">
                  Company Details
                </AccordionTrigger>
                <AccordionContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    <div className="space-y-2">
                      <Label>Company Name</Label>
                      <Input
                        placeholder="Acme Inc."
                        value={newUser.company_name}
                        onChange={(e) =>
                          updateField("company_name", e.target.value)
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Website</Label>
                      <Input
                        placeholder="https://acme.com"
                        value={newUser.company_website}
                        onChange={(e) =>
                          updateField("company_website", e.target.value)
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Company Size</Label>
                      <Select
                        value={newUser.company_size}
                        onValueChange={(v) =>
                          updateField("company_size", v)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Not set" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="SIZE_1">1</SelectItem>
                          <SelectItem value="SIZE_2_10">2–10</SelectItem>
                          <SelectItem value="SIZE_11_50">11–50</SelectItem>
                          <SelectItem value="SIZE_51_200">51–200</SelectItem>
                          <SelectItem value="SIZE_201_500">
                            201–500
                          </SelectItem>
                          <SelectItem value="SIZE_501_1000">
                            501–1000
                          </SelectItem>
                          <SelectItem value="SIZE_1001_5000">
                            1001–5000
                          </SelectItem>
                          <SelectItem value="SIZE_5001_10000">
                            5001–10000
                          </SelectItem>
                          <SelectItem value="SIZE_10000_PLUS">
                            10000+
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Position in Company</Label>
                      <Select
                        value={newUser.position_in_company}
                        onValueChange={(v) =>
                          updateField("position_in_company", v)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Not set" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="FOUNDER_CEO">
                            Founder / CEO
                          </SelectItem>
                          <SelectItem value="CTO_TECH_LEAD">
                            CTO / Tech Lead
                          </SelectItem>
                          <SelectItem value="PRODUCT_MANAGER">
                            Product Manager
                          </SelectItem>
                          <SelectItem value="PROJECT_MANAGER">
                            Project Manager
                          </SelectItem>
                          <SelectItem value="SOFTWARE_ENGINEER">
                            Software Engineer
                          </SelectItem>
                          <SelectItem value="QA_TESTER">
                            QA Tester
                          </SelectItem>
                          <SelectItem value="DESIGNER">Designer</SelectItem>
                          <SelectItem value="MARKETING">
                            Marketing
                          </SelectItem>
                          <SelectItem value="SALES_BUSINESS_DEV">
                            Sales / Business Dev
                          </SelectItem>
                          <SelectItem value="OPERATIONS_ADMIN">
                            Operations / Admin
                          </SelectItem>
                          <SelectItem value="CUSTOMER_SUPPORT">
                            Customer Support
                          </SelectItem>
                          <SelectItem value="OTHER">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Device Details */}
              <AccordionItem value="device">
                <AccordionTrigger className="text-sm font-semibold px-1">
                  Device Details
                </AccordionTrigger>
                <AccordionContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    <div className="space-y-2">
                      <Label>Device Company</Label>
                      <Input
                        placeholder="Samsung"
                        value={newUser.device_company}
                        onChange={(e) =>
                          updateField("device_company", e.target.value)
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Device Model</Label>
                      <Input
                        placeholder="Galaxy S24"
                        value={newUser.device_model}
                        onChange={(e) =>
                          updateField("device_model", e.target.value)
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>RAM</Label>
                      <Input
                        placeholder="8GB"
                        value={newUser.ram}
                        onChange={(e) => updateField("ram", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>OS</Label>
                      <Input
                        placeholder="Android 14"
                        value={newUser.os}
                        onChange={(e) => updateField("os", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Screen Resolution</Label>
                      <Input
                        placeholder="1080x2400"
                        value={newUser.screen_resolution}
                        onChange={(e) =>
                          updateField("screen_resolution", e.target.value)
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Language</Label>
                      <Input
                        placeholder="English"
                        value={newUser.language}
                        onChange={(e) =>
                          updateField("language", e.target.value)
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Network</Label>
                      <Input
                        placeholder="WiFi / 5G"
                        value={newUser.network}
                        onChange={(e) =>
                          updateField("network", e.target.value)
                        }
                      />
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Tester Specific */}
              <AccordionItem value="tester">
                <AccordionTrigger className="text-sm font-semibold px-1">
                  Tester Specific
                </AccordionTrigger>
                <AccordionContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    <div className="space-y-2">
                      <Label>Application Status</Label>
                      <Select
                        value={newUser.application_status}
                        onValueChange={(v) =>
                          updateField("application_status", v)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Not set" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="PENDING">Pending</SelectItem>
                          <SelectItem value="APPROVED">Approved</SelectItem>
                          <SelectItem value="REJECTED">Rejected</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Availability</Label>
                      <Select
                        value={newUser.availability}
                        onValueChange={(v) =>
                          updateField("availability", v)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="AVAILABLE">
                            Available
                          </SelectItem>
                          <SelectItem value="BUSY">Busy</SelectItem>
                          <SelectItem value="AWAY">Away</SelectItem>
                          <SelectItem value="DO_NOT_DISTURB">
                            Do Not Disturb
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label>Testing Types</Label>
                      <Input
                        placeholder="Comma separated, e.g. Functional, Regression, Usability"
                        value={newUser.testing_types}
                        onChange={(e) =>
                          updateField("testing_types", e.target.value)
                        }
                      />
                      <p className="text-xs text-muted-foreground">
                        Separate values with commas
                      </p>
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label>Tester Devices</Label>
                      <Input
                        placeholder="Comma separated, e.g. Samsung Galaxy S24, iPhone 15"
                        value={newUser.tester_devices}
                        onChange={(e) =>
                          updateField("tester_devices", e.target.value)
                        }
                      />
                      <p className="text-xs text-muted-foreground">
                        Separate values with commas
                      </p>
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label>Tester OS Versions</Label>
                      <Input
                        placeholder="Comma separated, e.g. Android 14, iOS 18"
                        value={newUser.tester_os_versions}
                        onChange={(e) =>
                          updateField("tester_os_versions", e.target.value)
                        }
                      />
                      <p className="text-xs text-muted-foreground">
                        Separate values with commas
                      </p>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Account Status */}
              <AccordionItem value="status">
                <AccordionTrigger className="text-sm font-semibold px-1">
                  Account Status
                </AccordionTrigger>
                <AccordionContent>
                  <div className="grid grid-cols-1 gap-4 pt-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Banned</Label>
                        <p className="text-xs text-muted-foreground">
                          Prevent user from logging in
                        </p>
                      </div>
                      <Switch
                        checked={newUser.banned}
                        onCheckedChange={(v) => updateField("banned", v)}
                      />
                    </div>
                    {newUser.banned && (
                      <div className="space-y-2">
                        <Label>Ban Reason</Label>
                        <Textarea
                          placeholder="Reason for banning this user"
                          value={newUser.ban_reason}
                          onChange={(e) =>
                            updateField("ban_reason", e.target.value)
                          }
                        />
                      </div>
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          <DialogFooter className="gap-2">
            <Button
              variant="ghost"
              onClick={() => {
                setIsAddModalOpen(false);
                setNewUser({ ...defaultNewUser });
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateUser}
              disabled={
                !newUser.name ||
                !newUser.email ||
                !newUser.password ||
                createUserMutation.isPending
              }
            >
              {createUserMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Create User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
