"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  ArrowDownLeft,
  Plus,
  Wallet,
  TrendingUp,
  Search,
  Filter,
  Bell,
  LayoutDashboard,
  Briefcase,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TransitionLink } from "@/components/transition-link";
import { authClient } from "@/lib/auth-client";
import { useGetUserWallet, useGetUserTransactions } from "@/hooks/useUser";
import { UserWallerResponse } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import { UserTransaction } from "@/lib/apiCalls";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 20,
    },
  },
};

const WalletCard = ({
  session,
  sessionIsPending,
  walletData,
  walletIsPending,
}: {
  session: {
    user: {
      id: string;
      createdAt: Date;
      updatedAt: Date;
      email: string;
      emailVerified: boolean;
      name: string;
      image?: string | null | undefined;
    };
    session: {
      id: string;
      createdAt: Date;
      updatedAt: Date;
      userId: string;
      expiresAt: Date;
      token: string;
      ipAddress?: string | null | undefined;
      userAgent?: string | null | undefined;
    };
  } | null;
  sessionIsPending: boolean;
  walletData: UserWallerResponse | undefined;
  walletIsPending: boolean;
}) => (
  <div className="relative h-40 sm:h-64 w-full rounded-[2rem] overflow-hidden group shadow-2xl shadow-primary/20">
    <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" />

    <div className="absolute -top-24 -right-24 w-64 h-40 sm:h-64 bg-primary/40 rounded-full blur-[80px] group-hover:bg-primary/50 transition-colors duration-500" />
    <div className="absolute -bottom-24 -left-24 w-64 h-40 sm:h-64 bg-primary/20 rounded-full blur-[80px]" />

    <div
      className="absolute inset-0 opacity-[0.03]"
      style={{
        backgroundImage:
          'url(\'data:image/svg+xml,%3Csvg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"%3E%3Cfilter id="noiseFilter"%3E%3CfeTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch"/%3E%3C/filter%3E%3Crect width="100%25" height="100%25" filter="url(%23noiseFilter)" opacity="1"/%3E%3C/svg%3E\')',
      }}
    />

    <div className="relative h-full p-6 sm:p-8 flex flex-col justify-between z-10 text-white">
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <p className="text-white/60 text-xs sm:text-sm font-medium tracking-wider">
            TOTAL BALANCE
          </p>
          <div className="flex flex-row gap-4 items-center">
            {sessionIsPending ? (
              <div>
                <Skeleton className="w-24 h-8" />
                <hr className="w-[1px] h-8 bg-white rotate-[20deg]" />
                <Skeleton className="w-24 h-8" />
              </div>
            ) : (
              <>
                <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
                  {walletData?.totalPackages || 0}{" "}
                  <span className="text-sm sm:text-lg text-white/50 font-normal">
                    pkgs
                  </span>
                </h2>
                <hr className="w-[1px] h-8 bg-white rotate-[20deg]" />
                <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
                  {walletData?.totalPoints || 0}{" "}
                  <span className="text-sm sm:text-lg text-white/50 font-normal">
                    pts
                  </span>
                </h2>
              </>
            )}
          </div>
        </div>
        <ActionButton
          icon={Plus}
          label="Top Up"
          href="/billing"
        />
      </div>

      <div className="flex justify-between items-end">
        <div className="space-y-4">
          <div className="flex gap-2 sm:gap-3">
            <Badge
              variant="outline"
              className="bg-white/5 border-white/10 text-white hover:bg-white/10 cursor-pointer backdrop-blur-sm transition-colors text-[10px] sm:text-xs"
            >
              Active
            </Badge>
            <Badge
              variant="outline"
              className="bg-white/5 border-white/10 text-emerald-400 hover:bg-white/10 cursor-pointer backdrop-blur-sm transition-colors flex items-center gap-1 text-[10px] sm:text-xs"
            >
              <TrendingUp className="w-3 h-3" /> +12.5%
            </Badge>
          </div>
        </div>
        <div className="text-right">
          <p className="text-white/40 text-[10px] sm:text-xs font-mono mb-1">
            CARD HOLDER
          </p>
          <p className="font-semibold tracking-wide text-sm sm:text-base">
            {session?.user?.name}
          </p>
        </div>
      </div>
    </div>
  </div>
);

const ActionButton = ({
  icon: Icon,
  label,
  href,
  primary = false,
}: {
  icon: any;
  label: string;
  href: string;
  primary?: boolean;
}) => (
  <TransitionLink
    href={href}
    className={`flex flex-col items-center gap-2 sm:gap-3 group transition-all duration-300 ${primary ? "hover:-translate-y-1" : ""
      }`}
  >
    <div
      className={`
            w-12 h-12 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-lg
            ${primary
          ? "bg-gradient-to-br from-primary to-blue-600 text-white shadow-primary/25 group-hover:shadow-primary/40"
          : "bg-card border border-border text-foreground hover:bg-accent hover:border-accent shadow-sm"
        }
        `}
    >
      <Icon
        className={`w-5 h-5 sm:w-6 sm:h-6 ${primary ? "" : "text-foreground/70"
          }`}
      />
    </div>
    <span className="text-xs sm:text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
      {label}
    </span>
  </TransitionLink>
);

const UnifiedActivityChart = ({
  data,
  totalPackages,
  totalPoints,
}: {
  data: { name: string; package: number; points: number }[];
  totalPackages: number;
  totalPoints: number;
}) => {
  return (
    <div className="bg-card/50 backdrop-blur-sm border border-border/50 p-6 md:p-8 rounded-[2.5rem] hover:bg-card/80 transition-all duration-300 group shadow-sm">
      <div className="flex flex-col md:flex-row justify-between items-start mb-8 gap-6">
        <div className="space-y-1">
          <h3 className="text-xl font-bold">Wallet Activity</h3>
        </div>
        <div className="flex gap-8">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#3b82f6]" />
              <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground opacity-70">Packages</p>
            </div>
            <h4 className="text-2xl font-bold tabular-nums">{totalPackages}</h4>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#10b981]" />
              <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground opacity-70">Points</p>
            </div>
            <h4 className="text-2xl font-bold tabular-nums">{totalPoints}</h4>
          </div>
        </div>
      </div>

      <div className="h-64 -mx-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="gradient-package" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gradient-points" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.1} />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
              padding={{ left: 10, right: 10 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
              domain={[0, 'auto']}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "1.5rem",
                padding: "12px 16px",
                fontSize: "14px",
                color: "hsl(var(--foreground))",
                boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
                backdropFilter: "blur(10px)",
              }}
              cursor={{ stroke: 'hsl(var(--border))', strokeWidth: 2 }}
            />
            <Area
              type="monotone"
              dataKey="package"
              name="Packages"
              stroke="#3b82f6"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#gradient-package)"
              dot={{ r: 4, fill: '#3b82f6', stroke: 'hsl(var(--card))', strokeWidth: 2 }}
              activeDot={{ r: 6, fill: '#3b82f6', stroke: 'hsl(var(--card))', strokeWidth: 2 }}
            />
            <Area
              type="monotone"
              dataKey="points"
              name="Points"
              stroke="#10b981"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#gradient-points)"
              dot={{ r: 4, fill: '#10b981', stroke: 'hsl(var(--card))', strokeWidth: 2 }}
              activeDot={{ r: 6, fill: '#10b981', stroke: 'hsl(var(--card))', strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

/** Maps paymentMethod to a tiny pill shown next to the amount */
const CurrencyBadge = ({ method }: { method: UserTransaction["paymentMethod"] }) => {
  if (!method) return null; // legacy rows — no badge
  const config = {
    POINTS: { label: "pts", className: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" },
    PACKAGE: { label: "pkg", className: "bg-blue-500/10 text-blue-600 border-blue-500/20" },
    PROMO_FREE: { label: "promo", className: "bg-purple-500/10 text-purple-600 border-purple-500/20" },
  }[method];
  return (
    <span className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-[9px] font-semibold border uppercase tracking-wider ${config.className}`}>
      {config.label}
    </span>
  );
};

const TransactionItem = ({
  item,
}: {
  item: UserTransaction;
}) => {
  const isPositive = item.changeType === "positive";
  return (
    <div className="group flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl hover:bg-secondary/50 transition-all duration-200 cursor-pointer border border-transparent hover:border-border/50 gap-3 sm:gap-0">
      <div className="flex items-center gap-4">
        <div
          className={`
                    w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center border flex-shrink-0
                    ${isPositive
              ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500"
              : "bg-rose-500/10 border-rose-500/20 text-rose-500"
            }
                `}
        >
          {isPositive ? (
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
              className="text-[10px] h-5 px-1.5 font-normal bg-secondary text-muted-foreground whitespace-nowrap"
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
            className={`font-bold tabular-nums text-sm sm:text-base ${isPositive ? "text-emerald-500" : "text-foreground"
              }`}
          >
            {item.amount}
          </p>
          <CurrencyBadge method={item.paymentMethod} />
        </div>
        <div className="flex items-center gap-2 sm:mt-1">
          <span
            className={`w-2 h-2 rounded-full ${item.status === "Completed" ? "bg-emerald-500" : "bg-yellow-500"
              }`}
          />
          <p className="text-[10px] sm:text-xs text-muted-foreground capitalize">
            {item.status}
          </p>
        </div>
      </div>
    </div>
  );
};


export default function WalletPage() {
  const { data: session, isPending } = authClient.useSession();
  const [filter, setFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const itemsPerPage = 5;

  // Reset to first page when filter or search changes
  useEffect(() => {
    setPage(1);
  }, [filter, searchQuery]);

  const {
    data: walletData,
    isPending: walletIsPending,
    isError: walletIsError,
    error: walletError,
  } = useGetUserWallet();

  // Get transactions from API
  const {
    data: transactionsData,
    isPending: transactionsIsPending,
    isError: transactionsIsError,
  } = useGetUserTransactions();

  // Get transactions array from API response
  const transactions = transactionsData?.transactions || [];

  // Improved filtering logic
  const isSpent = (t: UserTransaction) => {
    return (
      t.changeType === "negative" ||
      t.type?.toLowerCase().includes("spent") ||
      t.amount?.includes("-")
    );
  };

  const getNetValue = (t: UserTransaction, key: 'points' | 'package') => {
    let raw = 0;
    if (t[key] !== null && t[key] !== undefined && t[key] !== 0) {
      raw = Math.abs(t[key] as number);
    } else {
      const amountStr = t.amount?.toLowerCase() || "";
      if (amountStr.includes(key)) {
        const parsed = parseFloat(amountStr.replace(/[^\d.-]/g, ''));
        raw = isNaN(parsed) ? 0 : Math.abs(parsed);
      }
    }
    return isSpent(t) ? -raw : raw;
  };

  // Build cumulative chart data over the last 6 months
  const monthlyNet = [...Array(6)].map((_, i) => {
    const date = new Date();
    date.setMonth(date.getMonth() - (5 - i));
    const month = date.getMonth();
    const year = date.getFullYear();
    const monthLabel = date.toLocaleDateString("en-US", { month: "short" });

    const monthTransactions = transactions.filter(t => {
      const tDate = new Date(t.date);
      if (isNaN(tDate.getTime())) return false;
      return tDate.getMonth() === month && tDate.getFullYear() === year;
    });

    return {
      name: monthLabel,
      package: monthTransactions.reduce((sum, t) => sum + getNetValue(t, 'package'), 0),
      points: monthTransactions.reduce((sum, t) => sum + getNetValue(t, 'points'), 0),
    };
  });

  const sumNetPackages = monthlyNet.reduce((s, m) => s + m.package, 0);
  const sumNetPoints = monthlyNet.reduce((s, m) => s + m.points, 0);

  const startPackages = (walletData?.totalPackages || 0) - sumNetPackages;
  const startPoints = (walletData?.totalPoints || 0) - sumNetPoints;

  let runningPackages = startPackages;
  let runningPoints = startPoints;

  const filteredTransactions = transactions.filter((item: UserTransaction) => {
    const matchesFilter = filter === "All" || item.type.includes(filter);
    const matchesSearch =
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.amount.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const paginatedTransactions = filteredTransactions.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  const combinedChartData = monthlyNet.map(d => {
    runningPackages += d.package;
    runningPoints += d.points;
    return {
      name: d.name,
      package: runningPackages,
      points: runningPoints,
    };
  });

  return (
    <div data-loc="WalletPage" className="min-h-screen w-full relative">
      <main className="container mx-auto px-4 md:px-8 py-6 md:py-10 max-w-7xl">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="space-y-8 md:space-y-12"
        >
          {/* Header Section */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col md:flex-row md:items-center justify-between gap-6"
          >
            <div className="space-y-2">
              <h1 className="text-3xl sm:text-5xl font-bold bg-gradient-to-b from-primary to-primary/40 bg-clip-text text-transparent">
                Wallet
              </h1>
              <p className="text-muted-foreground text-base md:text-lg">
                Manage your points, track transactions, and view your package
                balance in real-time.
              </p>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Card & Quick Stats */}
            <motion.div
              variants={itemVariants}
              className="lg:col-span-5 space-y-6 md:space-y-8"
            >
              <WalletCard
                session={session}
                sessionIsPending={isPending}
                walletData={walletData}
                walletIsPending={walletIsPending}
              />

              <UnifiedActivityChart
                data={combinedChartData}
                totalPackages={walletData?.totalPackages || 0}
                totalPoints={walletData?.totalPoints || 0}
              />

            </motion.div>

            {/* Right Column: Transactions */}
            <motion.div variants={itemVariants} className="lg:col-span-7 space-y-4 h-full">

              <div className="bg-card/30 backdrop-blur-xl border border-border/50 rounded-[2.5rem] p-5 md:p-8 shadow-sm h-full flex flex-col min-h-[600px]">
                <div className="flex-1 flex flex-col">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 md:mb-8 gap-4">
                    <h2 className="text-xl md:text-2xl font-bold">
                      Transactions
                    </h2>
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

                  {/* Tabs/Filter */}
                  <div className="flex gap-2 overflow-x-auto pb-4 mb-2 no-scrollbar px-1">
                    {["All", "Purchase", "Earned", "Spent"].map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setFilter(tab)}
                        className={`
                                                  px-4 md:px-5 py-2 md:py-2.5 rounded-full text-xs md:text-sm font-medium transition-all whitespace-nowrap flex-shrink-0
                                                  ${filter === tab
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
                        {paginatedTransactions.map((transaction: UserTransaction, index: number) => (
                          <motion.div
                            key={transaction.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                          >
                            <TransactionItem item={transaction} />
                          </motion.div>
                        ))}
                      </>
                    )}
                  </div>
                </div>

                {/* Pagination Controls */}
                <div className="mt-8 flex items-center justify-between">
                  <p className="text-xs text-muted-foreground font-medium hidden sm:block">
                    Page <span className="text-foreground">{page}</span> of <span className="text-foreground">{totalPages || 1}</span>
                  </p>
                  <div className="flex gap-2 sm:gap-3 w-full sm:w-auto justify-between sm:justify-end">
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-xl px-3 sm:px-5 hover:bg-secondary transition-all disabled:opacity-30 flex items-center justify-center min-w-[40px] sm:min-w-0"
                      onClick={() => setPage(p => Math.max(1, p - 1))}
                      disabled={page === 1}
                    >
                      <ChevronLeft className="w-4 h-4 sm:mr-1" />
                      <span className="hidden sm:inline">Previous</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-xl px-3 sm:px-5 hover:bg-secondary transition-all disabled:opacity-30 flex items-center justify-center min-w-[40px] sm:min-w-0"
                      onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                      disabled={page >= totalPages}
                    >
                      <span className="hidden sm:inline">Next</span>
                      <ChevronRight className="w-4 h-4 sm:ml-1" />
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
