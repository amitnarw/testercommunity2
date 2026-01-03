"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  ArrowDownLeft,
  Plus,
  Send,
  MoreHorizontal,
  Wallet,
  TrendingUp,
  Package,
  Clock,
  Search,
  Filter,
  Download,
} from "lucide-react";
import { transactionHistory } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TransitionLink } from "@/components/transition-link";
import { authClient } from "@/lib/auth-client";
import { useGetUserWallet } from "@/hooks/useUser";
import { UserWallerResponse } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";

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
        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-white/20 flex items-center justify-center bg-white/5 backdrop-blur-md">
          <Wallet className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
        </div>
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
    className={`flex flex-col items-center gap-2 sm:gap-3 group transition-all duration-300 w-full ${
      primary ? "hover:-translate-y-1" : ""
    }`}
  >
    <div
      className={`
            w-12 h-12 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-lg
            ${
              primary
                ? "bg-gradient-to-br from-primary to-blue-600 text-white shadow-primary/25 group-hover:shadow-primary/40"
                : "bg-card border border-border text-foreground hover:bg-accent hover:border-accent shadow-sm"
            }
        `}
    >
      <Icon
        className={`w-5 h-5 sm:w-6 sm:h-6 ${
          primary ? "" : "text-foreground/70"
        }`}
      />
    </div>
    <span className="text-xs sm:text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
      {label}
    </span>
  </TransitionLink>
);

const StatCard = ({
  title,
  value,
  sub,
  icon: Icon,
  colorClass,
}: {
  title: string;
  value: string;
  sub: string;
  icon: any;
  colorClass: string;
}) => (
  <div className="bg-card/50 backdrop-blur-sm border border-border/50 p-5 sm:p-6 rounded-3xl hover:bg-card/80 transition-colors duration-300">
    <div className="flex items-start justify-between mb-4">
      <div className={`p-3 rounded-2xl ${colorClass} bg-opacity-10`}>
        <Icon className={`w-5 h-5 ${colorClass.replace("bg-", "text-")}`} />
      </div>
    </div>
    <div className="space-y-1">
      <p className="text-muted-foreground text-sm font-medium">{title}</p>
      <h3 className="text-2xl font-bold">{value}</h3>
      <p className="text-xs text-muted-foreground/60">{sub}</p>
    </div>
  </div>
);

const TransactionItem = ({
  item,
}: {
  item: (typeof transactionHistory)[0];
}) => {
  const isPositive = item.changeType === "positive";
  return (
    <div className="group flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl hover:bg-secondary/50 transition-all duration-200 cursor-pointer border border-transparent hover:border-border/50 gap-3 sm:gap-0">
      <div className="flex items-center gap-4">
        <div
          className={`
                    w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center border flex-shrink-0
                    ${
                      isPositive
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
        <p
          className={`font-bold tabular-nums text-sm sm:text-base ${
            isPositive ? "text-emerald-500" : "text-foreground"
          }`}
        >
          {isPositive ? "+" : ""}
          {item.amount}
        </p>
        <div className="flex items-center gap-2 sm:mt-1">
          <span
            className={`w-2 h-2 rounded-full ${
              item.status === "Completed" ? "bg-emerald-500" : "bg-yellow-500"
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

  const {
    data: walletData,
    isPending: walletIsPending,
    isError: walletIsError,
    error: walletError,
  } = useGetUserWallet();

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
              <p className="text-muted-foreground text-base md:text-lg max-w-lg">
                Manage your points, track transactions, and view your package
                balance in real-time.
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="rounded-full h-10 md:h-12 px-4 md:px-6 gap-2 text-sm md:text-base"
              >
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">Export</span>
              </Button>
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

              <div className="flex justify-between gap-4">
                <ActionButton
                  icon={Plus}
                  label="Top Up"
                  primary
                  href="/billing"
                />
                <ActionButton
                  icon={Send}
                  label="Transfer"
                  href="/wallet/transfer"
                />
                <ActionButton
                  icon={MoreHorizontal}
                  label="More"
                  href="/wallet/more"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <StatCard
                  title="Total Packages Spent"
                  value="3"
                  sub="Last 30 days"
                  icon={Package}
                  colorClass="bg-blue-500"
                />
                <StatCard
                  title="Total Points Spent"
                  value="1,450"
                  sub="Last 30 days"
                  icon={Clock}
                  colorClass="bg-orange-500"
                />
              </div>

              {/* Promo / Upgrade Card - Aligned with Primary Brand */}
              <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary to-blue-700 p-6 text-primary-foreground shadow-xl group">
                <TransitionLink href="/billing">
                  <div className="relative z-10 space-y-4">
                    <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-md">
                      <TrendingUp className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">
                        Upgrade to get more packages.
                      </h3>
                      <p className="text-primary-foreground/80 text-sm mt-1">
                        Unlock more packages by upgrading to a higher plan.
                      </p>
                    </div>
                    <p className="text-white p-0 h-auto font-semibold group-hover:text-white/80 duration-300">
                      View Plans &rarr;
                    </p>
                  </div>
                  {/* Decorative Circles */}
                  <div className="absolute top-[-20%] right-[-20%] w-40 h-40 bg-white/10 rounded-full blur-2xl" />
                  <div className="absolute bottom-[-10%] left-[-10%] w-32 h-32 bg-black/10 rounded-full blur-xl" />
                </TransitionLink>
              </div>
            </motion.div>

            {/* Right Column: Transactions */}
            <motion.div variants={itemVariants} className="lg:col-span-7">
              <div className="bg-card/30 backdrop-blur-xl border border-border/50 rounded-[2.5rem] p-5 md:p-8 shadow-sm h-full min-h-[500px] md:min-h-[600px]">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 md:mb-8 gap-4">
                  <h2 className="text-xl md:text-2xl font-bold">
                    Transactions
                  </h2>
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <div className="relative w-full sm:w-auto">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <input
                        type="text"
                        placeholder="Search..."
                        className="h-10 pl-9 pr-4 rounded-full bg-secondary/50 border-none text-sm w-full sm:w-48 focus:ring-2 focus:ring-primary/20 outline-none transition-all hover:bg-secondary"
                      />
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-full w-10 h-10 hover:bg-secondary flex-shrink-0"
                    >
                      <Filter className="w-5 h-5 text-muted-foreground" />
                    </Button>
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

                <div className="space-y-2 mt-2 md:mt-4">
                  {transactionHistory
                    .filter(
                      (item) => filter === "All" || item.type.includes(filter)
                    )
                    .map((transaction, index) => (
                      <motion.div
                        key={transaction.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <TransactionItem item={transaction} />
                      </motion.div>
                    ))}

                  {transactionHistory.length === 0 && (
                    <div className="text-center py-20 text-muted-foreground">
                      No transactions found.
                    </div>
                  )}
                </div>

                <div className="mt-8 text-center">
                  <Button
                    variant="outline"
                    className="rounded-full px-8 w-full sm:w-auto"
                  >
                    View All History
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
