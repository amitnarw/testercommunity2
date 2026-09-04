"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import {
  Trash2,
  ExternalLink,
  MessageSquareQuote,
  MessageCircle,
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import Image from "next/image";
import type { AppChat } from "@/lib/types";
import { useAppChatUnreadCount } from "@/hooks/useAppChatUnreadCount";
import { SupportChat } from "@/components/support/SupportChat";

interface AppChatsTableProps {
  chats: AppChat[];
  isLoading: boolean;
  onDelete: (chatId: number) => void;
  onView: (appId: number | undefined) => void;
  deletingId: number | null;
  onUnreadChange: (delta: number) => void;
}

function StatusBadge({ status }: { status: string }) {
  const getStatusStyles = () => {
    switch (status) {
      case "OPEN":
      case "IN_PROGRESS":
      case "WAITING_AGENT":
        return "bg-green-500/20 text-green-700 dark:bg-green-500/10 dark:text-green-400 border-green-500/30";
      case "RESOLVED":
      case "CLOSED":
        return "bg-blue-500/20 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400 border-blue-500/30";
      default:
        return "bg-secondary text-secondary-foreground";
    }
  };

  return (
    <Badge
      variant="outline"
      className={cn("font-medium border", getStatusStyles())}
    >
      {status.replace(/_/g, " ")}
    </Badge>
  );
}

interface AppChatsTableRowProps {
  chat: AppChat;
  onDelete: (chatId: number) => void;
  onView: (appId: number | undefined) => void;
  deletingId: number | null;
  onUnreadChange: (delta: number) => void;
}

function AppChatsTableRow({
  chat,
  onDelete,
  onView,
  deletingId,
  onUnreadChange,
}: AppChatsTableRowProps) {
  const [chatOpen, setChatOpen] = useState(false);
  const app = chat.appDashboardAndHub;
  const appName = app?.androidApp?.appName || "Unknown App";
  const appLogo = app?.androidApp?.appLogoUrl || null;
  const canDelete = app?.status === "COMPLETED";
  const dashboardAndHubId = app?.id ?? null;

  const { count: unreadCount, reset, markRead } = useAppChatUnreadCount(
    dashboardAndHubId,
    "admin",
    chatOpen,
  );

  const handleChatOpenChange = (val: boolean) => {
    setChatOpen(val);
    if (val) {
      reset();
    } else {
      markRead().then(() => onUnreadChange(-unreadCount));
    }
  };

  return (
    <TableRow className="group">
      <TableCell className="font-medium">
        <div className="flex items-center gap-3">
          {appLogo ? (
            <Image
              src={appLogo}
              alt=""
              width={36}
              height={36}
              className="w-9 h-9 rounded-lg object-cover ring-1 ring-border"
            />
          ) : (
            <div className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center ring-1 ring-border">
              <MessageSquareQuote className="h-4 w-4 text-muted-foreground" />
            </div>
          )}
          <div className="flex flex-col">
            <span className="truncate text-xs md:text-sm max-w-[180px] sm:max-w-none font-medium">
              {appName}
            </span>
            {chat.subject && (
              <span className="text-xs text-muted-foreground truncate max-w-[180px] sm:max-w-none">
                {chat.subject}
              </span>
            )}
          </div>
        </div>
      </TableCell>
      <TableCell className="hidden sm:table-cell">
        <div className="flex flex-col">
          <span className="text-sm">{chat.user?.name || "Unknown"}</span>
          <span className="text-xs text-muted-foreground truncate max-w-[200px]">
            {chat.user?.email || ""}
          </span>
        </div>
      </TableCell>
      <TableCell className="hidden md:table-cell">
        <span className="text-muted-foreground text-sm">
          {chat.createdAt
            ? format(new Date(chat.createdAt), "yyyy-MM-dd")
            : "N/A"}
        </span>
      </TableCell>
      <TableCell className="hidden md:table-cell">
        <span className="text-muted-foreground text-sm">
          {chat.lastMessageAt
            ? format(new Date(chat.lastMessageAt), "yyyy-MM-dd HH:mm")
            : ", "}
        </span>
      </TableCell>
      <TableCell>
        <StatusBadge status={chat.status} />
      </TableCell>
      <TableCell className="text-right">
        <div className="flex items-center justify-end gap-1">
          <span className="relative inline-flex">
            <Button
              variant="outline"
              size="sm"
              className="h-8 px-2"
              onClick={() => handleChatOpenChange(true)}
              disabled={!dashboardAndHubId}
            >
              <MessageCircle className="h-4 w-4" />
              <span className="sr-only">Open Chat</span>
            </Button>
            {unreadCount > 0 && (
              <span className="pointer-events-none absolute -top-1.5 -right-1.5 min-w-5 h-5 px-1 rounded-full bg-destructive text-destructive-foreground text-[10px] font-bold flex items-center justify-center z-10 ring-2 ring-card">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </span>
          <Button
            variant="outline"
            size="sm"
            className="h-8 px-2"
            onClick={() => onView(app?.id)}
          >
            <ExternalLink className="h-4 w-4" />
            <span className="sr-only">View App</span>
          </Button>
          <Button
            variant="destructive"
            size="sm"
            className="h-8 px-2"
            disabled={!canDelete || deletingId === chat.id}
            onClick={() => onDelete(chat.id)}
          >
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">Delete</span>
          </Button>
        </div>
      </TableCell>

      <Dialog open={chatOpen} onOpenChange={handleChatOpenChange}>
        <DialogContent
          className="w-full h-dvh sm:max-w-2xl sm:h-[80vh] flex flex-col p-0 gap-0 overflow-hidden rounded-none sm:rounded-2xl"
          hideClose
        >
          <VisuallyHidden.Root asChild>
            <DialogTitle>
              Chat with {chat.user?.name || appName}
            </DialogTitle>
          </VisuallyHidden.Root>
          {dashboardAndHubId && (
            <SupportChat
              mode="direct"
              directChatId={dashboardAndHubId}
              title={`Chat with ${chat.user?.name || appName}`}
              open={chatOpen}
              onOpenChange={handleChatOpenChange}
              senderType="AGENT"
              viewerType="ADMIN"
            />
          )}
        </DialogContent>
      </Dialog>
    </TableRow>
  );
}

export function AppChatsTable({
  chats,
  isLoading,
  onDelete,
  onView,
  deletingId,
  onUnreadChange,
}: AppChatsTableProps) {
  return (
    <div className="rounded-md border grid grid-cols-1">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Application</TableHead>
            <TableHead className="hidden sm:table-cell">User</TableHead>
            <TableHead className="hidden md:table-cell">Created At</TableHead>
            <TableHead className="hidden md:table-cell">
              Last Activity
            </TableHead>
            <TableHead>Status</TableHead>
            <TableHead>
              <span className="sr-only">Actions</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <TableRow key={i}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Skeleton className="w-9 h-9 rounded-lg" />
                    <Skeleton className="h-4 w-28" />
                  </div>
                </TableCell>
                <TableCell className="hidden sm:table-cell">
                  <Skeleton className="h-4 w-32" />
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <Skeleton className="h-4 w-24" />
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <Skeleton className="h-4 w-24" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-5 w-20" />
                </TableCell>
                <TableCell className="text-right">
                  <Skeleton className="h-8 w-8 ml-auto rounded-md" />
                </TableCell>
              </TableRow>
            ))
          ) : chats.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={6}
                className="text-center py-8 text-muted-foreground"
              >
                <div className="flex flex-col items-center gap-2">
                  <MessageSquareQuote className="h-8 w-8 opacity-40" />
                  <span>No app chats found.</span>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            chats.map((chat) => (
              <AppChatsTableRow
                key={chat.id}
                chat={chat}
                onDelete={onDelete}
                onView={onView}
                deletingId={deletingId}
                onUnreadChange={onUnreadChange}
              />
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
