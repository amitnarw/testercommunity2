"use client";

import { useState, useCallback, Suspense } from "react";
import {
  Shield,
  Loader2,
  Save,
  Info,
  Plus,
  Pencil,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { FeedbackModal } from "@/components/feedback-modal";
import { toast } from "@/hooks/use-toast";
import { authClient } from "@/lib/auth-client";
import {
  useAllPermissions,
  useUpdatePermission,
  useCreateRole,
  useUpdateRole,
  useDeleteRole,
} from "@/hooks/useAdmin";

type ModulePerm = {
  moduleId: number;
  moduleName: string;
  canReadList: boolean;
  canReadSingle: boolean;
  canCreate: boolean;
  canUpdate: boolean;
  canDelete: boolean;
};

type RolePerm = {
  roleId: number;
  roleName: string;
  isAdmin?: boolean;
  permissions: ModulePerm[];
};

type PermissionData = {
  modules: { id: number; name: string }[];
  matrix: RolePerm[];
};

const PROTECTED_ROLES = [
  "super_admin",
  "admin",
  "moderator",
  "support",
  "user",
  "tester",
];

const PERM_FIELDS = [
  { key: "canReadList" as const, label: "Read List" },
  { key: "canReadSingle" as const, label: "Read Item" },
  { key: "canCreate" as const, label: "Create" },
  { key: "canUpdate" as const, label: "Update" },
  { key: "canDelete" as const, label: "Delete" },
];

function PermissionsMatrixContent() {
  const { data, isLoading, isError, error } = useAllPermissions();
  const updateMutation = useUpdatePermission({
    onSuccess: () => {
      setFeedbackModal({
        open: true,
        status: "success",
        title: "Permissions Saved",
        description: "All permission changes have been saved successfully.",
        primaryAction: {
          label: "Continue",
          onClick: () => setFeedbackModal(null),
        },
      });
      setDirtyChanges({});
    },
    onError: (err: any) => {
      setFeedbackModal({
        open: true,
        status: "error",
        title: "Save Failed",
        description:
          err?.message ||
          "Failed to save permission changes. Please try again.",
        primaryAction: {
          label: "Try Again",
          onClick: () => setFeedbackModal(null),
        },
      });
    },
  });

  const { data: session } = authClient.useSession();
  const sessionRoleName = (session as any)?.role?.name;
  const isSuperAdmin = sessionRoleName === "super_admin";

  const [feedbackModal, setFeedbackModal] = useState<{
    open: boolean;
    status: "success" | "error" | "warning" | "info" | "loading";
    title: string;
    description: string;
    primaryAction?: { label: string; onClick: () => void };
    secondaryAction?: { label: string; onClick: () => void };
  } | null>(null);

  const [activeRole, setActiveRole] = useState<string>("");
  const [dirtyChanges, setDirtyChanges] = useState<Record<string, boolean>>({});

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newRoleName, setNewRoleName] = useState("");
  const [newRoleIsAdmin, setNewRoleIsAdmin] = useState(false);

  const [renamingRole, setRenamingRole] = useState<{
    id: number;
    name: string;
    isAdmin?: boolean;
  } | null>(null);
  const [renameInput, setRenameInput] = useState("");
  const [editingRoleIsAdmin, setEditingRoleIsAdmin] = useState(false);

  const [deletingRole, setDeletingRole] = useState<{
    id: number;
    name: string;
  } | null>(null);

  const createRoleMutation = useCreateRole({
    onSuccess: (newRole: any) => {
      setIsCreateDialogOpen(false);
      setNewRoleName("");
      setNewRoleIsAdmin(false);
      setActiveRole(newRole?.name || "");
      setDirtyChanges({});
      toast({ title: "Success", description: "Role created successfully" });
    },
    onError: (err: any) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: err?.message || "Failed to create role",
      });
    },
  });

  const updateRoleMutation = useUpdateRole({
    onSuccess: (updated: any) => {
      setRenamingRole(null);
      setRenameInput("");
      setActiveRole(updated?.name || activeRole);
      toast({ title: "Success", description: "Role renamed successfully" });
    },
    onError: (err: any) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: err?.message || "Failed to rename role",
      });
    },
  });

  const deleteRoleMutation = useDeleteRole({
    onSuccess: (result: any) => {
      setDeletingRole(null);
      const count = result?.reassignedUsers ?? 0;
      toast({
        title: "Role Deleted",
        description:
          count > 0
            ? `Role deleted. ${count} user(s) reassigned to the 'user' role.`
            : "Role deleted successfully.",
      });
    },
    onError: (err: any) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: err?.message || "Failed to delete role",
      });
    },
  });

  const permData = data as PermissionData | undefined;

  const activeRoleData = permData?.matrix?.find(
    (r) => r.roleName === activeRole,
  );

  const handleToggle = useCallback(
    (moduleId: number, field: string, checked: boolean) => {
      if (!activeRoleData) return;

      const modulePerm = activeRoleData.permissions.find(
        (p) => p.moduleId === moduleId,
      );
      if (!modulePerm) return;

      const originalValue =
        (modulePerm as any)[field as keyof ModulePerm] === true;
      const key = `${activeRoleData.roleId}-${moduleId}-${field}`;

      setDirtyChanges((prev) => {
        if (checked === originalValue) {
          const next = { ...prev };
          delete next[key];
          return next;
        }
        return { ...prev, [key]: checked };
      });
    },
    [activeRoleData],
  );

  const getCurrentValue = useCallback(
    (moduleId: number, field: string): boolean => {
      if (!activeRoleData) return false;

      const key = `${activeRoleData.roleId}-${moduleId}-${field}`;
      if (key in dirtyChanges) {
        return dirtyChanges[key] as boolean;
      }

      const modulePerm = activeRoleData.permissions.find(
        (p) => p.moduleId === moduleId,
      );
      if (!modulePerm) return false;

      return (modulePerm as any)[field as keyof ModulePerm] === true;
    },
    [activeRoleData, dirtyChanges],
  );

  const getRowState = useCallback(
    (moduleId: number): boolean | "indeterminate" => {
      if (!activeRoleData) return false;

      const allChecked = PERM_FIELDS.every((field) =>
        getCurrentValue(moduleId, field.key),
      );
      const noneChecked = PERM_FIELDS.every(
        (field) => !getCurrentValue(moduleId, field.key),
      );
      if (allChecked) return true;
      if (noneChecked) return false;
      return "indeterminate";
    },
    [activeRoleData, getCurrentValue],
  );

  const getColumnState = useCallback(
    (fieldKey: string): boolean | "indeterminate" => {
      if (!activeRoleData) return false;

      const filteredPerms = activeRoleData.permissions.filter(
        (p) => p.moduleName !== "permissions",
      );
      const allChecked = filteredPerms.every((p) =>
        getCurrentValue(p.moduleId, fieldKey),
      );
      const noneChecked = filteredPerms.every(
        (p) => !getCurrentValue(p.moduleId, fieldKey),
      );
      if (allChecked) return true;
      if (noneChecked) return false;
      return "indeterminate";
    },
    [activeRoleData, getCurrentValue],
  );

  const handleRowToggleAll = useCallback(
    (moduleId: number) => {
      if (!activeRoleData) return;

      const allChecked = PERM_FIELDS.every((field) =>
        getCurrentValue(moduleId, field.key),
      );
      const newValue = !allChecked;

      for (const field of PERM_FIELDS) {
        handleToggle(moduleId, field.key, newValue);
      }
    },
    [activeRoleData, getCurrentValue, handleToggle],
  );

  const handleColumnToggleAll = useCallback(
    (fieldKey: string) => {
      if (!activeRoleData) return;

      const filteredPerms = activeRoleData.permissions.filter(
        (p) => p.moduleName !== "permissions",
      );
      const allChecked = filteredPerms.every((p) =>
        getCurrentValue(p.moduleId, fieldKey),
      );
      const newValue = !allChecked;

      for (const p of filteredPerms) {
        handleToggle(p.moduleId, fieldKey, newValue);
      }
    },
    [activeRoleData, getCurrentValue, handleToggle],
  );

  const handleSave = useCallback(async () => {
    if (!activeRoleData) return;

    setFeedbackModal({
      open: true,
      status: "loading",
      title: "Saving Permissions",
      description: "Please wait while your changes are saved...",
    });

    const changes = Object.entries(dirtyChanges).map(([key, value]) => {
      const [roleIdStr, moduleIdStr, ...fieldParts] = key.split("-");
      const field = fieldParts.join("-");
      return {
        roleId: parseInt(roleIdStr),
        moduleId: parseInt(moduleIdStr),
        field,
        value: value as boolean,
      };
    });

    const grouped = new Map<string, any>();
    for (const c of changes) {
      const mapKey = `${c.roleId}-${c.moduleId}`;
      if (!grouped.has(mapKey)) {
        grouped.set(mapKey, {
          roleId: c.roleId,
          moduleId: c.moduleId,
          payload: {} as any,
        });
      }
      grouped.get(mapKey).payload[c.field] = c.value;
    }

    const promises = Array.from(grouped.values()).map((g) =>
      updateMutation.mutateAsync(g),
    );

    try {
      await Promise.all(promises);
    } catch {
      // Error is handled by mutation onError
    }
  }, [activeRoleData, dirtyChanges, updateMutation]);

  const hasChanges = Object.keys(dirtyChanges).length > 0;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <p className="text-destructive">Failed to load permissions data.</p>
        <p className="text-sm text-muted-foreground">
          {error instanceof Error ? error.message : "An error occurred"}
        </p>
      </div>
    );
  }

  if (!permData || !permData.matrix || permData.matrix.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <Shield className="h-12 w-12 text-muted-foreground" />
        <p className="text-muted-foreground">No permissions data available.</p>
      </div>
    );
  }

  if (permData.matrix.length > 0) {
    const activeRoleExists = permData.matrix.some(
      (r) => r.roleName === activeRole,
    );
    if (!activeRole || !activeRoleExists) {
      setActiveRole(permData.matrix[0].roleName);
      setDirtyChanges({});
    }
  }

  return (
    <div className="flex-1 space-y-6 container mx-auto px-4 md:px-6 py-6">
      {feedbackModal && (
        <FeedbackModal
          open={feedbackModal.open}
          onOpenChange={(open) => {
            setFeedbackModal((prev) => (prev ? { ...prev, open } : null));
          }}
          status={feedbackModal.status}
          title={feedbackModal.title}
          description={feedbackModal.description}
          primaryAction={feedbackModal.primaryAction}
          secondaryAction={feedbackModal.secondaryAction}
        />
      )}

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-b from-primary to-primary/40 bg-clip-text text-transparent leading-[unset]">
            Permission Matrix
          </h2>
          <p className="text-sm text-muted-foreground">
            Manage role-based permissions across all system modules.
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <Button
            onClick={handleSave}
            disabled={!hasChanges || updateMutation.isPending}
            className="gap-2"
          >
            {updateMutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            {updateMutation.isPending ? "Saving..." : "Save Changes"}
            {hasChanges && !updateMutation.isPending && (
              <span className="ml-1 text-xs bg-white/20 px-1.5 py-0.5 rounded-full">
                {Object.keys(dirtyChanges).length}
              </span>
            )}
          </Button>
          {isSuperAdmin && (
            <Button
              onClick={() => setIsCreateDialogOpen(true)}
              className="gap-2"
            >
              <Plus className="h-4 w-4" /> Create Role
            </Button>
          )}
        </div>
      </div>

      <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl px-4 py-3 flex items-start gap-3">
        <Info className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
        <p className="text-sm text-amber-600 dark:text-amber-400">
          The <strong>super_admin</strong> role bypasses all permission checks
          in the backend. Toggling permissions for super_admin has no effect on
          access control, it is listed here for reference only.
        </p>
      </div>

      <Tabs
        value={activeRole}
        onValueChange={(val) => {
          setActiveRole(val);
          setDirtyChanges({});
        }}
        className="w-full grid grid-cols-1"
      >
        <TabsList className="w-full md:w-auto flex gap-1 mb-6">
          {permData.matrix.map((role) => (
            <TabsTrigger
              key={role.roleId}
              value={role.roleName}
              className="capitalize"
            >
              {role.roleName.replace(/_/g, " ")}
            </TabsTrigger>
          ))}
        </TabsList>

        {permData.matrix.map((role) => (
          <TabsContent key={role.roleId} value={role.roleName}>
            {isSuperAdmin && !PROTECTED_ROLES.includes(role.roleName) && (
              <div className="flex items-center gap-2 mb-4">
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2"
                  onClick={() => {
                    setRenamingRole({ id: role.roleId, name: role.roleName, isAdmin: role.isAdmin });
                    setRenameInput(role.roleName.replace(/_/g, " "));
                    setEditingRoleIsAdmin(role.isAdmin ?? false);
                  }}
                >
                  <Pencil className="h-3.5 w-3.5" /> Rename
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2 text-destructive border-destructive/50 hover:bg-destructive/10"
                  onClick={() =>
                    setDeletingRole({
                      id: role.roleId,
                      name: role.roleName,
                    })
                  }
                >
                  <Trash2 className="h-3.5 w-3.5" /> Delete
                </Button>
              </div>
            )}
            <div className="overflow-x-auto rounded-xl border grid">
              <Table>
                <TableHeader>
                  <TableRow className="bg-secondary/50">
                    <TableHead className="min-w-[180px] font-semibold">
                      Module
                    </TableHead>
                    {PERM_FIELDS.map((field) => (
                      <TableHead
                        key={field.key}
                        className="text-center min-w-[100px] font-semibold"
                      >
                        <div className="flex flex-col items-center gap-1">
                          {field.label}
                          <Checkbox
                            checked={getColumnState(field.key)}
                            onCheckedChange={() =>
                              handleColumnToggleAll(field.key)
                            }
                            disabled={role.roleName === "super_admin"}
                          />
                        </div>
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {role.permissions
                    .filter((p) => p.moduleName !== "permissions")
                    .map((modPerm) => (
                      <TableRow key={modPerm.moduleId}>
                        <TableCell className="font-medium capitalize">
                          <div className="flex items-center gap-2">
                            <Checkbox
                              checked={getRowState(modPerm.moduleId)}
                              onCheckedChange={() =>
                                handleRowToggleAll(modPerm.moduleId)
                              }
                              disabled={role.roleName === "super_admin"}
                            />
                            {modPerm.moduleName.replace(/_/g, " ")}
                          </div>
                        </TableCell>
                        {PERM_FIELDS.map((field) => {
                          const isChecked = getCurrentValue(
                            modPerm.moduleId,
                            field.key,
                          );
                          const isDirty =
                            `${role.roleId}-${modPerm.moduleId}-${field.key}` in
                            dirtyChanges;

                          return (
                            <TableCell key={field.key} className="text-center">
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <div className="flex justify-center">
                                      <Checkbox
                                        checked={isChecked}
                                        onCheckedChange={(checked) =>
                                          handleToggle(
                                            modPerm.moduleId,
                                            field.key,
                                            checked === true,
                                          )
                                        }
                                        className={
                                          isDirty
                                            ? "border-amber-500 data-[state=checked]:bg-amber-500"
                                            : ""
                                        }
                                        disabled={
                                          role.roleName === "super_admin"
                                        }
                                      />
                                    </div>
                                  </TooltipTrigger>
                                  <TooltipContent side="bottom">
                                    <p>
                                      {modPerm.moduleName.replace(/_/g, " ")} —{" "}
                                      {field.label}
                                      {isDirty ? " (unsaved)" : ""}
                                    </p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        ))}
      </Tabs>

      {isSuperAdmin && (
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create New Role</DialogTitle>
              <DialogDescription>
                Enter a name for the new role. Spaces will be replaced with
                underscores, and the name will be lowercased.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="role-name">Role Name</Label>
                <Input
                  id="role-name"
                  placeholder="e.g. Billing Manager"
                  value={newRoleName}
                  onChange={(e) => setNewRoleName(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="role-is-admin"
                  checked={newRoleIsAdmin}
                  onCheckedChange={(checked) => setNewRoleIsAdmin(checked === true)}
                />
                <Label htmlFor="role-is-admin" className="text-sm font-normal">
                  Admin role (grants access to admin dashboard)
                </Label>
              </div>
              <div className="text-xs text-muted-foreground space-y-1">
                <p>Rules:</p>
                <ul className="list-disc list-inside space-y-0.5">
                  <li key="rule-case">
                    Lowercase letters, numbers, and underscores only
                  </li>
                  <li key="rule-start">Must start with a letter</li>
                  <li key="rule-underscore">
                    No leading, trailing, or consecutive underscores
                  </li>
                  <li key="rule-length">2 to 50 characters</li>
                </ul>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setIsCreateDialogOpen(false);
                  setNewRoleName("");
                  setNewRoleIsAdmin(false);
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={() =>
                  newRoleName.trim() &&
                  createRoleMutation.mutate({ name: newRoleName, isAdmin: newRoleIsAdmin })
                }
                disabled={!newRoleName.trim() || createRoleMutation.isPending}
              >
                {createRoleMutation.isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Create Role
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {isSuperAdmin && (
        <Dialog
          open={!!renamingRole}
          onOpenChange={(open) => {
            if (!open) setRenamingRole(null);
          }}
        >
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Rename Role</DialogTitle>
              <DialogDescription>
                Enter a new name for{" "}
                <span className="font-medium capitalize">
                  {renamingRole?.name.replace(/_/g, " ")}
                </span>
                .
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="rename-role">Role Name</Label>
                <Input
                  id="rename-role"
                  placeholder="New role name"
                  value={renameInput}
                  onChange={(e) => setRenameInput(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="rename-role-is-admin"
                  checked={editingRoleIsAdmin}
                  onCheckedChange={(checked) => setEditingRoleIsAdmin(checked === true)}
                />
                <Label htmlFor="rename-role-is-admin" className="text-sm font-normal">
                  Admin role (grants access to admin dashboard)
                </Label>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setRenamingRole(null)}>
                Cancel
              </Button>
              <Button
                onClick={() =>
                  renameInput.trim() &&
                  renamingRole &&
                  updateRoleMutation.mutate({
                    roleId: renamingRole.id,
                    name: renameInput,
                    isAdmin: editingRoleIsAdmin,
                  })
                }
                disabled={!renameInput.trim() || updateRoleMutation.isPending}
              >
                {updateRoleMutation.isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Rename
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {isSuperAdmin && (
        <AlertDialog
          open={!!deletingRole}
          onOpenChange={(open) => {
            if (!open) setDeletingRole(null);
          }}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Role</AlertDialogTitle>
              <AlertDialogDescription>
                You are about to delete the role{" "}
                <span className="font-medium capitalize">
                  {deletingRole?.name.replace(/_/g, " ")}
                </span>
                . Any users currently assigned to this role will be reassigned
                to the default &quot;user&quot; role.
                {deletingRole && (
                  <span className="block mt-2 text-amber-600 dark:text-amber-400 font-medium">
                    This action cannot be undone.
                  </span>
                )}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                onClick={() =>
                  deletingRole && deleteRoleMutation.mutate(deletingRole.id)
                }
                disabled={deleteRoleMutation.isPending}
              >
                {deleteRoleMutation.isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Delete Role
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
}

export default function PermissionsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      }
    >
      <PermissionsMatrixContent />
    </Suspense>
  );
}
