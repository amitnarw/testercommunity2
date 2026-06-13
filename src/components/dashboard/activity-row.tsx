"use client";

import { format } from "date-fns";
import {
  ShoppingCart,
  Wallet,
  ArrowDownLeft,
  Gift,
  RotateCcw,
  ArrowRightLeft,
  Activity,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { UserTransaction } from "@/lib/apiCalls";

interface ActivityRowProps {
  transaction: UserTransaction;
}

function getTransactionConfig(tx: UserTransaction) {
  const text = `${tx.type} ${tx.transactionType || ""} ${tx.description || ""}`.toLowerCase();

  if (/purchase|buy|plan/i.test(text)) {
    return { icon: ShoppingCart, color: "text-amber-500", bg: "bg-amber-500/10" };
  }
  if (/credit|earn|reward|bonus/i.test(text) || tx.changeType === "positive") {
    return { icon: Wallet, color: "text-emerald-500", bg: "bg-emerald-500/10" };
  }
  if (/debit|spend|use|submission|charge/i.test(text) || tx.changeType === "negative") {
    return { icon: ArrowDownLeft, color: "text-rose-500", bg: "bg-rose-500/10" };
  }
  if (/promo|free|gift/i.test(text)) {
    return { icon: Gift, color: "text-violet-500", bg: "bg-violet-500/10" };
  }
  if (/refund|chargeback/i.test(text)) {
    return { icon: RotateCcw, color: "text-orange-500", bg: "bg-orange-500/10" };
  }
  return { icon: ArrowRightLeft, color: "text-muted-foreground", bg: "bg-muted" };
}

export function ActivityRow({ transaction }: ActivityRowProps) {
  const c = getTransactionConfig(transaction);
  const Icon = c.icon;
  const isPositive = transaction.changeType === "positive";

  return (
    <div className="flex items-center justify-between p-2.5 rounded-xl hover:bg-muted/40 transition-colors">
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <div className={cn("rounded-xl p-2.5 shrink-0", c.bg)}>
          <Icon className={cn("w-4 h-4", c.color)} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium truncate">
            {transaction.description || transaction.type}
          </p>
          <p className="text-[10px] text-muted-foreground/60 mt-0.5">
            {format(new Date(transaction.date), "MMM d · h:mm a")}
          </p>
        </div>
      </div>
      <span
        className={cn(
          "shrink-0 ml-3 text-xs font-semibold tabular-nums",
          isPositive ? "text-emerald-500" : "text-rose-500",
        )}
      >
        {transaction.amount}
      </span>
    </div>
  );
}
