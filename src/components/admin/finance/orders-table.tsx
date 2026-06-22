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
import { Search, ArrowLeft, ArrowRight, ExternalLink } from "lucide-react";
import { useFinanceOrders } from "@/hooks/useAdmin";
import type { FinanceOrder, FinancePagination } from "@/lib/types";
import Link from "next/link";
import { ROUTES } from "@/lib/routes";
import { formatCurrency } from "@/lib/utils";

const statusColors: Record<string, string> = {
  PAID: "bg-green-500/20 text-green-600",
  CREATED: "bg-blue-500/20 text-blue-600",
  ATTEMPTED: "bg-amber-500/20 text-amber-600",
  EXPIRED: "bg-gray-500/20 text-gray-600",
  CANCELLED: "bg-red-500/20 text-red-600",
};

export function OrdersTable() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");

  const { data, isLoading } = useFinanceOrders({ page, limit: 15, status: status || undefined, search: search || undefined });

  const orders: FinanceOrder[] = data?.orders || [];
  const pagination: FinancePagination | undefined = data?.pagination;

  const handleSearch = () => {
    setSearch(searchInput);
    setPage(1);
  };

  return (
    <div className="space-y-4">
      <Card className="bg-white/70 dark:bg-black/70 backdrop-blur-md shadow-lg">
        <CardContent className="p-6">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search orders..."
                className="pl-8"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
            </div>
            <select
              className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
              value={status}
              onChange={(e) => { setStatus(e.target.value); setPage(1); }}
            >
              <option value="">All Statuses</option>
              <option value="CREATED">Created</option>
              <option value="ATTEMPTED">Attempted</option>
              <option value="PAID">Paid</option>
              <option value="EXPIRED">Expired</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
            <Button variant="secondary" size="sm" onClick={handleSearch}>Search</Button>
          </div>

          {isLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-8 w-full bg-white/20" />
              <Skeleton className="h-8 w-full bg-white/20" />
              <Skeleton className="h-8 w-full bg-white/20" />
            </div>
          ) : orders.length === 0 ? (
            <p className="text-center py-8 text-muted-foreground">No orders found</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Plan</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Invoice</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-mono text-xs">{order.razorpayOrderId.slice(0, 16)}...</TableCell>
                      <TableCell>
                        <div>
                          <p className="text-sm font-medium">{order.user?.name || "N/A"}</p>
                          <p className="text-xs text-muted-foreground">{order.user?.email}</p>
                        </div>
                      </TableCell>
                      <TableCell>{order.plan?.name || "—"}</TableCell>
                      <TableCell>
                        <span className="font-medium">
                          {formatCurrency(order.amount, order.currency)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge className={`text-xs ${statusColors[order.status] || "bg-gray-500/20 text-gray-600"}`}>
                          {order.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs font-mono">{order.invoiceId || "—"}</TableCell>
                      <TableCell className="text-xs">{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell>
                        {order.invoiceId && (
                          <Button variant="ghost" size="sm" asChild>
                            <Link href={`${ROUTES.ADMIN.INVOICE}/${order.invoiceId}`} target="_blank">
                              <ExternalLink className="h-4 w-4" />
                            </Link>
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
              <p className="text-sm text-muted-foreground">
                Page {pagination.page} of {pagination.totalPages} ({pagination.total} total)
              </p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" disabled={page >= pagination.totalPages} onClick={() => setPage((p) => p + 1)}>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}