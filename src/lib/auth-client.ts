import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
  fetchOptions: {
    credentials: "include", // ✅ CRITICAL: Send cookies with cross-origin requests
  },
});

export type SessionWithRole = typeof authClient.$Infer.Session;
