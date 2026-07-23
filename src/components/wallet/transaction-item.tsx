import { ArrowUpRight, ArrowDownLeft, RotateCcw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { UserTransaction } from "@/lib/apiCalls";

function CurrencyBadge({
  method,
}: {
  method: UserTransaction["paymentMethod"];
}) {
  if (!method) return null;
  const config = {
    POINTS: {
      label: "pts",
      className:
        "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
    },
    PACKAGE: {
      label: "pkg",
      className:
        "bg-blue-500/10 text-blue-600 border-blue-500/20",
    },
    PROMO_FREE: {
      label: "promo",
      className:
        "bg-purple-500/10 text-purple-600 border-purple-500/20",
    },
  }[method];
  return (
    <span
      className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-[9px] font-semibold border uppercase tracking-wider ${config.className}`}
    >
      {config.label}
    </span>
  );
}

interface TransactionItemProps {
  item: UserTransaction;
}

export function TransactionItem({ item }: TransactionItemProps) {
  const isPositive = item.changeType === "positive";
  const isRefund = item.transactionType === "REFUND";
  return (
    <div className="group flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl hover:bg-secondary/50 transition-all duration-200 cursor-pointer border border-transparent hover:border-border/50 gap-3 sm:gap-0">
      <div className="flex items-center gap-4">
        <div
          className={`
                    w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center border flex-shrink-0
                    ${
                      isRefund
                        ? "bg-violet-500/10 border-violet-500/20 text-violet-500"
                        : isPositive
                          ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500"
                          : "bg-rose-500/10 border-rose-500/20 text-rose-500"
                    }
                `}
        >
          {isRefund ? (
            <RotateCcw className="w-5 h-5" />
          ) : isPositive ? (
            <ArrowUpRight className="w-5 h-5" />
          ) : (
            <ArrowDownLeft className="w-5 h-5" />
          )}
        </div>
        <div className="min-w-0">
          <p className="font-semibold text-foreground group-hover:text-primary transition-colors text-sm sm:text-base truncate pr-2">
            {item.description}
          </p>
          <div className="flex flex-wrap items-center gap-2 mt-1">
            <Badge
              variant="secondary"
              className={`text-[10px] h-5 px-1.5 font-normal whitespace-nowrap ${
                isRefund
                  ? "bg-violet-500/10 text-violet-600 border-violet-500/20"
                  : "bg-secondary text-muted-foreground"
              }`}
            >
              {item.type}
            </Badge>
            <span className="text-[10px] sm:text-xs text-muted-foreground whitespace-nowrap">
              {item.date}
            </span>
          </div>
        </div>
      </div>

      <div className="flex sm:flex-col justify-between items-center sm:items-end pl-[3.5rem] sm:pl-0">
        <div className="flex items-center gap-1.5">
          <p
            className={`font-bold tabular-nums text-sm sm:text-base ${
              isRefund ? "text-violet-600" : isPositive ? "text-emerald-500" : "text-foreground"
            }`}
          >
            {item.amount}
          </p>
          {!isRefund && <CurrencyBadge method={item.paymentMethod} />}
        </div>
        <div className="flex items-center gap-2 sm:mt-1">
          <span
            className={`w-2 h-2 rounded-full ${
              isRefund
                ? "bg-violet-500"
                : item.status === "Completed"
                  ? "bg-emerald-500"
                  : "bg-yellow-500"
            }`}
          />
          <p className="text-[10px] sm:text-xs text-muted-foreground capitalize">
            {isRefund ? "Refunded" : item.status}
          </p>
        </div>
      </div>
    </div>
  );
}
