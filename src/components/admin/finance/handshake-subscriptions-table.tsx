"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ArrowLeft, ArrowRight, Loader2, Ban } from "lucide-react";
import { toast } from "@/hooks/use-toast";
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

export function HandshakeSubscriptionsTable() {
  const queryClient = useQueryClient();
  const [status, setStatus] = useState("All");
  const [page, setPage] = useState(1);
  const [cancelTarget, setCancelTarget] = useState<{ id: string; name: string } | null>(null);
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
      setCancelTarget(null);
      toast({ title: "Cancelled", description: "Subscription has been cancelled." });
      queryClient.invalidateQueries({ queryKey: ["adminHandshakeSubscriptions"] });
    },
    onError: (err: any) => {
      setCancelTarget(null);
      toast({
        variant: "destructive",
        title: "Error",
        description: err?.message || "Failed to cancel subscription.",
      });
    },
  });

  const items = data?.items || [];
  const total = data?.total || 0;
  const totalPages = Math.max(1, Math.ceil(total / limit));

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        {STATUSES.map((s) => (
          <Button
            key={s}
            size="sm"
            variant={status === s ? "default" : "outline"}
            onClick={() => { setStatus(s); setPage(1); }}
          >
            {s}
          </Button>
        ))}
      </div>

      <Card className="bg-white/70 dark:bg-black/70 backdrop-blur-md shadow-lg">
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
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Current Period</TableHead>
                  <TableHead className="text-center">Paid Cycles</TableHead>
                  <TableHead className="text-right">Total Revenue</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((sub: any) => {
                  const totalRevenue = (sub.paidCount || 0) * 99;
                  const payments = sub.payments || [];
                  const totalRefunded = payments.reduce(
                    (s: number, p: any) => s + (p.amountRefunded || 0),
                    0,
                  );
                  const invoices = payments.filter((p: any) => p.invoice);
                  return (
                    <TableRow key={sub.id}>
                      <TableCell>
                        <p className="font-medium">{sub.user?.name || "Unknown"}</p>
                        <p className="text-xs text-muted-foreground">{sub.user?.email}</p>
                      </TableCell>
                      <TableCell><StatusBadge status={sub.status} /></TableCell>
                      <TableCell className="text-muted-foreground">
                        <span className="text-xs font-mono">{sub.razorpayPlanId || "-"}</span>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-xs">
                        {sub.currentPeriodStart
                          ? new Date(sub.currentPeriodStart).toLocaleDateString()
                          : "-"}
                        {" - "}
                        {sub.currentPeriodEnd
                          ? new Date(sub.currentPeriodEnd).toLocaleDateString()
                          : "-"}
                      </TableCell>
                      <TableCell className="text-center">{sub.paidCount || 0}</TableCell>
                      <TableCell className="text-right font-mono">
                        <span>₹{totalRevenue.toLocaleString("en-IN")}</span>
                        {totalRefunded > 0 && (
                          <span className="text-destructive text-xs block">
                            (₹{(totalRefunded / 100).toLocaleString("en-IN")} refunded)
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="text-muted-foreground text-xs">
                        {new Date(sub.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        {invoices.length > 0 && (
                          <span className="text-xs text-muted-foreground mr-2">
                            {invoices.length} invoice{invoices.length > 1 ? "s" : ""}
                          </span>
                        )}
                        {sub.status !== "CANCELLED" && sub.status !== "EXPIRED" && (
                          <Button
                            size="sm"
                            variant="destructive"
                            disabled={cancelMutation.isPending}
                            onClick={() =>
                              setCancelTarget({
                                id: sub.razorpaySubscriptionId,
                                name: sub.user?.name || "this user",
                              })
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
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button size="sm" variant="outline" disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>
            <ArrowLeft className="h-4 w-4 mr-1" />
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {page} of {totalPages}
          </span>
          <Button size="sm" variant="outline" disabled={page >= totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))}>
            Next
            <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      )}

      <AlertDialog open={cancelTarget !== null} onOpenChange={() => setCancelTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Subscription</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to cancel the subscription for{" "}
              <strong>{cancelTarget?.name}</strong>? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep Subscription</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => cancelTarget && cancelMutation.mutate(cancelTarget.id)}
            >
              {cancelMutation.isPending ? (
                <Loader2 className="w-4 h-4 mr-1 animate-spin" />
              ) : (
                <Ban className="w-4 h-4 mr-1" />
              )}
              Yes, Cancel
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
