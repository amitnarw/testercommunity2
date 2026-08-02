"use client";

import { useState, useEffect } from "react";
import { getAppChatsAdmin, deleteAppChatAdmin } from "@/lib/apiCalls";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Trash2, MessageSquare, Shield, ExternalLink } from "lucide-react";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/lib/routes";

interface AppChat {
  id: number;
  status: string;
  subject: string | null;
  createdAt: string;
  lastMessageAt: string | null;
  user: { id: string; name: string; email: string; image: string | null } | null;
  appDashboardAndHub: {
    id: number;
    status: string;
    androidApp: { appName: string; appLogoUrl: string } | null;
  } | null;
}

export default function AppChatsPage() {
  const [chats, setChats] = useState<AppChat[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("ALL");
  const [deleting, setDeleting] = useState<number | null>(null);
  const router = useRouter();

  const fetchChats = async () => {
    setLoading(true);
    try {
      const data = await getAppChatsAdmin({ status: filter });
      setChats(data?.conversations || []);
    } catch (err) {
      console.error("Failed to fetch app chats", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChats();
  }, [filter]);

  const handleDelete = async (chatId: number) => {
    if (!confirm("This will permanently delete the chat history. Continue?")) return;
    setDeleting(chatId);
    try {
      await deleteAppChatAdmin(chatId);
      setChats((prev) => prev.filter((c) => c.id !== chatId));
    } catch (err) {
      console.error("Failed to delete chat", err);
    } finally {
      setDeleting(null);
    }
  };

  const getStatusBadge = (appStatus: string | undefined) => {
    if (!appStatus) return <Badge variant="outline">Unknown</Badge>;
    switch (appStatus) {
      case "COMPLETED":
        return <Badge variant="secondary" className="bg-green-500/10 text-green-600">Completed</Badge>;
      case "IN_TESTING":
        return <Badge variant="default">In Testing</Badge>;
      case "IN_REVIEW":
        return <Badge variant="outline">In Review</Badge>;
      case "REJECTED":
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="outline">{appStatus}</Badge>;
    }
  };

  const filters = ["ALL", "ACTIVE", "COMPLETED", "DELETED"];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Shield className="w-6 h-6 text-primary" />
          App Testing Chats
        </h1>
        <p className="text-muted-foreground mt-1">
          Manage chat conversations between app owners and testing managers
        </p>
      </div>

      <div className="flex gap-2 mb-4">
        {filters.map((f) => (
          <Button
            key={f}
            variant={filter === f ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter(f)}
          >
            {f === "ALL" ? "All" : f.charAt(0) + f.slice(1).toLowerCase()}
          </Button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full" />
          ))}
        </div>
      ) : chats.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <MessageSquare className="w-12 h-12 mx-auto mb-3 text-muted-foreground/50" />
            <p className="text-muted-foreground">No app chats found</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {chats.map((chat) => {
            const app = chat.appDashboardAndHub;
            const appStatus = app?.status;
            const canDelete = appStatus === "COMPLETED";

            return (
              <Card key={chat.id} className="hover:bg-accent/50 transition-colors">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Shield className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-medium truncate">
                            {app?.androidApp?.appName || "Unknown App"}
                          </p>
                          {getStatusBadge(appStatus)}
                        </div>
                        <p className="text-sm text-muted-foreground truncate">
                          {chat.user?.name || "Unknown"} ({chat.user?.email || "no email"})
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {chat.lastMessageAt
                            ? `Last activity: ${format(new Date(chat.lastMessageAt), "MMM d, yyyy HH:mm")}`
                            : `Created: ${format(new Date(chat.createdAt), "MMM d, yyyy")}`}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => router.push(`${ROUTES.AUTHENTICATED.PRO_TESTING}/project/${app?.id}`)}
                      >
                        <ExternalLink className="w-4 h-4 mr-1" />
                        View App
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        disabled={!canDelete || deleting === chat.id}
                        onClick={() => handleDelete(chat.id)}
                      >
                        {deleting === chat.id ? "..." : <Trash2 className="w-4 h-4" />}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
