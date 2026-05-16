"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { FeedbackModal } from "@/components/feedback-modal";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Search, ArrowLeft, ArrowRight, CheckCircle, XCircle } from "lucide-react";
import { useFinanceWithdrawals, useApproveWithdrawal, useRejectWithdrawal } from "@/hooks/useAdmin";
import { useQueryClient } from "@tanstack/react-query";
import type { FinanceWithdrawal, FinancePagination } from "@/lib/types";

const statusColors: Record<string, string> = {
  PENDING: "bg-amber-500/20 text-amber-600",
  APPROVED: "bg-blue-500/20 text-blue-600",
  REJECTED: "bg-red-500/20 text-red-600",
  PAID: "bg-green-500/20 text-green-600",
};

export function WithdrawalsTable() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [feedback, setFeedback] = useState<any>(null);
  const [rejectId, setRejectId] = useState<number | null>(null);
  const [rejectNote, setRejectNote] = useState("");
  const queryClient = useQueryClient();

  const { data, isLoading } = useFinanceWithdrawals({ page, limit: 15, status: status || undefined, search: search || undefined });

  const approveMutation = useApproveWithdrawal({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["useFinanceWithdrawals"] });
      queryClient.invalidateQueries({ queryKey: ["useFinanceDashboard"] });
      setFeedback({ open: true, status: "success", title: "Approved!", description: "Withdrawal request has been approved." });
    },
    onError: (err: any) => {
      setFeedback({ open: true, status: "error", title: "Failed", description: err?.message || "Failed to approve withdrawal" });
    },
  });

  const rejectMutation = useRejectWithdrawal({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["useFinanceWithdrawals"] });
      queryClient.invalidateQueries({ queryKey: ["useFinanceDashboard"] });
      setRejectId(null);
      setRejectNote("");
      setFeedback({ open: true, status: "success", title: "Rejected", description: "Withdrawal request has been rejected." });
    },
    onError: (err: any) => {
      setFeedback({ open: true, status: "error", title: "Failed", description: err?.message || "Failed to reject withdrawal" });
    },
  });

  const withdrawals: FinanceWithdrawal[] = data?.withdrawals || [];
  const pagination: FinancePagination | undefined = data?.pagination;

  return (
    <div className="space-y-4">
      <Card className="bg-white/70 dark:bg-black/70 backdrop-blur-md shadow-lg">
        <CardContent className="p-6">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by user..."
                className="pl-8"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (setSearch(searchInput), setPage(1))}
              />
            </div>
            <select className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm" value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }}>
              <option value="">All Statuses</option>
              <option value="PENDING">Pending</option>
              <option value="APPROVED">Approved</option>
              <option value="REJECTED">Rejected</option>
              <option value="PAID">Paid</option>
            </select>
            <Button variant="secondary" size="sm" onClick={() => { setSearch(searchInput); setPage(1); }}>Search</Button>
          </div>

          {isLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-8 w-full bg-white/20" /><Skeleton className="h-8 w-full bg-white/20" />
            </div>
          ) : withdrawals.length === 0 ? (
            <p className="text-center py-8 text-muted-foreground">No withdrawal requests found</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Currency</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Note</TableHead>
                    <TableHead>Requested</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {withdrawals.map((w) => (
                    <TableRow key={w.id}>
                      <TableCell>
                        <div>
                          <p className="text-sm font-medium">{w.user?.name}</p>
                          <p className="text-xs text-muted-foreground">{w.user?.email}</p>
                        </div>
                      </TableCell>
                      <TableCell className="font-semibold">{w.currency === "USD" ? "$" : "₹"}{w.amount.toLocaleString()}</TableCell>
                      <TableCell className="text-sm">{w.currency}</TableCell>
                      <TableCell>
                        <Badge className={`text-xs ${statusColors[w.status] || "bg-gray-500/20 text-gray-600"}`}>{w.status}</Badge>
                      </TableCell>
                      <TableCell className="text-xs max-w-[150px] truncate">{w.note || "—"}</TableCell>
                      <TableCell className="text-xs">{new Date(w.requestedAt).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          {w.status === "PENDING" && (
                            <>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-green-600 hover:text-green-700 hover:bg-green-500/10"
                                onClick={() => approveMutation.mutate(w.id)}
                                disabled={approveMutation.isPending}
                              >
                                <CheckCircle className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-red-600 hover:text-red-700 hover:bg-red-500/10"
                                onClick={() => { setRejectId(w.id); setRejectNote(""); }}
                              >
                                <XCircle className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {pagination && pagination.totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <p className="text-sm text-muted-foreground">Page {pagination.page} of {pagination.totalPages}</p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}><ArrowLeft className="h-4 w-4" /></Button>
                <Button variant="outline" size="sm" disabled={page >= pagination.totalPages} onClick={() => setPage((p) => p + 1)}><ArrowRight className="h-4 w-4" /></Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {rejectId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setRejectId(null)}>
          <div className="bg-background rounded-xl p-6 w-full max-w-md shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-semibold mb-4">Reject Withdrawal</h3>
            <p className="text-sm text-muted-foreground mb-4">Provide a reason for rejecting this withdrawal request.</p>
            <textarea
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm min-h-[100px]"
              placeholder="Reason for rejection..."
              value={rejectNote}
              onChange={(e) => setRejectNote(e.target.value)}
            />
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={() => setRejectId(null)}>Cancel</Button>
              <Button
                variant="destructive"
                onClick={() => rejectMutation.mutate({ id: rejectId, note: rejectNote || undefined })}
                disabled={rejectMutation.isPending}
              >
                {rejectMutation.isPending ? "Rejecting..." : "Reject"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {feedback && (
        <FeedbackModal
          open={feedback.open}
          onOpenChange={() => setFeedback(null)}
          status={feedback.status}
          title={feedback.title}
          description={feedback.description}
        />
      )}
    </div>
  );
}
