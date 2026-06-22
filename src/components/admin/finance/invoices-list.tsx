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
import { Search, ArrowLeft, ArrowRight, ExternalLink, Eye } from "lucide-react";
import { useFinanceInvoices } from "@/hooks/useAdmin";
import type { FinanceInvoice, FinancePagination } from "@/lib/types";
import Link from "next/link";
import { ROUTES } from "@/lib/routes";
import { formatCurrency } from "@/lib/utils";

export function InvoicesList() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");

  const { data, isLoading } = useFinanceInvoices({ page, limit: 15, search: search || undefined });

  const invoices: FinanceInvoice[] = data?.invoices || [];
  const pagination: FinancePagination | undefined = data?.pagination;

  return (
    <div className="space-y-4">
      <Card className="bg-white/70 dark:bg-black/70 backdrop-blur-md shadow-lg">
        <CardContent className="p-6">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search invoices..."
                className="pl-8"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (setSearch(searchInput), setPage(1))}
              />
            </div>
            <Button variant="secondary" size="sm" onClick={() => { setSearch(searchInput); setPage(1); }}>Search</Button>
          </div>

          {isLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-8 w-full bg-white/20" /><Skeleton className="h-8 w-full bg-white/20" />
            </div>
          ) : invoices.length === 0 ? (
            <p className="text-center py-8 text-muted-foreground">No invoices found</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice #</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Service</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Payment</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoices.map((inv) => (
                    <TableRow key={inv.id}>
                      <TableCell className="font-mono text-xs font-medium">{inv.invoice_number}</TableCell>
                      <TableCell>
                        <div>
                          <p className="text-sm font-medium">{inv.user?.name}</p>
                          <p className="text-xs text-muted-foreground">{inv.user?.email}</p>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">{inv.service_name}</TableCell>
                      <TableCell>
                        <span className="font-medium">
                          {inv.payment ? formatCurrency(inv.payment.amount, inv.payment.currency) : "—"}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={`text-xs ${inv.payment?.status === "CAPTURED" ? "border-green-500/30 text-green-600" : ""}`}>
                          {inv.payment?.status || "—"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs">{new Date(inv.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`${ROUTES.ADMIN.INVOICE}/${inv.invoice_number}`} target="_blank">
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>
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
    </div>
  );
}
