"use client";

import { TicketsTable } from "@/components/admin/support/TicketsTable";

export default function AdminSupportTicketsPage() {
  return (
    <div className="px-4 sm:px-6 py-6 w-full">
      <div className="mb-6">
        <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-400 bg-clip-text text-transparent leading-[unset] pb-1">
          Support Tickets
        </h2>
        <p className="text-muted-foreground">Manage all support tickets across the platform.</p>
      </div>
      <TicketsTable />
    </div>
  );
}
