"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useFinanceRefunds } from "@/hooks/useAdmin";
import type { FinanceRefund, FinancePagination } from "@/lib/types";

const statusColors: Record<string, string> = {
  PROCESSED: "bg-green-500/20 text-green-600",
  PENDING: "bg-amber-500/20 text-amber-600",
  FAILED: "bg-red-500/20 text-red-600",
};

export function RefundsTable() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("");

  const { data, isLoading } = useFinanceRefunds({ page, limit: 15, status: status || undefined });

  const refunds: FinanceRefund[] = data?.refunds || [];
  const pagination: FinancePagination | undefined = data?.pagination;

  return (
    <div className="space-y-4">
      <Card className="bg-white/70 dark:bg-black/70 backdrop-blur-md shadow-lg">
        <CardContent className="p-6">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <select className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm" value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }}>
              <option value="">All Statuses</option>
              <option value="PENDING">Pending</option>
              <option value="PROCESSED">Processed</option>
              <option value="FAILED">Failed</option>
            </select>
          </div>

          {isLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-8 w-full bg-white/20" /><Skeleton className="h-8 w-full bg-white/20" />
            </div>
          ) : refunds.length === 0 ? (
            <p className="text-center py-8 text-muted-foreground">No refunds found</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Refund ID</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>Speed</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Processed</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {refunds.map((r) => (
                    <TableRow key={r.id}>
                      <TableCell className="font-mono text-xs">{r.razorpayRefundId.slice(0, 14)}...</TableCell>
                      <TableCell>
                        <div>
                          <p className="text-sm font-medium">{r.payment?.user?.name || "N/A"}</p>
                          <p className="text-xs text-muted-foreground">{r.payment?.user?.email}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="font-medium">₹{(r.amount / 100).toLocaleString()}</span>
                      </TableCell>
                      <TableCell>
                        <Badge className={`text-xs ${statusColors[r.status] || "bg-gray-500/20 text-gray-600"}`}>{r.status}</Badge>
                      </TableCell>
                      <TableCell className="text-xs max-w-[200px] truncate">{r.reason || "—"}</TableCell>
                      <TableCell className="text-xs capitalize">{r.speed || "normal"}</TableCell>
                      <TableCell className="text-xs">{new Date(r.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell className="text-xs">{r.processedAt ? new Date(r.processedAt).toLocaleDateString() : "—"}</TableCell>
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
    </div>
  );
}
