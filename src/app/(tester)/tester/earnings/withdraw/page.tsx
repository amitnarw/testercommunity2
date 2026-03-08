"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  Banknote,
  Landmark,
  IndianRupee,
  AlertCircle,
  Clock,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BackButton } from "@/components/back-button";
import { AppPagination } from "@/components/app-pagination";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getTesterEarnings,
  requestWithdrawal,
  getWithdrawalHistory,
} from "@/lib/apiCalls";
import type { WithdrawalHistoryItem } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";

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

function WithdrawalStatusBadge({
  status,
}: {
  status: WithdrawalHistoryItem["status"];
}) {
  switch (status) {
    case "PENDING":
      return (
        <Badge
          className="bg-yellow-500/20 text-yellow-700 dark:text-yellow-400"
          variant="secondary"
        >
          <Clock className="mr-1 h-3 w-3" />
          Pending
        </Badge>
      );
    case "APPROVED":
      return (
        <Badge
          className="bg-blue-500/20 text-blue-700 dark:text-blue-400"
          variant="secondary"
        >
          <CheckCircle2 className="mr-1 h-3 w-3" />
          Approved
        </Badge>
      );
    case "PAID":
      return (
        <Badge
          className="bg-green-500/20 text-green-700 dark:text-green-400"
          variant="secondary"
        >
          <CheckCircle2 className="mr-1 h-3 w-3" />
          Paid
        </Badge>
      );
    case "REJECTED":
      return (
        <Badge
          className="bg-red-500/20 text-red-700 dark:text-red-400"
          variant="secondary"
        >
          <XCircle className="mr-1 h-3 w-3" />
          Rejected
        </Badge>
      );
  }
}

const HISTORY_PER_PAGE = 10;

export default function WithdrawFundsPage() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [historyPage, setHistoryPage] = useState(1);

  // Form state
  const [accountHolder, setAccountHolder] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [ifsc, setIfsc] = useState("");
  const [bankAmount, setBankAmount] = useState("");
  const [upiId, setUpiId] = useState("");
  const [upiName, setUpiName] = useState("");
  const [upiAmount, setUpiAmount] = useState("");

  const { data: earnings, isLoading: earningsLoading } = useQuery({
    queryKey: ["testerEarnings"],
    queryFn: getTesterEarnings,
  });

  const { data: historyData, isLoading: historyLoading } = useQuery({
    queryKey: ["withdrawalHistory", historyPage],
    queryFn: () => getWithdrawalHistory(historyPage, HISTORY_PER_PAGE),
  });

  const totalPages = historyData?.pagination?.totalPages ?? 1;

  const mutation = useMutation({
    mutationFn: requestWithdrawal,
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Withdrawal request submitted successfully!",
      });
      queryClient.invalidateQueries({ queryKey: ["withdrawalHistory"] });
      queryClient.invalidateQueries({ queryKey: ["testerEarnings"] });
      setBankAmount("");
      setAccountHolder("");
      setAccountNumber("");
      setIfsc("");
      setUpiAmount("");
      setUpiId("");
      setUpiName("");
    },
    onError: (err: Error) => {
      toast({
        title: "Error",
        description: err.message || "Failed to submit withdrawal request",
        variant: "destructive",
      });
    },
  });

  const handleBankSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bankAmount || Number(bankAmount) <= 0) {
      toast({
        title: "Error",
        description: "Please enter a valid amount",
        variant: "destructive",
      });
      return;
    }
    mutation.mutate({
      amount: Number(bankAmount),
      note: `Bank: ${accountNumber}, IFSC: ${ifsc}, Name: ${accountHolder}`,
    });
  };

  const handleUpiSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!upiAmount || Number(upiAmount) <= 0) {
      toast({
        title: "Error",
        description: "Please enter a valid amount",
        variant: "destructive",
      });
      return;
    }
    mutation.mutate({
      amount: Number(upiAmount),
      note: `UPI: ${upiId}, Name: ${upiName}`,
    });
  };

  return (
    <div className="flex-1 space-y-8 container mx-auto px-4 md:px-6">
      <div className="sticky top-0 z-[50] pt-2 sm:pt-3 pb-4 w-1/2">
        <BackButton href="/tester/earnings" />
      </div>
      <div className="flex items-center gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-br from-primary to-primary/40 bg-clip-text text-transparent leading-[unset]">
            Withdraw Funds
          </h2>
          <p className="text-sm sm:text-md text-muted-foreground">
            Transfer your available earnings to your account.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Withdrawal Form */}
        <div className="md:col-span-2">
          <Card>
            <Tabs defaultValue="bank" className="w-full">
              <CardHeader>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="bank">
                    <Landmark className="mr-2 h-4 w-4" /> Bank Transfer
                  </TabsTrigger>
                  <TabsTrigger value="upi">
                    <IndianRupee className="mr-2 h-4 w-4" /> UPI
                  </TabsTrigger>
                </TabsList>
              </CardHeader>
              <CardContent>
                <TabsContent value="bank">
                  <form onSubmit={handleBankSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="account-holder">
                        Account Holder Name
                      </Label>
                      <Input
                        id="account-holder"
                        placeholder="Enter name as per bank records"
                        value={accountHolder}
                        onChange={(e) => setAccountHolder(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="account-number">Account Number</Label>
                      <Input
                        id="account-number"
                        placeholder="Enter your bank account number"
                        value={accountNumber}
                        onChange={(e) => setAccountNumber(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="ifsc">IFSC Code</Label>
                      <Input
                        id="ifsc"
                        placeholder="Enter your bank's IFSC code"
                        value={ifsc}
                        onChange={(e) => setIfsc(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="amount-bank">
                        Amount (INR)
                        {earnings && (
                          <span className="text-xs text-muted-foreground ml-2">
                            Max: {formatINR(earnings.availableBalance)}
                          </span>
                        )}
                      </Label>
                      <Input
                        id="amount-bank"
                        type="number"
                        step="0.01"
                        min="1"
                        max={earnings?.availableBalance}
                        placeholder="Enter amount in ₹"
                        value={bankAmount}
                        onChange={(e) => setBankAmount(e.target.value)}
                        required
                      />
                    </div>
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={
                        mutation.isPending ||
                        earningsLoading ||
                        (earnings?.availableBalance ?? 0) <= 0
                      }
                    >
                      {mutation.isPending
                        ? "Submitting…"
                        : "Initiate Bank Transfer"}
                    </Button>
                    {(earnings?.availableBalance ?? 0) <= 0 &&
                      !earningsLoading && (
                        <p className="text-xs text-muted-foreground text-center">
                          No balance available for withdrawal.
                        </p>
                      )}
                  </form>
                </TabsContent>
                <TabsContent value="upi">
                  <form onSubmit={handleUpiSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="upi-id">UPI ID</Label>
                      <Input
                        id="upi-id"
                        placeholder="yourname@bank"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="upi-name">Beneficiary Name</Label>
                      <Input
                        id="upi-name"
                        placeholder="Enter name for verification"
                        value={upiName}
                        onChange={(e) => setUpiName(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="amount-upi">
                        Amount (INR)
                        {earnings && (
                          <span className="text-xs text-muted-foreground ml-2">
                            Max: {formatINR(earnings.availableBalance)}
                          </span>
                        )}
                      </Label>
                      <Input
                        id="amount-upi"
                        type="number"
                        step="0.01"
                        min="1"
                        max={earnings?.availableBalance}
                        placeholder="Enter amount in ₹"
                        value={upiAmount}
                        onChange={(e) => setUpiAmount(e.target.value)}
                        required
                      />
                    </div>
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={
                        mutation.isPending ||
                        earningsLoading ||
                        (earnings?.availableBalance ?? 0) <= 0
                      }
                    >
                      {mutation.isPending ? "Submitting…" : "Transfer via UPI"}
                    </Button>
                    {(earnings?.availableBalance ?? 0) <= 0 &&
                      !earningsLoading && (
                        <p className="text-xs text-muted-foreground text-center">
                          No balance available for withdrawal.
                        </p>
                      )}
                  </form>
                </TabsContent>
              </CardContent>
            </Tabs>
          </Card>
        </div>

        {/* Sidebar info */}
        <div className="space-y-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Available Balance
              </CardTitle>
              <Banknote className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {earningsLoading ? (
                <Skeleton className="h-10 w-32" />
              ) : (
                <div className="text-4xl font-bold">
                  {formatINR(earnings?.availableBalance ?? 0)}
                </div>
              )}
              <p className="text-xs text-muted-foreground mt-1">
                Ready for payout.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Payout Information</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-3">
              <p>Payouts are processed within 24–48 hours of request.</p>
              <p>
                A standard processing fee of 2.5% may be applied to each
                withdrawal.
              </p>
              <p>
                Ensure your details are correct to avoid delays. inTesters is
                not responsible for transfers to incorrect accounts.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Withdrawal History */}
      <div>
        <CardHeader className="p-2 sm:p-6">
          <CardTitle className="text-xl sm:text-2xl">
            Withdrawal History
          </CardTitle>
          <CardDescription>
            Track the status of all your past withdrawal requests.
          </CardDescription>
        </CardHeader>
        <Card>
          <CardContent className="grid grid-cols-1 p-2 sm:p-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Request ID</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Note</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Processed On</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {historyLoading ? (
                  Array.from({ length: 4 }).map((_, i) => (
                    <TableRow key={i}>
                      {Array.from({ length: 6 }).map((_, j) => (
                        <TableCell key={j}>
                          <Skeleton className="h-4 w-20" />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : !historyData?.withdrawals?.length ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="text-center py-10 text-muted-foreground"
                    >
                      No withdrawal requests yet.
                    </TableCell>
                  </TableRow>
                ) : (
                  historyData.withdrawals.map((w) => (
                    <TableRow key={w.id}>
                      <TableCell className="text-xs text-muted-foreground font-medium">
                        #{w.id}
                      </TableCell>
                      <TableCell>{formatDate(w.requestedAt)}</TableCell>
                      <TableCell className="font-semibold">
                        {formatINR(w.amount)}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground max-w-[180px] truncate">
                        {w.note ?? "—"}
                      </TableCell>
                      <TableCell>
                        <WithdrawalStatusBadge status={w.status} />
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {w.processedAt ? formatDate(w.processedAt) : "—"}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
            {!historyLoading && totalPages > 1 && (
              <AppPagination
                currentPage={historyPage}
                totalPages={totalPages}
                onPageChange={setHistoryPage}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
