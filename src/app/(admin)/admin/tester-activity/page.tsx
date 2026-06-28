"use client";

import { Suspense, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { ROUTES } from "@/lib/routes";
import { hasPermission } from "@/lib/permissions";
import { TesterActivityDashboard } from "@/components/admin/tester-activity/tester-activity-dashboard";
import { TesterDetailActivity } from "@/components/admin/tester-activity/tester-detail-activity";

function TesterActivityPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { data: session, isPending: sessionLoading } = authClient.useSession();
  const testerId = searchParams.get("testerId") || "";
  const date = searchParams.get("date") || new Date().toISOString().split("T")[0];

  const role = (session as any)?.role;
  const roleName = (typeof role === "string" ? role : role?.name)?.toLowerCase();
  const permissions = role?.permissions;

  if (sessionLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!session || !hasPermission(roleName, permissions, "tester_activity", "canReadList")) {
    return null;
  }

  const handleFilterChange = useCallback(
    (params: Record<string, string>) => {
      const sp = new URLSearchParams(searchParams.toString());
      Object.entries(params).forEach(([k, v]) => {
        if (v) sp.set(k, v);
        else sp.delete(k);
      });
      const qs = sp.toString();
      router.replace(qs ? `${ROUTES.ADMIN.TESTER_ACTIVITY}?${qs}` : ROUTES.ADMIN.TESTER_ACTIVITY, { scroll: false });
    },
    [searchParams, router],
  );

  return (
    <div className="flex-1 space-y-8 container mx-auto px-4 md:px-6 mb-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl sm:text-4xl font-bold bg-gradient-to-b from-primary to-primary/40 bg-clip-text text-transparent leading-[unset] pb-2">
            Tester Activity
          </h2>
          <p className="text-sm md:text-base text-muted-foreground">
            Track tester performance, check-ins, and progress.
          </p>
        </div>
      </div>

      {testerId ? (
        <TesterDetailActivity
          testerId={testerId}
          date={date}
          onBack={() => handleFilterChange({ testerId: "" })}
        />
      ) : (
        <TesterActivityDashboard
          date={date}
          onTesterSelect={(id) => handleFilterChange({ testerId: id })}
          onDateChange={(d) => handleFilterChange({ date: d, testerId: "" })}
        />
      )}
    </div>
  );
}

export default function TesterActivityPage() {
  return (
    <Suspense fallback={null}>
      <TesterActivityPageContent />
    </Suspense>
  );
}
