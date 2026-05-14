"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import API_ROUTES from "@/lib/apiRoutes";
import api from "@/lib/axios";

interface Ticket {
  id: number;
  userId: string | null;
  subject: string;
  description: string;
  status: string;
  category: string;
  createdAt: string;
  user: { name: string; email: string } | null;
  assignedUser: { name: string } | null;
  _count: { messages: number };
}

const statusColors: Record<string, string> = {
  PENDING: "bg-amber-500/20 text-amber-600 dark:text-amber-400",
  IN_PROGRESS: "bg-blue-500/20 text-blue-600 dark:text-blue-400",
  RESOLVED: "bg-green-500/20 text-green-600 dark:text-green-400",
  CLOSED: "bg-gray-500/20 text-gray-600 dark:text-gray-400",
};

export function TicketsTable() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API_ROUTES;
    api
      .get(API_ROUTES.ADMIN + "/support/human-chats")
      .then((res) => setTickets(res.data?.data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <Card className="border-border/50">
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Subject</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="hidden md:table-cell">Agent</TableHead>
              <TableHead className="hidden md:table-cell">Messages</TableHead>
              <TableHead className="hidden md:table-cell">Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: 6 }).map((_, j) => (
                    <TableCell key={j}><Skeleton className="h-4 w-20" /></TableCell>
                  ))}
                </TableRow>
              ))
            ) : tickets.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  No tickets found
                </TableCell>
              </TableRow>
            ) : (
              tickets.map((ticket) => (
                <TableRow key={ticket.id}>
                  <TableCell className="font-medium text-sm max-w-[200px] truncate">
                    {ticket.subject}
                  </TableCell>
                  <TableCell className="text-sm">{ticket.user?.name || "Anonymous"}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-xs">
                      {ticket.category}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={`text-xs ${statusColors[ticket.status] || ""}`}>
                      {ticket.status.replace(/_/g, " ")}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-sm">
                    {ticket.assignedUser?.name || "-"}
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-sm">
                    {ticket._count.messages}
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-xs text-muted-foreground">
                    {format(new Date(ticket.createdAt), "MMM d, yyyy")}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
