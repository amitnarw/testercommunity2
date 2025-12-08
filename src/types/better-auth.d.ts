import "better-auth/react";

declare module "better-auth/react" {
  interface ClientSession {
    role: string | null;
  }
}
import "better-auth/react";

declare module "better-auth/react" {
  interface SessionResult {
    role: string | null;
  }

  interface ClientSession {
    role: string | null;
  }
}
