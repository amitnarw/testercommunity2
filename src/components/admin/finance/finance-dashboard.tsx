"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useFinanceDashboard, useFinancePlans, useFinancePaymentMethods } from "@/hooks/useAdmin";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart,
} from "recharts";
import {
  TrendingUp, CreditCard, ShoppingCart, FileText, RotateCcw, DollarSign, Package, Users, Wallet,
} from "lucide-react";
import { cn } from "@/lib/utils";

function StatCard({ title, value, subtitle, icon: Icon, color, isLoading }: {
  title: string; value: string | number; subtitle?: string; icon: any; color: string; isLoading?: boolean;
}) {
  return (
    <Card className="bg-white/70 dark:bg-black/70 backdrop-blur-md border transition-all duration-300 border-l-4 overflow-hidden" style={{ borderLeftColor: color }}>
      <CardContent className="p-6">
        {isLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-4 w-24 bg-white/20" />
            <Skeleton className="h-8 w-16 bg-white/20" />
            <Skeleton className="h-3 w-32 bg-white/20" />
          </div>
        ) : (
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">{title}</p>
              <p className="text-3xl font-bold">{value}</p>
              {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
            </div>
            <div className={cn("p-3 rounded-full", color.replace("border", "bg").replace("-500", "-500/10"))}>
              <Icon className={cn("h-5 w-5", color.replace("border", "text"))} />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function FinanceOverview() {
  const { data: dashboard, isLoading } = useFinanceDashboard();
  const { data: plans } = useFinancePlans();
  const { data: methods } = useFinancePaymentMethods();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
        <StatCard
          title="Total Revenue"
          value={dashboard ? formatCurrency(Math.floor(dashboard.totalRevenue / 100)) : "—"}
          subtitle="from captured payments"
          icon={TrendingUp}
          color="border-emerald-500"
          isLoading={isLoading}
        />
        <StatCard
          title="Total Orders"
          value={dashboard?.totalOrders ?? "—"}
          subtitle={`${dashboard?.paidOrders ?? 0} paid`}
          icon={ShoppingCart}
          color="border-blue-500"
          isLoading={isLoading}
        />
        <StatCard
          title="Packages Sold"
          value={dashboard?.packagesSold ?? "—"}
          subtitle={`${dashboard?.paidOrders ?? 0} purchases`}
          icon={Package}
          color="border-violet-500"
          isLoading={isLoading}
        />
        <StatCard
          title="Tester Earnings"
          value={dashboard ? `₹${(dashboard.testerEarnings || 0).toLocaleString()}` : "—"}
          subtitle="pending withdrawals"
          icon={Wallet}
          color="border-amber-500"
          isLoading={isLoading}
        />
        <StatCard
          title="Points Distributed"
          value={(dashboard?.pointsDistributed ?? 0).toLocaleString()}
          subtitle="total points awarded"
          icon={Users}
          color="border-cyan-500"
          isLoading={isLoading}
        />
        <StatCard
          title="Pending Withdrawals"
          value={dashboard?.pendingWithdrawalsCount ?? "—"}
          subtitle={dashboard ? `₹${(dashboard.pendingWithdrawalsAmount || 0).toLocaleString()}` : ""}
          icon={DollarSign}
          color="border-orange-500"
          isLoading={isLoading}
        />
        <StatCard
          title="Total Invoices"
          value={dashboard?.totalInvoices ?? "—"}
          subtitle={`${dashboard?.totalRefunds ?? 0} refunds`}
          icon={FileText}
          color="border-rose-500"
          isLoading={isLoading}
        />
        <StatCard
          title="Payments"
          value={dashboard?.totalPayments ?? "—"}
          subtitle={`${dashboard?.capturedPayments ?? 0} captured`}
          icon={CreditCard}
          color="border-indigo-500"
          isLoading={isLoading}
        />
      </div>

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
        <Card className="bg-white/70 dark:bg-black/70 backdrop-blur-md shadow-lg lg:col-span-2">
          <CardHeader className="pb-2 p-6">
            <CardTitle className="text-base">Monthly Revenue Trend</CardTitle>
          </CardHeader>
          <CardContent className="p-6 pt-2">
            {isLoading ? (
              <Skeleton className="h-[250px] w-full bg-white/20" />
            ) : (
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={dashboard?.monthlyRevenue || []}>
                  <defs>
                    <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="rgba(255,255,255,0.3)" />
                  <YAxis tick={{ fontSize: 12 }} stroke="rgba(255,255,255,0.3)" />
                  <Tooltip
                    contentStyle={{ background: "rgba(0,0,0,0.8)", border: "none", borderRadius: 8, color: "#fff" }}
                    formatter={(value: number) => [formatCurrency(value), "Revenue"]}
                  />
                  <Area type="monotone" dataKey="revenue" stroke="#10b981" fill="url(#revenueGradient)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card className="bg-white/70 dark:bg-black/70 backdrop-blur-md shadow-lg">
          <CardHeader className="pb-2 p-6">
            <CardTitle className="text-base">Orders by Status</CardTitle>
          </CardHeader>
          <CardContent className="p-6 pt-2">
            {isLoading ? (
              <div className="space-y-3">
                <Skeleton className="h-5 w-full bg-white/20" />
                <Skeleton className="h-5 w-full bg-white/20" />
                <Skeleton className="h-5 w-full bg-white/20" />
              </div>
            ) : dashboard?.ordersByStatus ? (
              <div className="space-y-3">
                {Object.entries(dashboard.ordersByStatus).map(([status, count]) => {
                  const colorMap: Record<string, string> = {
                    PAID: "bg-green-500/20 text-green-600",
                    CREATED: "bg-blue-500/20 text-blue-600",
                    ATTEMPTED: "bg-amber-500/20 text-amber-600",
                    EXPIRED: "bg-gray-500/20 text-gray-600",
                    CANCELLED: "bg-red-500/20 text-red-600",
                  };
                  return (
                    <div key={status} className="flex items-center justify-between p-2 rounded-lg bg-secondary/30">
                      <span className="text-sm font-medium flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded text-xs font-semibold ${colorMap[status] || "bg-gray-500/20 text-gray-600"}`}>
                          {status}
                        </span>
                      </span>
                      <span className="text-lg font-bold">{(count as number).toLocaleString()}</span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No data</p>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        <Card className="bg-white/70 dark:bg-black/70 backdrop-blur-md shadow-lg">
          <CardHeader className="pb-2 p-6">
            <CardTitle className="text-base">Pricing Plans</CardTitle>
          </CardHeader>
          <CardContent className="p-6 pt-2">
            {!plans ? (
              <div className="space-y-3">
                <Skeleton className="h-12 w-full bg-white/20" />
                <Skeleton className="h-12 w-full bg-white/20" />
              </div>
            ) : (
              <div className="space-y-2">
                {plans.map((plan: any) => (
                  <div key={plan.id} className="flex items-center justify-between p-3 rounded-lg bg-secondary/30">
                    <div>
                      <p className="font-medium text-sm">{plan.name}</p>
                      <p className="text-xs text-muted-foreground">{plan.package} packages · ₹{plan.price}</p>
                    </div>
                    <BadgePlan active={plan.isActive} />
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-white/70 dark:bg-black/70 backdrop-blur-md shadow-lg">
          <CardHeader className="pb-2 p-6">
            <CardTitle className="text-base">Payment Methods</CardTitle>
          </CardHeader>
          <CardContent className="p-6 pt-2">
            {!methods ? (
              <div className="space-y-3">
                <Skeleton className="h-12 w-full bg-white/20" />
                <Skeleton className="h-12 w-full bg-white/20" />
              </div>
            ) : methods.length === 0 ? (
              <p className="text-sm text-muted-foreground">No payment data yet</p>
            ) : (
              <div className="space-y-2">
                {methods.map((m: any) => (
                  <div key={m.method} className="flex items-center justify-between p-3 rounded-lg bg-secondary/30">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-full bg-blue-500/10">
                        <CreditCard className="h-4 w-4 text-blue-500" />
                      </div>
                      <div>
                        <p className="font-medium text-sm capitalize">{m.method || "Unknown"}</p>
                        <p className="text-xs text-muted-foreground">{m.count} transactions</p>
                      </div>
                    </div>
                    <p className="font-semibold text-sm">₹{Math.floor(m.totalAmount / 100).toLocaleString()}</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function BadgePlan({ active }: { active: boolean }) {
  return (
    <span className={`px-2 py-0.5 rounded text-xs font-semibold ${active ? "bg-green-500/20 text-green-600" : "bg-gray-500/20 text-gray-600"}`}>
      {active ? "Active" : "Inactive"}
    </span>
  );
}
