"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useUserWalletDetail } from "@/hooks/useAdmin";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Wallet, TrendingUp, TrendingDown, Package, DollarSign } from "lucide-react";

interface Props {
  userId: string;
  open: boolean;
  onClose: () => void;
}

const transactionTypeColors: Record<string, string> = {
  EARNING: "bg-green-500/20 text-green-600",
  WITHDRAWAL: "bg-red-500/20 text-red-600",
  PURCHASE: "bg-blue-500/20 text-blue-600",
  REFUND: "bg-purple-500/20 text-purple-600",
  BONUS: "bg-amber-500/20 text-amber-600",
};

const withdrawalStatusColors: Record<string, string> = {
  PENDING: "bg-amber-500/20 text-amber-600",
  APPROVED: "bg-blue-500/20 text-blue-600",
  REJECTED: "bg-red-500/20 text-red-600",
  PAID: "bg-green-500/20 text-green-600",
};

export function UserWalletModal({ userId, open, onClose }: Props) {
  const { data, isLoading } = useUserWalletDetail(userId);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            User Wallet Details
          </DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-20 w-full bg-white/20" />
            <Skeleton className="h-40 w-full bg-white/20" />
          </div>
        ) : data ? (
          <div className="space-y-6">
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-secondary/30 rounded-xl p-4 text-center">
                <Package className="h-5 w-5 mx-auto mb-1 text-blue-500" />
                <p className="text-2xl font-bold">{data.wallet.totalPackages}</p>
                <p className="text-xs text-muted-foreground">Packages</p>
              </div>
              <div className="bg-secondary/30 rounded-xl p-4 text-center">
                <TrendingUp className="h-5 w-5 mx-auto mb-1 text-green-500" />
                <p className="text-2xl font-bold">{data.wallet.totalPoints}</p>
                <p className="text-xs text-muted-foreground">Points</p>
              </div>
              <div className="bg-secondary/30 rounded-xl p-4 text-center">
                <DollarSign className="h-5 w-5 mx-auto mb-1 text-amber-500" />
                <p className="text-2xl font-bold">₹{data.wallet.balanceMoney}</p>
                <p className="text-xs text-muted-foreground">Balance</p>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold mb-2">Recent Transactions ({data.transactions.length})</h4>
              <div className="overflow-x-auto max-h-[200px] overflow-y-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Type</TableHead>
                      <TableHead>Points</TableHead>
                      <TableHead>Package</TableHead>
                      <TableHead>Action</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.transactions.slice(0, 20).map((t: any) => (
                      <TableRow key={t.id}>
                        <TableCell>
                          <Badge className={`text-xs ${transactionTypeColors[t.transactionType] || "bg-gray-500/20 text-gray-600"}`}>
                            {t.transactionType}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <span className={t.status === "CREDIT" ? "text-green-600" : t.status === "DEBIT" ? "text-red-600" : ""}>
                            {t.points !== null && t.points !== 0 ? `${t.status === "CREDIT" ? "+" : ""}${t.points}` : "—"}
                          </span>
                        </TableCell>
                        <TableCell>
                          {t.package !== null && t.package !== 0 ? `${t.status === "CREDIT" ? "+" : ""}${t.package}` : "—"}
                        </TableCell>
                        <TableCell className="text-xs capitalize">{t.action?.replace(/_/g, " ") || "—"}</TableCell>
                        <TableCell className="text-xs">{new Date(t.createdAt).toLocaleDateString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>

            {data.withdrawals.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold mb-2">Withdrawals ({data.withdrawals.length})</h4>
                <div className="overflow-x-auto max-h-[150px] overflow-y-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Amount</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Note</TableHead>
                        <TableHead>Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {data.withdrawals.map((w: any) => (
                        <TableRow key={w.id}>
                          <TableCell className="font-medium">₹{w.amount}</TableCell>
                          <TableCell>
                            <Badge className={`text-xs ${withdrawalStatusColors[w.status] || ""}`}>{w.status}</Badge>
                          </TableCell>
                          <TableCell className="text-xs">{w.note || "—"}</TableCell>
                          <TableCell className="text-xs">{new Date(w.requestedAt).toLocaleDateString()}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}
          </div>
        ) : (
          <p className="text-center py-4 text-muted-foreground">Failed to load wallet data</p>
        )}
      </DialogContent>
    </Dialog>
  );
}
