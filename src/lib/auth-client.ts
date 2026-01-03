import { createAuthClient } from "better-auth/react";

// Use the local API proxy to ensure cookies are set on the frontend domain
// The proxy at /api/auth/[...path] forwards requests to the backend
// This solves cross-origin cookie issues in production (Vercel)
export const authClient = createAuthClient({
  baseURL: typeof window !== "undefined" 
    ? window.location.origin  // Client-side: use current origin
    : process.env.NEXT_PUBLIC_APP_URL || "",  // Server-side: use app URL
});


export type SessionWithRole = typeof authClient.$Infer.Session;