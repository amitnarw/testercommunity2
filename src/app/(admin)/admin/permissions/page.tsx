"use client";

import { useState, useCallback, Suspense } from "react";
import { Shield, Loader2, Save, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
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
import { FeedbackModal } from "@/components/feedback-modal";
import {
  useAllPermissions,
  useUpdatePermission,
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
  permissions: ModulePerm[];
};

type PermissionData = {
  modules: { id: number; name: string }[];
  matrix: RolePerm[];
};

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
          err?.message || "Failed to save permission changes. Please try again.",
        primaryAction: {
          label: "Try Again",
          onClick: () => setFeedbackModal(null),
        },
      });
    },
  });

  const [feedbackModal, setFeedbackModal] = useState<{
    open: boolean;
    status: "success" | "error" | "warning" | "info" | "loading";
    title: string;
    description: string;
    primaryAction?: { label: string; onClick: () => void };
    secondaryAction?: { label: string; onClick: () => void };
  } | null>(null);

  const [activeRole, setActiveRole] = useState<string>("");
  const [dirtyChanges, setDirtyChanges] = useState<
    Record<string, boolean>
  >({});

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

      if (checked === originalValue) {
        const next = { ...dirtyChanges };
        delete next[key];
        setDirtyChanges(next);
      } else {
        setDirtyChanges({ ...dirtyChanges, [key]: checked });
      }
    },
    [activeRoleData, dirtyChanges],
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

  const handleSave = useCallback(async () => {
    if (!activeRoleData) return;

    setFeedbackModal({
      open: true,
      status: "loading",
      title: "Saving Permissions",
      description: "Please wait while your changes are saved...",
    });

    const changes = Object.entries(dirtyChanges).map(([key, value]) => {
      const [, roleIdStr, moduleIdStr, field] = key.split("-");
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

  if (!activeRole && permData.matrix.length > 0) {
    setActiveRole(permData.matrix[0].roleName);
  }

  return (
    <div className="flex-1 space-y-6 container mx-auto px-4 md:px-6 py-6">
      {feedbackModal && (
        <FeedbackModal
          open={feedbackModal.open}
          onOpenChange={(open) => {
            setFeedbackModal((prev) =>
              prev ? { ...prev, open } : null,
            );
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
      >
        <div className="overflow-x-auto">
          <TabsList className="mb-6">
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
        </div>

        {permData.matrix.map((role) => (
          <TabsContent key={role.roleId} value={role.roleName}>
            <div className="overflow-x-auto rounded-xl border">
              <Table>
                <TableHeader>
                  <TableRow className="bg-secondary/50">
                    <TableHead className="min-w-[160px] font-semibold">
                      Module
                    </TableHead>
                    {PERM_FIELDS.map((field) => (
                      <TableHead
                        key={field.key}
                        className="text-center min-w-[100px] font-semibold"
                      >
                        {field.label}
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
                          {modPerm.moduleName.replace(/_/g, " ")}
                        </TableCell>
                        {PERM_FIELDS.map((field) => {
                          const isChecked = getCurrentValue(
                            modPerm.moduleId,
                            field.key,
                          );
                          const isDirty = `${role.roleId}-${modPerm.moduleId}-${field.key}` in dirtyChanges;

                          return (
                            <TableCell
                              key={field.key}
                              className="text-center"
                            >
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
