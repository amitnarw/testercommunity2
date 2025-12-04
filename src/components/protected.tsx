"use client";

import { authClient } from "@/lib/auth-client";
import { redirect } from "next/navigation";

export function Protected({ children }: { children: React.ReactNode }) {
  const { data: session, isPending, error, refetch } = authClient.useSession();

  if (isPending) return <div>Loading...</div>;
  // if (!session) redirect("/login");

  return <>{children}</>;
}
