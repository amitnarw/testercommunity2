"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { HubSubmittedAppResponse } from "@/lib/types";
import {
  Smartphone,
  MoreHorizontal,
  User,
  UserMinus,
  Loader2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState } from "react";
import { unassignTesterFromApp } from "@/lib/apiCalls";
import { useToast } from "@/hooks/use-toast";
import { AdminVerificationReview } from "./admin-verification-review";
import { Eye, CheckCircle2, History } from "lucide-react";

export interface AdminAssignedTestersTableProps {
  testerRelations: HubSubmittedAppResponse["testerRelations"];
  appId: number;
  totalDays: number;
  appType: "PAID" | "FREE";
  onRefetch: () => void;
}

export function AdminAssignedTestersTable({
  testerRelations,
  appId,
  totalDays,
  appType,
  onRefetch,
}: AdminAssignedTestersTableProps) {
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [reviewTesterId, setReviewTesterId] = useState<string | null>(null);
  const { toast } = useToast();

  const handleRemoveTester = async (testerId: string) => {
    if (
      !window.confirm(
        "Are you sure you want to remove this tester from the app?",
      )
    )
      return;

    setRemovingId(testerId);
    try {
      await unassignTesterFromApp({
        id: appId.toString(),
        testerId: testerId,
      });
      toast({
        title: "Success",
        description: "Tester removed successfully",
      });
      onRefetch();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to remove tester",
      });
    } finally {
      setRemovingId(null);
    }
  };

  // We only want to show testers who are actually assigned and testing
  const activeTesters = testerRelations?.filter(
    (r) => r.status && r.status !== "PENDING" && r.status !== "REJECTED",
  );

  return (
    <section className="space-y-6 bg-card rounded-2xl p-3 sm:p-6 pt-2 sm:pt-8 w-full mt-10 shadow-sm">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 relative">
        <div className="space-y-1">
          <h2 className="text-xl sm:text-2xl font-bold">
            {appType === "PAID" ? "Managed Testers" : "Independent Testers"}
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground max-w-2xl">
            {appType === "PAID"
              ? "These testers are manually assigned by the platform admin. You control exactly who participates in this project."
              : "In free testing, testers join independently. The app owner reviews each request and decides whom to approve or reject."}
          </p>
        </div>
        <div className="absolute top-0 right-0">
          <Badge
            variant="secondary"
            className="w-7 h-7 sm:w-auto sm:h-auto text-xs sm:text-sm rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors gap-1"
          >
            <span>{activeTesters?.length || 0}</span>
            <span className="hidden sm:block">
              {appType === "PAID" ? "Assigned" : "Active"}
            </span>
          </Badge>
        </div>
      </div>

      <div className="rounded-xl border bg-card shadow-sm overflow-hidden hidden md:grid md:grid-cols-1">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="w-[300px]">Tester</TableHead>
              <TableHead>Experience</TableHead>
              <TableHead>Device</TableHead>
              {appType === "FREE" && <TableHead>Verifications</TableHead>}
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <AnimatePresence>
              {activeTesters?.map((req) => (
                <motion.tr
                  key={req.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="group border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                >
                  <TableCell className="py-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10 border border-border">
                        <AvatarImage src={req.tester?.image || ""} />
                        <AvatarFallback className="bg-primary/10 text-primary font-medium">
                          {req.tester?.name?.charAt(0) || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="font-semibold text-sm">
                          {req.tester?.name || "Unknown"}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {req.tester?.email}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <span>
                        {req?.tester?.userDetail?.experience_level || "N/A"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className="font-normal text-xs gap-1"
                      >
                        <Smartphone className="w-3 h-3 opacity-70" />
                        {req?.tester?.userDetail?.device_company ||
                        req?.tester?.userDetail?.device_model
                          ? req?.tester?.userDetail?.device_company +
                            " " +
                            req?.tester?.userDetail?.device_model
                          : "N/A"}
                      </Badge>
                    </div>
                  </TableCell>
                  {appType === "FREE" && (
                    <TableCell>
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold">
                            {req.daysCompleted || 0}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            / {totalDays} Days
                          </span>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-7 text-[10px] gap-1.5 px-2 bg-secondary/50 hover:bg-secondary"
                          onClick={() => setReviewTesterId(req.testerId)}
                        >
                          <History className="w-3 h-3" /> Review
                        </Button>
                      </div>
                    </TableCell>
                  )}
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className="font-medium text-xs bg-green-500/10 text-green-600 border-green-200 dark:border-green-900"
                    >
                      {req.status === "IN_PROGRESS" ? "Active" : req.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          {removingId === req.testerId ? (
                            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                          ) : (
                            <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                          )}
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-[160px]">
                        <DropdownMenuItem asChild>
                          <Link
                            href={`/admin/users/${req.testerId}`}
                            className="cursor-pointer flex items-center"
                          >
                            <User className="mr-2 h-4 w-4" />
                            <span>View Details</span>
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-red-500 focus:text-red-500 focus:bg-red-50 dark:focus:bg-red-500/10 cursor-pointer flex items-center"
                          onClick={() => handleRemoveTester(req.testerId)}
                          disabled={removingId === req.testerId}
                        >
                          <UserMinus className="mr-2 h-4 w-4" />
                          <span>Remove Tester</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </motion.tr>
              ))}
            </AnimatePresence>
          </TableBody>
        </Table>
        {(!activeTesters || activeTesters.length === 0) && (
          <div className="p-8 text-center text-muted-foreground">
            No testers assigned yet.
          </div>
        )}
      </div>

      {/* Mobile Layout (Cards) */}
      <div className="md:hidden space-y-4">
        <AnimatePresence>
          {activeTesters?.map((req) => (
            <motion.div
              key={req.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="bg-card border border-border rounded-xl p-4 shadow-lg shadow-primary/20 flex flex-col gap-4"
            >
              <div className="flex items-start justify-between relative">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10 border border-border">
                    <AvatarImage src={req.tester?.image || ""} />
                    <AvatarFallback className="bg-primary/10 text-primary font-medium">
                      {req.tester?.name?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="font-semibold text-sm">
                      {req.tester?.name || "Unknown"}
                    </span>
                    <span className="text-xs text-muted-foreground flex items-center gap-2">
                      {req.tester?.email}
                      <Badge
                        variant="secondary"
                        className="font-medium text-[8px] bg-green-500/10 text-green-600 border-green-200 dark:border-green-900 h-4 px-1 p-0 leading-none"
                      >
                        {req.status === "IN_PROGRESS" ? "Active" : req.status}
                      </Badge>
                    </span>
                  </div>
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 absolute -top-2 -right-2 bg-background border border-border shadow-sm rounded-full opacity-80 hover:opacity-100 dark:bg-card"
                    >
                      <span className="sr-only">Open menu</span>
                      {removingId === req.testerId ? (
                        <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />
                      ) : (
                        <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-[160px]">
                    <DropdownMenuItem asChild>
                      <Link
                        href={`/admin/users/${req.testerId}`}
                        className="cursor-pointer flex items-center"
                      >
                        <User className="mr-2 h-4 w-4" />
                        <span>View Details</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-red-500 focus:text-red-500 focus:bg-red-50 dark:focus:bg-red-500/10 cursor-pointer flex items-center"
                      onClick={() => handleRemoveTester(req.testerId)}
                      disabled={removingId === req.testerId}
                    >
                      <UserMinus className="mr-2 h-4 w-4" />
                      <span>Remove Tester</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="flex flex-col gap-3 bg-muted/30 p-4 rounded-xl border border-border/50">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase opacity-70">
                      Experience
                    </span>
                    <span className="text-xs font-semibold">
                      {req?.tester?.userDetail?.experience_level || "N/A"}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase opacity-70">
                      Device
                    </span>
                    <div className="flex items-center gap-1.5 overflow-hidden">
                      <Smartphone className="w-3.5 h-3.5 opacity-70 shrink-0" />
                      <span className="text-xs font-semibold truncate">
                        {req?.tester?.userDetail?.device_company ||
                        req?.tester?.userDetail?.device_model
                          ? req?.tester?.userDetail?.device_company +
                            " " +
                            req?.tester?.userDetail?.device_model
                          : "N/A"}
                      </span>
                    </div>
                  </div>
                </div>

                {appType === "FREE" && (
                  <div className="pt-2 border-t border-border/40 flex items-center justify-between gap-4 mt-1">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-bold text-muted-foreground uppercase opacity-70">
                        Progress
                      </span>
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm font-black text-primary">
                          {req.daysCompleted || 0}
                        </span>
                        <span className="text-[10px] text-muted-foreground font-bold">
                          / {totalDays} DAYS
                        </span>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-9 px-4 rounded-xl bg-background border-primary/20 text-primary hover:bg-primary/5 hover:border-primary font-bold shadow-sm flex-1 max-w-[140px]"
                      onClick={() => setReviewTesterId(req.testerId)}
                    >
                      <History className="w-3.5 h-3.5 mr-2" />
                      Review
                    </Button>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {(!activeTesters || activeTesters.length === 0) && (
          <div className="p-8 text-center text-muted-foreground border-2 border-dashed rounded-xl">
            {appType === "PAID"
              ? "No testers assigned yet. Use the 'Manage Testers' button to assign community members."
              : "No testers have joined this project yet."}
          </div>
        )}
      </div>

      <div className="bg-primary/5 p-4 rounded-xl border border-primary/10">
        <p className="text-xs text-muted-foreground leading-relaxed">
          <strong className="text-primary mr-1">Admin Note:</strong>
          {appType === "PAID"
            ? "In Paid Testing, the platform is responsible for providing testers. Once you approve the app, manually assign the requested number of testers to begin."
            : "In Free Testing, the app owner manages their own community. Testers apply directly to the app, and the owner is notified to approve/reject them. You are only overseeing the process."}
        </p>
      </div>

      <AdminVerificationReview
        isOpen={!!reviewTesterId}
        onClose={() => setReviewTesterId(null)}
        testerName={
          activeTesters?.find((r) => r.testerId === reviewTesterId)?.tester
            ?.name || "Tester"
        }
        verifications={
          (activeTesters?.find((r) => r.testerId === reviewTesterId)
            ?.dailyVerifications as any) || []
        }
        onSuccess={onRefetch}
      />
    </section>
  );
}
