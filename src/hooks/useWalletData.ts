import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { useGetUserWallet, useGetUserTransactions } from "@/hooks/useUser";
import { UserWallerResponse } from "@/lib/types";
import { UserTransaction } from "@/lib/apiCalls";

export interface ChartDataPoint {
  name: string;
  package: number;
  points: number;
}

export interface WalletDataReturn {
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
  isPending: boolean;
  walletData: UserWallerResponse | undefined;
  walletIsPending: boolean;
  walletIsError: boolean;
  walletError: Error | null;
  transactions: UserTransaction[];
  transactionsIsPending: boolean;
  transactionsIsError: boolean;
  filteredTransactions: UserTransaction[];
  paginatedTransactions: UserTransaction[];
  totalPages: number;
  page: number;
  setPage: (value: number | ((prev: number) => number)) => void;
  filter: string;
  setFilter: (value: string) => void;
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  combinedChartData: ChartDataPoint[];
  isBillingModalOpen: boolean;
  setIsBillingModalOpen: (value: boolean) => void;
}

function isSpent(t: UserTransaction) {
  return (
    t.changeType === "negative" ||
    t.type?.toLowerCase().includes("spent") ||
    t.amount?.includes("-")
  );
}

function getNetValue(t: UserTransaction, key: "points" | "package") {
  let raw = 0;
  if (t[key] !== null && t[key] !== undefined && t[key] !== 0) {
    raw = Math.abs(t[key] as number);
  } else {
    const amountStr = t.amount?.toLowerCase() || "";
    if (amountStr.includes(key)) {
      const parsed = parseFloat(amountStr.replace(/[^\d.-]/g, ""));
      raw = isNaN(parsed) ? 0 : Math.abs(parsed);
    }
  }
  return isSpent(t) ? -raw : raw;
}

export function useWalletData(): WalletDataReturn {
  const { data: session, isPending } = authClient.useSession();
  const [filter, setFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const itemsPerPage = 5;
  const [isBillingModalOpen, setIsBillingModalOpen] = useState(false);

  useEffect(() => {
    setPage(1);
  }, [filter, searchQuery]);

  const {
    data: walletData,
    isPending: walletIsPending,
    isError: walletIsError,
    error: walletError,
  } = useGetUserWallet();

  const {
    data: transactionsData,
    isPending: transactionsIsPending,
    isError: transactionsIsError,
  } = useGetUserTransactions();

  const transactions = transactionsData?.transactions || [];

  const monthlyNet: ChartDataPoint[] = [...Array(6)].map((_, i) => {
    const date = new Date();
    date.setMonth(date.getMonth() - (5 - i));
    const month = date.getMonth();
    const year = date.getFullYear();
    const monthLabel = date.toLocaleDateString("en-US", { month: "short" });

    const monthTransactions = transactions.filter((t) => {
      const tDate = new Date(t.date);
      if (isNaN(tDate.getTime())) return false;
      return tDate.getMonth() === month && tDate.getFullYear() === year;
    });

    return {
      name: monthLabel,
      package: monthTransactions.reduce(
        (sum, t) => sum + getNetValue(t, "package"),
        0
      ),
      points: monthTransactions.reduce(
        (sum, t) => sum + getNetValue(t, "points"),
        0
      ),
    };
  });

  const sumNetPackages = monthlyNet.reduce((s, m) => s + m.package, 0);
  const sumNetPoints = monthlyNet.reduce((s, m) => s + m.points, 0);

  const startPackages = (walletData?.totalPackages || 0) - sumNetPackages;
  const startPoints = (walletData?.totalPoints || 0) - sumNetPoints;

  let runningPackages = startPackages;
  let runningPoints = startPoints;

  const combinedChartData = monthlyNet.map((d) => {
    runningPackages += d.package;
    runningPoints += d.points;
    return {
      name: d.name,
      package: runningPackages,
      points: runningPoints,
    };
  });

  const filteredTransactions = transactions.filter(
    (item: UserTransaction) => {
      const matchesFilter =
        filter === "All" || item.type.includes(filter);
      const matchesSearch =
        item.description
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        item.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.amount.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesFilter && matchesSearch;
    }
  );

  const totalPages = Math.ceil(
    filteredTransactions.length / itemsPerPage
  );
  const paginatedTransactions = filteredTransactions.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  return {
    session,
    isPending,
    walletData,
    walletIsPending,
    walletIsError,
    walletError,
    transactions,
    transactionsIsPending,
    transactionsIsError,
    filteredTransactions,
    paginatedTransactions,
    totalPages,
    page,
    setPage,
    filter,
    setFilter,
    searchQuery,
    setSearchQuery,
    combinedChartData,
    isBillingModalOpen,
    setIsBillingModalOpen,
  };
}
