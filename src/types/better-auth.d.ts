// src/types/better-auth.d.ts

import "better-auth";   // ← correct package (not /react)

declare module "better-auth" {   // ← correct module name
  interface Session {
    role: {
      name: string;
      permissions: {
        id: number;
        moduleId: number;
        canRead: boolean;
        canUpdate: boolean;
        canDelete: boolean;
      }[];
    } | null;
  }
}