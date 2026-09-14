"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { FeedbackModal } from "@/components/feedback-modal";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from "@/components/ui/dialog";
import { useFinancePricing, useUpdateFinancePricing } from "@/hooks/useAdmin";
import { useQueryClient } from "@tanstack/react-query";
import type { FinancePricing } from "@/lib/types";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Pencil, Loader2 } from "lucide-react";

function formatDisplayAmount(amount: number, symbol: string) {
  return `${symbol}${(amount / 100).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function PricingTable() {
  const { data: pricing, isLoading } = useFinancePricing();
  const [editItem, setEditItem] = useState<FinancePricing | null>(null);
  const [editForm, setEditForm] = useState<any>({});
  const [feedback, setFeedback] = useState<any>(null);
  const queryClient = useQueryClient();

  const updateMutation = useUpdateFinancePricing({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["useFinancePricing"] });
      setEditItem(null);
      setFeedback({ open: true, status: "success", title: "Updated!", description: "Pricing updated successfully." });
    },
    onError: (err: any) => {
      setFeedback({ open: true, status: "error", title: "Failed", description: err?.message || "Failed to update pricing" });
    },
  });

  const openEdit = (item: FinancePricing) => {
    setEditItem(item);
    setEditForm({
      amount_display: item.amount / 100,
      is_active: item.is_active,
      country_name: item.country_name,
      currency_code: item.currency_code,
      currency_symbol: item.currency_symbol,
    });
  };

  const saveEdit = () => {
    if (editItem) {
      updateMutation.mutate({
        id: editItem.id,
        payload: {
          amount: Math.round(editForm.amount_display * 100),
          is_active: editForm.is_active,
          country_name: editForm.country_name,
          currency_code: editForm.currency_code,
          currency_symbol: editForm.currency_symbol,
        },
      });
    }
  };

  const list: FinancePricing[] = Array.isArray(pricing) ? pricing : [];

  return (
    <div className="space-y-4">
      <Card className="bg-white/70 dark:bg-black/70 backdrop-blur-md shadow-lg">
        <CardContent className="p-6">
          <p className="text-xs text-muted-foreground mb-4">
            Razorpay accepts amounts in the smallest currency unit (e.g., paise for INR, cents for USD).
            Values below are shown in the base unit and converted automatically.
          </p>

          {isLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-8 w-full bg-white/20" />
              <Skeleton className="h-8 w-full bg-white/20" />
            </div>
          ) : list.length === 0 ? (
            <p className="text-center py-8 text-muted-foreground">No pricing data found</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Country</TableHead>
                    <TableHead>Code</TableHead>
                    <TableHead>Currency</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Active</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {list.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.country_name}</TableCell>
                      <TableCell className="text-sm font-mono">{item.country_code}</TableCell>
                      <TableCell className="text-sm">{item.currency_code} ({item.currency_symbol})</TableCell>
                      <TableCell className="font-semibold">{formatDisplayAmount(item.amount, item.currency_symbol)}</TableCell>
                      <TableCell>
                        <Badge className={`text-xs ${item.is_active ? "bg-green-500/20 text-green-600" : "bg-gray-500/20 text-gray-600"}`}>
                          {item.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm" onClick={() => openEdit(item)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={!!editItem} onOpenChange={(open) => { if (!open) setEditItem(null); }}>
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle>Edit Pricing — {editItem?.country_name}</DialogTitle>
            <DialogDescription>
              Update the pricing for {editItem?.country_name} ({editItem?.country_code}).
              The amount is in the base currency unit and will be converted to the smallest unit (paise/cents) automatically.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label className="text-sm font-medium">Country Name</label>
              <Input
                value={editForm.country_name || ""}
                onChange={(e) => setEditForm({ ...editForm, country_name: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <label className="text-sm font-medium">Currency Code</label>
                <Input
                  value={editForm.currency_code || ""}
                  onChange={(e) => setEditForm({ ...editForm, currency_code: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium">Symbol</label>
                <Input
                  value={editForm.currency_symbol || ""}
                  onChange={(e) => setEditForm({ ...editForm, currency_symbol: e.target.value })}
                />
              </div>
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-medium">Price (base unit)</label>
              <div className="flex items-center gap-2">
                <span className="text-lg">{editForm.currency_symbol}</span>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  value={editForm.amount_display || 0}
                  onChange={(e) => setEditForm({ ...editForm, amount_display: parseFloat(e.target.value) || 0 })}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Stored as {Math.round((editForm.amount_display || 0) * 100)} {editForm.currency_code} in Razorpay (smallest unit)
              </p>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={editForm.is_active || false}
                onChange={(e) => setEditForm({ ...editForm, is_active: e.target.checked })}
                className="h-4 w-4"
              />
              <label className="text-sm font-medium">Active</label>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="ghost" onClick={() => setEditItem(null)}>Cancel</Button>
            <Button onClick={saveEdit} disabled={updateMutation.isPending}>
              {updateMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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