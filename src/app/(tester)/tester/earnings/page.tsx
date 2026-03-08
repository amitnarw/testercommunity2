"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Download,
  Banknote,
  IndianRupee,
  Landmark,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { AppPagination } from "@/components/app-pagination";
import { useQuery } from "@tanstack/react-query";
import { getTesterEarnings, getTesterEarningHistory } from "@/lib/apiCalls";
import type { TesterEarningHistoryItem } from "@/lib/types";

const PAYOUTS_PER_PAGE = 10;

function formatINR(amount: number) {
  return `₹${amount.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
}

function getStatusBadge(status: TesterEarningHistoryItem["status"]) {
  if (status === "CREDIT") {
    return (
      <Badge
        className="bg-green-500/20 text-green-700 dark:bg-green-500/10 dark:text-green-400"
        variant="secondary"
      >
        Credited
      </Badge>
    );
  }
  if (status === "DEBIT") {
    return (
      <Badge
        className="bg-red-500/20 text-red-700 dark:bg-red-500/10 dark:text-red-400"
        variant="secondary"
      >
        Debited
      </Badge>
    );
  }
  return (
    <Badge
      className="bg-yellow-500/20 text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-400"
      variant="secondary"
    >
      On Hold
    </Badge>
  );
}

export default function ProfessionalEarningsPage() {
  const [currentPage, setCurrentPage] = useState(1);

  const {
    data: earnings,
    isLoading: earningsLoading,
    isError: earningsError,
  } = useQuery({
    queryKey: ["testerEarnings"],
    queryFn: getTesterEarnings,
  });

  const {
    data: historyData,
    isLoading: historyLoading,
    isError: historyError,
  } = useQuery({
    queryKey: ["testerEarningHistory", currentPage],
    queryFn: () => getTesterEarningHistory(currentPage, PAYOUTS_PER_PAGE),
  });

  const totalPages = historyData?.pagination?.totalPages ?? 1;

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const handleDownloadStatement = () => {
    const history = historyData?.history ?? [];
    const headers = [
      "Transaction ID",
      "Date",
      "Project",
      "Amount (INR)",
      "Status",
      "Action",
    ];
    const csvContent = [
      headers.join(","),
      ...history.map(
        (item) =>
          `${item.id},${formatDate(item.date)},"${item.project}",${item.amount},${item.status},${item.action ?? ""}`,
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "earnings-statement.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex-1 space-y-8 container mx-auto px-4 md:px-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-br from-primary to-primary/40 bg-clip-text text-transparent leading-[unset]">
            Earnings
          </h2>
          <p className="text-sm sm:text-md text-muted-foreground">
            Track your INR earnings and payout history.
          </p>
        </div>
        <Button
          onClick={handleDownloadStatement}
          disabled={historyLoading || !historyData?.history?.length}
        >
          <Download className="mr-2 h-4 w-4" /> Download Statement
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Available Balance */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Available for Withdrawal
            </CardTitle>
            <Banknote className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {earningsLoading ? (
              <Skeleton className="h-8 w-28" />
            ) : earningsError ? (
              <div className="flex items-center gap-2 text-destructive text-sm">
                <AlertCircle className="h-4 w-4" /> Failed to load
              </div>
            ) : (
              <div className="text-2xl font-bold">
                {formatINR(earnings?.availableBalance ?? 0)}
              </div>
            )}
            <p className="text-xs text-muted-foreground mt-1">
              Ready for instant payout.
            </p>
            <Button size="sm" className="mt-4 w-full" asChild>
              <Link href="/tester/earnings/withdraw">
                <Landmark className="mr-2 h-4 w-4" /> Withdraw Funds
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* Pending Balance */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Verification
            </CardTitle>
            <Banknote className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {earningsLoading ? (
              <Skeleton className="h-8 w-28" />
            ) : earningsError ? (
              <div className="flex items-center gap-2 text-destructive text-sm">
                <AlertCircle className="h-4 w-4" /> Failed to load
              </div>
            ) : (
              <div className="text-2xl font-bold">
                {formatINR(earnings?.pendingBalance ?? 0)}
              </div>
            )}
            <p className="text-xs text-muted-foreground mt-1">
              From{" "}
              {earningsLoading ? "…" : (earnings?.pendingProjectsCount ?? 0)}{" "}
              ongoing{" "}
              {(earnings?.pendingProjectsCount ?? 0) === 1
                ? "project"
                : "projects"}
              .
            </p>
          </CardContent>
        </Card>

        {/* Lifetime Earnings */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Lifetime Earnings
            </CardTitle>
            <IndianRupee className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {earningsLoading ? (
              <Skeleton className="h-8 w-28" />
            ) : earningsError ? (
              <div className="flex items-center gap-2 text-destructive text-sm">
                <AlertCircle className="h-4 w-4" /> Failed to load
              </div>
            ) : (
              <div className="text-2xl font-bold">
                {formatINR(earnings?.lifetimeEarnings ?? 0)}
              </div>
            )}
            <p className="text-xs text-muted-foreground mt-1">
              Total amount paid out.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Payout History */}
      <div>
        <CardHeader className="p-2 sm:p-6">
          <CardTitle className="text-xl sm:text-2xl">Payout History</CardTitle>
          <CardDescription className="text-sm sm:text-md">
            A record of all your completed payments.
          </CardDescription>
        </CardHeader>
        <Card>
          <CardContent className="grid grid-cols-1 p-2 sm:p-6">
            {historyError ? (
              <div className="flex flex-col items-center justify-center py-12 gap-2 text-muted-foreground">
                <AlertCircle className="h-8 w-8 text-destructive" />
                <p className="text-sm">
                  Failed to load payout history. Please try again.
                </p>
              </div>
            ) : (
              <>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Payout ID</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Project</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {historyLoading ? (
                      Array.from({ length: 5 }).map((_, i) => (
                        <TableRow key={i}>
                          <TableCell>
                            <Skeleton className="h-4 w-16" />
                          </TableCell>
                          <TableCell>
                            <Skeleton className="h-4 w-24" />
                          </TableCell>
                          <TableCell>
                            <Skeleton className="h-4 w-32" />
                          </TableCell>
                          <TableCell>
                            <Skeleton className="h-4 w-16" />
                          </TableCell>
                          <TableCell className="text-right">
                            <Skeleton className="h-4 w-16 ml-auto" />
                          </TableCell>
                        </TableRow>
                      ))
                    ) : !historyData?.history?.length ? (
                      <TableRow>
                        <TableCell
                          colSpan={5}
                          className="text-center py-12 text-muted-foreground"
                        >
                          No payout history yet. Complete testing projects to
                          earn money.
                        </TableCell>
                      </TableRow>
                    ) : (
                      historyData.history.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium text-xs text-muted-foreground">
                            #{item.id}
                          </TableCell>
                          <TableCell>{formatDate(item.date)}</TableCell>
                          <TableCell>{item.project}</TableCell>
                          <TableCell>{getStatusBadge(item.status)}</TableCell>
                          <TableCell className="text-right font-medium">
                            {formatINR(item.amount)}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>

                {!historyLoading &&
                  (historyData?.pagination?.totalPages ?? 0) > 1 && (
                    <AppPagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={handlePageChange}
                    />
                  )}
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
