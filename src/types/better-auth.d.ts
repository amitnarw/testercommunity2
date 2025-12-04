import "better-auth/react";

declare module "better-auth/react" {
  interface Session {
    user: {
      id: string;
      email: string;
      emailVerified: boolean;
      name: string;
      image?: string | null;
    };
    role?: {
      name: string;
      permissions: {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        roleId: number;
        moduleId: number;
        canReadList: boolean;
        canReadSingle: boolean;
        canCreate: boolean;
        canUpdate: boolean;
        canDelete: boolean;
      }[];
    };
  }
  interface SignUpEmailOptions {
    role: string;
  }
}
