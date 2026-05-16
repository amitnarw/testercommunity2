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
import { Search, ArrowLeft, ArrowRight, Eye } from "lucide-react";
import { useFinancePayments, useUserWalletDetail } from "@/hooks/useAdmin";
import type { FinancePayment, FinancePagination } from "@/lib/types";
import { UserWalletModal } from "./user-wallet-modal";

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
                          {p.currency === "INR" ? "₹" : "$"}{(p.amount / 100).toLocaleString()}
                        </span>
                        {p.fee ? <p className="text-xs text-muted-foreground">Fee: ₹{Math.floor(p.fee / 100)}</p> : null}
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
                        {p.user?.id && (
                          <Button variant="ghost" size="sm" onClick={() => setSelectedUserId(p.user!.id)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                        )}
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
    </div>
  );
}
