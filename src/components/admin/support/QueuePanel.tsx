"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Clock, User, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface PendingChat {
  id: number;
  userName: string;
  userEmail: string;
  userImage: string | null;
  createdAt: string;
  isEscalated: boolean;
  aiContext: string;
}

interface QueuePanelProps {
  queue: PendingChat[];
  loading: boolean;
  onTakeChat: (chatId: number) => void;
}

export function QueuePanel({ queue, loading, onTakeChat }: QueuePanelProps) {
  return (
    <Card className="flex flex-col h-full border-border/50">
      <CardHeader className="pb-3 flex-shrink-0">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2">
            <Clock className="h-4 w-4 text-amber-500" />
            Queue
          </CardTitle>
          <Badge variant="secondary" className="text-xs">
            {queue.length} waiting
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-0 flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="space-y-1 px-3 pb-3">
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="p-3 rounded-xl space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-3 w-32" />
                </div>
              ))
            ) : queue.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <User className="h-8 w-8 text-muted-foreground/40 mb-2" />
                <p className="text-sm text-muted-foreground">No pending chats</p>
                <p className="text-xs text-muted-foreground/60">All caught up!</p>
              </div>
            ) : (
              queue.map((chat) => (
                <div
                  key={chat.id}
                  className={cn(
                    "p-3 rounded-xl border transition-all hover:bg-secondary/50",
                    chat.isEscalated ? "border-orange-500/30 bg-orange-500/5" : "border-border/50"
                  )}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <p className="text-sm font-medium truncate">{chat.userName}</p>
                        {chat.isEscalated && (
                          <AlertCircle className="h-3 w-3 text-orange-500 flex-shrink-0" />
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground truncate">{chat.userEmail}</p>
                      <p className="text-[10px] text-muted-foreground/60 mt-1">
                        {formatTimeAgo(chat.createdAt)}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="default"
                      className="h-7 text-xs flex-shrink-0"
                      onClick={() => onTakeChat(chat.id)}
                    >
                      Take
                    </Button>
                  </div>
                  {chat.aiContext && (
                    <p className="text-[10px] text-muted-foreground/50 mt-2 line-clamp-2 italic border-t border-border/30 pt-2">
                      {chat.aiContext}
                    </p>
                  )}
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

function formatTimeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  return `${hours}h ${mins % 60}m ago`;
}
