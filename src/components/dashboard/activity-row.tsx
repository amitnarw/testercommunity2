"use client";

import {
  ShoppingCart,
  Wallet,
  ArrowDownLeft,
  Gift,
  RotateCcw,
  ArrowRightLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { UserTransaction } from "@/lib/apiCalls";

interface ActivityRowProps {
  transaction: UserTransaction;
  isLast?: boolean;
}

function getTransactionConfig(tx: UserTransaction) {
  const text = `${tx.type} ${tx.transactionType || ""} ${tx.description || ""}`.toLowerCase();

  if (/purchase|buy|plan/i.test(text)) {
    return { icon: ShoppingCart, color: "text-amber-500" };
  }
  if (/credit|earn|reward|bonus/i.test(text) || tx.changeType === "positive") {
    return { icon: Wallet, color: "text-emerald-500" };
  }
  if (/debit|spend|use|submission|charge/i.test(text) || tx.changeType === "negative") {
    return { icon: ArrowDownLeft, color: "text-rose-500" };
  }
  if (/promo|free|gift/i.test(text)) {
    return { icon: Gift, color: "text-violet-500" };
  }
  if (/refund|chargeback/i.test(text)) {
    return { icon: RotateCcw, color: "text-orange-500" };
  }
  return { icon: ArrowRightLeft, color: "text-muted-foreground" };
}

export function ActivityRow({ transaction, isLast }: ActivityRowProps) {
  const c = getTransactionConfig(transaction);
  const Icon = c.icon;
  const isPositive = transaction.changeType === "positive";

  return (
    <div
      className={cn(
        "group flex items-center justify-between gap-3 px-2 py-3 rounded-xl transition-colors",
        "hover:bg-slate-100/60 dark:hover:bg-white/[0.04]",
        !isLast && "border-b border-slate-100 dark:border-white/[0.08]",
      )}
    >
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <div className="rounded-xl p-2.5 shrink-0 bg-slate-100 dark:bg-white/5 ring-1 ring-slate-200/50 dark:ring-white/10">
          <Icon className={cn("w-4 h-4", c.color)} />
        </div>
        <p className="min-w-0 flex-1 text-sm font-medium truncate text-slate-800 dark:text-white/90">
          {transaction.description || transaction.type}
        </p>
      </div>
      <span
        className={cn(
          "shrink-0 ml-3 text-[13px] font-semibold tabular-nums",
          isPositive ? "text-emerald-500" : "text-rose-500",
        )}
      >
        {transaction.amount}
      </span>
    </div>
  );
}
