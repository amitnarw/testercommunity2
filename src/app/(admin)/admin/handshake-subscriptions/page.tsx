"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2, Ban } from "lucide-react";
import {
  getHandshakeSubscriptionsAdmin,
  cancelHandshakeSubscriptionAdmin,
} from "@/lib/apiCalls";

const STATUSES = ["All", "ACTIVE", "AUTHENTICATED", "PENDING", "HALTED", "CANCELLED", "EXPIRED"];

function StatusBadge({ status }: { status: string }) {
  const color =
    status === "ACTIVE" || status === "AUTHENTICATED"
      ? "bg-emerald-500/15 text-emerald-600"
      : status === "CANCELLED" || status === "EXPIRED"
        ? "bg-red-500/15 text-red-600"
        : "bg-amber-500/15 text-amber-600";
  return <Badge className={color}>{status}</Badge>;
}

export default function AdminHandshakeSubscriptionsPage() {
  const queryClient = useQueryClient();
  const [status, setStatus] = useState("All");
  const [page, setPage] = useState(1);
  const limit = 15;

  const { data, isPending, isError, error } = useQuery({
    queryKey: ["adminHandshakeSubscriptions", status, page],
    queryFn: () =>
      getHandshakeSubscriptionsAdmin({
        page,
        limit,
        status: status === "All" ? undefined : status,
      }),
  });

  const cancelMutation = useMutation({
    mutationFn: (id: string) => cancelHandshakeSubscriptionAdmin(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["adminHandshakeSubscriptions"],
      });
    },
  });

  const items = data?.items || [];
  const total = data?.total || 0;
  const totalPages = Math.max(1, Math.ceil(total / limit));

  return (
    <div className="p-4 sm:p-8 max-w-6xl mx-auto">
      <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-bold">Handshake Subscriptions</h1>
          <p className="text-sm text-muted-foreground">
            Manage user subscriptions for Handshake Testing (₹99/month).
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {STATUSES.map((s) => (
            <Button
              key={s}
              size="sm"
              variant={status === s ? "default" : "outline"}
              onClick={() => {
                setStatus(s);
                setPage(1);
              }}
            >
              {s}
            </Button>
          ))}
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          {isPending ? (
            <div className="space-y-2 p-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : isError ? (
            <p className="p-6 text-destructive">
              {(error as Error)?.message || "Failed to load subscriptions"}
            </p>
          ) : items.length === 0 ? (
            <p className="p-6 text-muted-foreground">No subscriptions found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-muted-foreground">
                    <th className="p-3 font-medium">User</th>
                    <th className="p-3 font-medium">Status</th>
                    <th className="p-3 font-medium">Plan</th>
                    <th className="p-3 font-medium">Current Period</th>
                    <th className="p-3 font-medium">Paid Cycles</th>
                    <th className="p-3 font-medium text-right">Total Revenue</th>
                    <th className="p-3 font-medium">Created</th>
                    <th className="p-3 font-medium text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((sub: any) => {
                    const totalRevenue = (sub.paidCount || 0) * 99;
                    const totalRefunded = (sub.payments || []).reduce(
                      (s: number, p: any) => s + (p.amountRefunded || 0),
                      0,
                    );
                    return (
                      <tr key={sub.id} className="border-b last:border-0">
                        <td className="p-3">
                          <p className="font-medium">{sub.user?.name || "Unknown"}</p>
                          <p className="text-xs text-muted-foreground">
                            {sub.user?.email}
                          </p>
                        </td>
                        <td className="p-3">
                          <StatusBadge status={sub.status} />
                        </td>
                        <td className="p-3 text-muted-foreground">
                          {sub.razorpayPlanId || "-"}
                        </td>
                        <td className="p-3 text-muted-foreground">
                          {sub.currentPeriodStart
                            ? new Date(sub.currentPeriodStart).toLocaleDateString()
                            : "-"}
                          {" - "}
                          {sub.currentPeriodEnd
                            ? new Date(sub.currentPeriodEnd).toLocaleDateString()
                            : "-"}
                        </td>
                        <td className="p-3 text-center">{sub.paidCount || 0}</td>
                        <td className="p-3 text-right font-mono">
                          <span>₹{totalRevenue.toLocaleString("en-IN")}</span>
                          {totalRefunded > 0 && (
                            <span className="text-destructive text-xs block">
                              (₹{(totalRefunded / 100).toLocaleString("en-IN")} refunded)
                            </span>
                          )}
                        </td>
                        <td className="p-3 text-muted-foreground">
                          {new Date(sub.createdAt).toLocaleDateString()}
                        </td>
                        <td className="p-3 text-right">
                          {(sub.invoices || []).length > 0 && (
                            <span className="text-xs text-muted-foreground mr-2">
                              {sub.invoices.length} invoice
                              {sub.invoices.length > 1 ? "s" : ""}
                            </span>
                          )}
                          {sub.status !== "CANCELLED" &&
                            sub.status !== "EXPIRED" && (
                              <Button
                                size="sm"
                                variant="destructive"
                                disabled={cancelMutation.isPending}
                                onClick={() =>
                                  cancelMutation.mutate(sub.razorpaySubscriptionId)
                                }
                              >
                                {cancelMutation.isPending ? (
                                  <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                                ) : (
                                  <Ban className="w-3 h-3 mr-1" />
                                )}
                                Cancel
                              </Button>
                            )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-4">
          <Button
            size="sm"
            variant="outline"
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {page} of {totalPages}
          </span>
          <Button
            size="sm"
            variant="outline"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
