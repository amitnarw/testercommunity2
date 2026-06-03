"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Tabs, TabsList, TabsContent, TabsTrigger } from "@/components/ui/tabs";
import { authClient } from "@/lib/auth-client";
import { ROUTES } from "@/lib/routes";
import { hasPermission } from "@/lib/permissions";
import { FinanceOverview } from "@/components/admin/finance/finance-dashboard";
import { OrdersTable } from "@/components/admin/finance/orders-table";
import { PaymentsTable } from "@/components/admin/finance/payments-table";
import { InvoicesList } from "@/components/admin/finance/invoices-list";
import { RefundsTable } from "@/components/admin/finance/refunds-table";
import { WithdrawalsTable } from "@/components/admin/finance/withdrawals-table";
import { PricingTable } from "@/components/admin/finance/pricing-table";

const tabs = [
  { id: "overview", label: "Overview" },
  { id: "orders", label: "Orders" },
  { id: "payments", label: "Payments" },
  { id: "invoices", label: "Invoices" },
  { id: "refunds", label: "Refunds" },
  { id: "withdrawals", label: "Withdrawals" },
  { id: "pricing", label: "Pricing" },
];

function FinancePageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { data: session, isPending: sessionLoading } = authClient.useSession();
  const tabFromUrl = searchParams.get("tab") || "overview";

  const role = (session as any)?.role;
  const roleName = (typeof role === "string" ? role : role?.name)?.toLowerCase();
  const permissions = role?.permissions;

  useEffect(() => {
    const r = (session as any)?.role;
    const rName = (typeof r === "string" ? r : r?.name)?.toLowerCase();
    const perms = r?.permissions;
    if (session && !hasPermission(rName, perms, "finance", "canReadList")) {
      router.replace(ROUTES.ADMIN.DASHBOARD);
    }
  }, [session, router]);

  if (sessionLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!session || !hasPermission(roleName, permissions, "finance", "canReadList")) {
    return null;
  }

  const onTabChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "overview") {
      params.delete("tab");
    } else {
      params.set("tab", value);
    }
    const qs = params.toString();
    router.replace(qs ? `${ROUTES.ADMIN.FINANCE}?${qs}` : ROUTES.ADMIN.FINANCE, { scroll: false });
  };

  return (
    <div className="flex-1 space-y-8 container mx-auto px-4 md:px-6 mb-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl sm:text-4xl font-bold bg-gradient-to-b from-primary to-primary/40 bg-clip-text text-transparent leading-[unset] pb-2">
            Finance
          </h2>
          <p className="text-sm md:text-base text-muted-foreground">
            Comprehensive financial overview for super admin.
          </p>
        </div>
      </div>

      <Tabs
        value={tabFromUrl}
        className="w-full grid grid-cols-1"
        onValueChange={onTabChange}
      >
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <TabsList className="w-full md:w-auto flex gap-1 overflow-x-auto h-auto">
            {tabs.map((tab) => (
              <TabsTrigger key={tab.id} value={tab.id}>
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        {tabs.map((tab) => (
          <TabsContent key={tab.id} value={tab.id} className="mt-4 grid grid-cols-1">
            {tab.id === "overview" && <FinanceOverview />}
            {tab.id === "orders" && <OrdersTable />}
            {tab.id === "payments" && <PaymentsTable />}
            {tab.id === "invoices" && <InvoicesList />}
            {tab.id === "refunds" && <RefundsTable />}
            {tab.id === "withdrawals" && <WithdrawalsTable />}
            {tab.id === "pricing" && <PricingTable />}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}

export default function FinancePage() {
  return (
    <Suspense fallback={null}>
      <FinancePageContent />
    </Suspense>
  );
}
