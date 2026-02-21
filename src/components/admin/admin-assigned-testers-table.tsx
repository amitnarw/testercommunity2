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
import { Smartphone } from "lucide-react";

export interface AdminAssignedTestersTableProps {
  testerRelations: HubSubmittedAppResponse["testerRelations"];
}

export function AdminAssignedTestersTable({
  testerRelations,
}: AdminAssignedTestersTableProps) {
  // We only want to show testers who are actually assigned and testing
  const activeTesters = testerRelations?.filter(
    (r) => r.status && r.status !== "PENDING" && r.status !== "REJECTED",
  );

  return (
    <section className="space-y-6 bg-card/50 rounded-2xl p-3 sm:p-6 pt-2 sm:pt-8 w-full mt-10 shadow-lg">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 relative">
        <div className="space-y-1">
          <h2 className="text-xl sm:text-2xl font-bold">Assigned Testers</h2>
          <p className="text-sm sm:text-base text-muted-foreground">
            View the testers currently assigned to test this application.
          </p>
        </div>
        <div className="absolute top-0 right-0">
          <Badge
            variant="secondary"
            className="w-7 h-7 sm:w-auto sm:h-auto text-xs sm:text-sm rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors gap-1"
          >
            <span>{activeTesters?.length || 0}</span>
            <span className="hidden sm:block">Assigned</span>
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
              <TableHead>Status</TableHead>
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
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className="font-medium text-xs bg-green-500/10 text-green-600 border-green-200 dark:border-green-900"
                    >
                      {req.status === "IN_PROGRESS" ? "Active" : req.status}
                    </Badge>
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
                    <span className="text-xs text-muted-foreground">
                      {req.tester?.email}
                    </span>
                  </div>
                </div>
                <Badge
                  variant="secondary"
                  className="absolute -top-2 -right-2 font-medium text-[8px] bg-green-500/10 text-green-600 border-green-200 dark:border-green-900 whitespace-nowrap"
                >
                  {req.status === "IN_PROGRESS" ? "Active" : req.status}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground bg-muted/30 p-2 rounded-lg">
                <div className="flex items-center gap-2">
                  <span>
                    {req?.tester?.userDetail?.experience_level || "N/A"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Smartphone className="w-3.5 h-3.5 opacity-70" />
                  <span>
                    {req?.tester?.userDetail?.device_company ||
                    req?.tester?.userDetail?.device_model
                      ? req?.tester?.userDetail?.device_company +
                        " " +
                        req?.tester?.userDetail?.device_model
                      : "N/A"}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {(!activeTesters || activeTesters.length === 0) && (
          <div className="p-8 text-center text-muted-foreground border-2 border-dashed rounded-xl">
            No testers assigned yet.
          </div>
        )}
      </div>
    </section>
  );
}
