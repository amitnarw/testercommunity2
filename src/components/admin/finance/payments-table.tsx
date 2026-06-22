"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Search, ArrowLeft, ArrowRight, Eye, RotateCcw, Loader2 } from "lucide-react";
import { useFinancePayments, useUserWalletDetail, useInitiateRefund } from "@/hooks/useAdmin";
import type { FinancePayment, FinancePagination } from "@/lib/types";
import { UserWalletModal } from "./user-wallet-modal";
import { formatCurrency } from "@/lib/utils";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from "@/components/ui/dialog";
import { FeedbackModal } from "@/components/feedback-modal";

const statusColors: Record<string, string> = {
  CAPTURED: "bg-green-500/20 text-green-600",
  AUTHORIZED: "bg-blue-500/20 text-blue-600",
  PENDING: "bg-amber-500/20 text-amber-600",
  FAILED: "bg-red-500/20 text-red-600",
  REFUNDED: "bg-purple-500/20 text-purple-600",
  PARTIALLY_REFUNDED: "bg-orange-500/20 text-orange-600",
};

export function PaymentsTable() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("");
  const [method, setMethod] = useState("");
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [refundPayment, setRefundPaymentState] = useState<FinancePayment | null>(null);
  const [refundAmount, setRefundAmount] = useState<number>(0);
  const [refundReason, setRefundReason] = useState<string>("");
  const [feedback, setFeedback] = useState<any>(null);

  const openRefundDialog = (p: FinancePayment) => {
    setRefundPaymentState(p);
    setRefundAmount((p.amount - p.amountRefunded) / 100);
    setRefundReason("Customer requested refund");
  };

  const refundMutation = useInitiateRefund({
    onSuccess: () => {
      setRefundPaymentState(null);
      setFeedback({ open: true, status: "success", title: "Refunded!", description: "Refund has been processed successfully." });
    },
    onError: (err: any) => {
      setRefundPaymentState(null);
      setFeedback({ open: true, status: "error", title: "Refund Failed", description: err?.message || "Failed to process refund." });
    },
  });

  const handleRefund = () => {
    if (refundPayment) {
      refundMutation.mutate({
        paymentId: refundPayment.razorpayPaymentId,
        amount: refundAmount,
        reason: refundReason || undefined,
      });
    }
  };

  const { data, isLoading } = useFinancePayments({
    page, limit: 15,
    status: status || undefined,
    method: method || undefined,
    search: search || undefined,
  });

  const payments: FinancePayment[] = data?.payments || [];
  const pagination: FinancePagination | undefined = data?.pagination;

  return (
    <div className="space-y-4">
      <Card className="bg-white/70 dark:bg-black/70 backdrop-blur-md shadow-lg">
        <CardContent className="p-6">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search payments..."
                className="pl-8"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (setSearch(searchInput), setPage(1))}
              />
            </div>
            <select className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm" value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }}>
              <option value="">All Statuses</option>
              <option value="PENDING">Pending</option>
              <option value="AUTHORIZED">Authorized</option>
              <option value="CAPTURED">Captured</option>
              <option value="FAILED">Failed</option>
              <option value="REFUNDED">Refunded</option>
              <option value="PARTIALLY_REFUNDED">Partially Refunded</option>
            </select>
            <select className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm" value={method} onChange={(e) => { setMethod(e.target.value); setPage(1); }}>
              <option value="">All Methods</option>
              <option value="upi">UPI</option>
              <option value="card">Card</option>
              <option value="netbanking">Net Banking</option>
              <option value="wallet">Wallet</option>
            </select>
            <Button variant="secondary" size="sm" onClick={() => { setSearch(searchInput); setPage(1); }}>Search</Button>
          </div>

          {isLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-8 w-full bg-white/20" /><Skeleton className="h-8 w-full bg-white/20" /><Skeleton className="h-8 w-full bg-white/20" />
            </div>
          ) : payments.length === 0 ? (
            <p className="text-center py-8 text-muted-foreground">No payments found</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Payment ID</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Refund</TableHead>
                    <TableHead>Invoice</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payments.map((p) => (
                    <TableRow key={p.id}>
                      <TableCell className="font-mono text-xs">{p.razorpayPaymentId.slice(0, 12)}...</TableCell>
                      <TableCell>
                        <div>
                          <p className="text-sm font-medium">{p.user?.name || p.customer_name || "N/A"}</p>
                          <p className="text-xs text-muted-foreground">{p.user?.email || p.customer_email}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="font-medium">
                          {formatCurrency(p.amount, p.currency)}
                        </span>
                        {p.fee ? <p className="text-xs text-muted-foreground">Fee: {formatCurrency(p.fee, p.currency)}</p> : null}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs capitalize">{p.method || "—"}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={`text-xs ${statusColors[p.status] || "bg-gray-500/20 text-gray-600"}`}>{p.status}</Badge>
                      </TableCell>
                      <TableCell className="text-xs">
                        {p.refundStatus && p.refundStatus !== "NONE" ? (
                          <Badge className={`text-xs ${p.refundStatus === "FULL" ? "bg-red-500/20 text-red-600" : "bg-orange-500/20 text-orange-600"}`}>
                            {p.refundStatus}
                          </Badge>
                        ) : "—"}
                      </TableCell>
                      <TableCell className="text-xs font-mono">{p.invoice?.invoice_number || "—"}</TableCell>
                      <TableCell className="text-xs">{new Date(p.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          {p.user?.id && (
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setSelectedUserId(p.user!.id)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                          )}
                          {p.status === "CAPTURED" && p.refundStatus !== "FULL" && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-rose-600 hover:text-rose-700 hover:bg-rose-500/10"
                              onClick={() => openRefundDialog(p)}
                            >
                              <RotateCcw className="h-4 w-4" />
                            </Button>
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

      {selectedUserId && (
        <UserWalletModal
          userId={selectedUserId}
          open={!!selectedUserId}
          onClose={() => setSelectedUserId(null)}
        />
      )}

      {refundPayment && (
        <Dialog open={!!refundPayment} onOpenChange={(open) => { if (!open) setRefundPaymentState(null); }}>
          <DialogContent className="sm:max-w-[480px]">
            <DialogHeader>
              <DialogTitle>Refund Payment</DialogTitle>
              <DialogDescription>
                Initiate a refund for payment <span className="font-mono text-xs font-semibold">{refundPayment.razorpayPaymentId.slice(0, 15)}...</span>.
                This will reverse the payment in Razorpay and deduct the matching packages from the customer's wallet.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label className="text-sm font-medium">Refund Amount</label>
                <div className="flex items-center gap-2">
                  <span className="text-lg">{refundPayment.currency === "INR" ? "₹" : "$"}</span>
                  <Input
                    type="number"
                    step="0.01"
                    min="0.01"
                    max={(refundPayment.amount - refundPayment.amountRefunded) / 100}
                    value={refundAmount}
                    onChange={(e) => setRefundAmount(parseFloat(e.target.value) || 0)}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Max refundable: {formatCurrency(refundPayment.amount - refundPayment.amountRefunded, refundPayment.currency)}
                </p>
              </div>

              <div className="grid gap-2">
                <label className="text-sm font-medium">Reason for Refund</label>
                <Input
                  value={refundReason}
                  onChange={(e) => setRefundReason(e.target.value)}
                  placeholder="Customer requested refund"
                />
              </div>
            </div>

            <DialogFooter className="gap-2 sm:gap-0">
              <Button variant="ghost" onClick={() => setRefundPaymentState(null)}>Cancel</Button>
              <Button
                variant="destructive"
                onClick={handleRefund}
                disabled={refundMutation.isPending}
              >
                {refundMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Confirm Refund
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
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
