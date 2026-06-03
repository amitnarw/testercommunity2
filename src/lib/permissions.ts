export type Action =
  | "canReadList"
  | "canReadSingle"
  | "canCreate"
  | "canUpdate"
  | "canDelete";

export type PermissionEntry = {
  moduleId: number;
  canReadList: boolean;
  canReadSingle: boolean;
  canCreate: boolean;
  canUpdate: boolean;
  canDelete: boolean;
  module: { name: string };
};

export function hasPermission(
  roleName: string,
  permissions: PermissionEntry[] | null | undefined,
  moduleName: string,
  action: Action,
): boolean {
  if (roleName === "super_admin") return true;
  if (!permissions) return false;
  return permissions.some(
    (p) =>
      p.module?.name?.toLowerCase() === moduleName.toLowerCase() &&
      p[action] === true,
  );
}
