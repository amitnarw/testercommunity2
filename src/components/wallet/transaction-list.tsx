import { motion } from "framer-motion";
import { Search, ChevronRight, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UserTransaction } from "@/lib/apiCalls";
import { TransactionItem } from "@/components/wallet/transaction-item";

interface TransactionListProps {
  transactionsIsPending: boolean;
  transactionsIsError: boolean;
  paginatedTransactions: UserTransaction[];
  totalPages: number;
  page: number;
  setPage: (value: number | ((prev: number) => number)) => void;
  filter: string;
  setFilter: (value: string) => void;
  searchQuery: string;
  setSearchQuery: (value: string) => void;
}

export function TransactionList({
  transactionsIsPending,
  transactionsIsError,
  paginatedTransactions,
  totalPages,
  page,
  setPage,
  filter,
  setFilter,
  searchQuery,
  setSearchQuery,
}: TransactionListProps) {
  return (
    <div className="bg-card/30 backdrop-blur-xl border border-border/50 rounded-[2.5rem] p-5 md:p-8 shadow-sm h-full flex flex-col min-h-[600px]">
      <div className="flex-1 flex flex-col">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 md:mb-8 gap-4">
          <h2 className="text-xl md:text-2xl font-bold">Transactions</h2>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative w-full sm:w-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search transactions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-10 pl-9 pr-4 rounded-full bg-secondary/50 border-none text-sm w-full sm:w-48 focus:ring-2 focus:ring-primary/20 outline-none transition-all hover:bg-secondary"
              />
            </div>
          </div>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-4 mb-2 no-scrollbar px-1">
          {["All", "Purchase", "Earned", "Spent"].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`
                                    px-4 md:px-5 py-2 md:py-2.5 rounded-full text-xs md:text-sm font-medium transition-all whitespace-nowrap flex-shrink-0
                                    ${
                                      filter === tab
                                        ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                                        : "bg-secondary/50 text-muted-foreground hover:bg-secondary hover:text-foreground"
                                    }
                                `}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="space-y-2 mt-2 md:mt-4 flex-1">
          {transactionsIsPending ? (
            <div className="text-center py-20 text-muted-foreground">
              Loading transactions...
            </div>
          ) : transactionsIsError ? (
            <div className="text-center py-20 text-muted-foreground">
              Error loading transactions.
            </div>
          ) : paginatedTransactions.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground">
              No transactions found matching your criteria.
            </div>
          ) : (
            <>
              {paginatedTransactions.map(
                (transaction: UserTransaction, index: number) => (
                  <motion.div
                    key={transaction.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <TransactionItem item={transaction} />
                  </motion.div>
                )
              )}
            </>
          )}
        </div>
      </div>

      <div className="mt-8 flex items-center justify-between">
        <p className="text-xs text-muted-foreground font-medium hidden sm:block">
          Page{" "}
          <span className="text-foreground">{page}</span> of{" "}
          <span className="text-foreground">
            {totalPages || 1}
          </span>
        </p>
        <div className="flex gap-2 sm:gap-3 w-full sm:w-auto justify-between sm:justify-end">
          <Button
            variant="outline"
            size="sm"
            className="rounded-xl px-3 sm:px-5 hover:bg-secondary transition-all disabled:opacity-30 flex items-center justify-center min-w-[40px] sm:min-w-0"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            <ChevronLeft className="w-4 h-4 sm:mr-1" />
            <span className="hidden sm:inline">Previous</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="rounded-xl px-3 sm:px-5 hover:bg-secondary transition-all disabled:opacity-30 flex items-center justify-center min-w-[40px] sm:min-w-0"
            onClick={() =>
              setPage((p) => Math.min(totalPages, p + 1))
            }
            disabled={page >= totalPages}
          >
            <span className="hidden sm:inline">Next</span>
            <ChevronRight className="w-4 h-4 sm:ml-1" />
          </Button>
        </div>
      </div>
    </div>
  );
}
