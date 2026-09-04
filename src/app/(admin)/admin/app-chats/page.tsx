"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Tabs, TabsList, TabsContent, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { AppPagination } from "@/components/app-pagination";
import { useAppChats, useAppChatsCount, useAppChatsTotalUnread } from "@/hooks/useAdmin";
import { deleteAppChatAdmin } from "@/lib/apiCalls";
import type { AppChat, AppChatsCount } from "@/lib/types";
import { AppChatsTable } from "@/components/admin/app-chats/app-chats-table";
import { ROUTES } from "@/lib/routes";

const ITEMS_PER_PAGE = 8;

type TabKey =
  | "All"
  | "Pending"
  | "Running"
  | "Completed"
  | "Deleted";

type SubTabKey = "OPEN" | "IN_PROGRESS";

function mapStatusToTab(tab: string | null): TabKey {
  if (tab === "Pending" || tab === "WAITING_AGENT") return "Pending";
  if (
    tab === "Running" ||
    tab === "OPEN" ||
    tab === "IN_PROGRESS" ||
    tab === "AVAILABLE"
  )
    return "Running";
  if (tab === "Completed" || tab === "CLOSED") return "Completed";
  if (tab === "Deleted") return "Deleted";
  return "All";
}

function AdminAppChatsContent() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<TabKey>(
    mapStatusToTab(searchParams.get("tab")),
  );
  const [activeSubTab, setActiveSubTab] = useState<SubTabKey>(
    searchParams.get("sub") === "IN_PROGRESS" ? "IN_PROGRESS" : "OPEN",
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [deletingId, setDeletingId] = useState<number | null>(null);

  useEffect(() => {
    const tab = mapStatusToTab(searchParams.get("tab"));
    if (tab !== activeTab) {
      setActiveTab(tab);
      setCurrentPage(1);
    }
    const sub =
      searchParams.get("sub") === "IN_PROGRESS" ? "IN_PROGRESS" : "OPEN";
    if (sub !== activeSubTab) setActiveSubTab(sub);
  }, [searchParams]);

  const updateUrl = (params: Record<string, string | null>) => {
    const newParams = new URLSearchParams(searchParams.toString());
    Object.entries(params).forEach(([key, value]) => {
      if (!value || value === "All") {
        newParams.delete(key);
      } else {
        newParams.set(key, value);
      }
    });
    router.replace(`${pathname}?${newParams.toString()}`, { scroll: false });
  };

  const handleTabChange = (val: string) => {
    setActiveTab(val as TabKey);
    setCurrentPage(1);
    if (val !== "Running") updateUrl({ tab: val, sub: null });
    else updateUrl({ tab: "OPEN", sub: null });
  };

  const handleSubTabChange = (val: SubTabKey) => {
    setActiveSubTab(val);
    setCurrentPage(1);
    updateUrl({ tab: val, sub: val });
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const { data: chatsData, isLoading } = useAppChats();
  const { data: counts } = useAppChatsCount();
  const { data: totalUnreadData, refetch: refetchTotalUnread } =
    useAppChatsTotalUnread();
  const totalUnread = totalUnreadData?.totalUnread ?? 0;

  const handleUnreadChange = (_delta: number) => {
    refetchTotalUnread();
  };

  const allChats: AppChat[] = chatsData?.conversations || [];
  const countsData: AppChatsCount = counts || {
    all: 0,
    pending: 0,
    open: 0,
    inProgress: 0,
    completed: 0,
    deleted: 0,
  };

  const matchesTab = (chat: AppChat) => {
    if (activeTab === "All") return true;
    if (activeTab === "Pending") return chat.status === "WAITING_AGENT";
    if (activeTab === "Running") {
      if (activeSubTab === "OPEN") return chat.status === "OPEN";
      if (activeSubTab === "IN_PROGRESS")
        return chat.status === "IN_PROGRESS";
    }
    if (activeTab === "Completed") return chat.status === "CLOSED";
    if (activeTab === "Deleted")
      return chat.appDashboardAndHub === null;
    return true;
  };

  const filteredChats = allChats.filter((chat) => {
    if (!matchesTab(chat)) return false;
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    const appName =
      chat.appDashboardAndHub?.androidApp?.appName?.toLowerCase() || "";
    const userName = chat.user?.name?.toLowerCase() || "";
    const userEmail = chat.user?.email?.toLowerCase() || "";
    const subject = chat.subject?.toLowerCase() || "";
    return (
      appName.includes(q) ||
      userName.includes(q) ||
      userEmail.includes(q) ||
      subject.includes(q)
    );
  });

  const totalPages = Math.ceil(filteredChats.length / ITEMS_PER_PAGE);
  const paginatedChats = filteredChats.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const handleDelete = async (chatId: number) => {
    if (
      !confirm("This will permanently delete the chat history. Continue?")
    )
      return;
    setDeletingId(chatId);
    try {
      await deleteAppChatAdmin(chatId);
    } catch (err) {
      console.error("Failed to delete chat", err);
    } finally {
      setDeletingId(null);
    }
  };

  const handleView = (appId: number | undefined) => {
    if (!appId) return;
    router.push(`/admin/submissions-paid/${appId}`);
  };

  const tabsValue =
    activeTab === "Running"
      ? "Running"
      : activeTab;

  return (
    <div className="flex-1 space-y-6 container mx-auto px-4 md:px-6 py-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-b from-primary to-primary/40 bg-clip-text text-transparent leading-[unset] flex items-center gap-2">
            App Chats
            {totalUnread > 0 && (
              <Badge variant="destructive" className="ml-1 text-xs">
                {totalUnread > 99 ? "99+" : totalUnread} unread
              </Badge>
            )}
          </h2>
          <p className="text-sm sm:text-md text-muted-foreground">
            Review and manage conversations between app owners and testing
            managers.
          </p>
        </div>
      </div>

      <Tabs
        value={tabsValue}
        onValueChange={(val) => handleTabChange(val)}
        className="w-full grid grid-cols-1"
      >
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-auto">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by app, user, email, or subject..."
              className="pl-8 w-full md:w-[300px]"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
          <TabsList className="w-full md:w-auto flex gap-1">
            <TabsTrigger value="All">All ({countsData.all})</TabsTrigger>
            <TabsTrigger value="Pending">
              Pending ({countsData.pending})
            </TabsTrigger>
            <TabsTrigger value="Running">
              Running ({countsData.open + countsData.inProgress})
            </TabsTrigger>
            <TabsTrigger value="Completed">
              Completed ({countsData.completed})
            </TabsTrigger>
            <TabsTrigger value="Deleted">
              Deleted ({countsData.deleted})
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value={tabsValue} className="mt-4 grid grid-cols-1">
          {activeTab === "Running" && (
            <div className="flex justify-start mb-4">
              <div className="flex items-center gap-2 bg-muted rounded-lg p-1">
                {[
                  {
                    label: "Open",
                    value: "OPEN" as SubTabKey,
                    count: countsData.open,
                  },
                  {
                    label: "In Progress",
                    value: "IN_PROGRESS" as SubTabKey,
                    count: countsData.inProgress,
                  },
                ].map((tab) => (
                  <button
                    key={tab.value}
                    onClick={() => handleSubTabChange(tab.value)}
                    className={cn(
                      "rounded-lg px-4 py-1.5 text-xs sm:text-sm h-auto transition-colors",
                      activeSubTab === tab.value
                        ? "bg-black text-white dark:bg-white dark:text-black shadow-sm"
                        : "text-muted-foreground hover:text-foreground hover:bg-background/50",
                    )}
                  >
                    {tab.label} ({tab.count})
                  </button>
                ))}
              </div>
            </div>
          )}
          <div className="overflow-x-auto">
            <Card>
              <CardContent className="p-0">
                <AppChatsTable
                  chats={paginatedChats}
                  isLoading={isLoading}
                  onDelete={handleDelete}
                  onView={handleView}
                  deletingId={deletingId}
                  onUnreadChange={handleUnreadChange}
                />
              </CardContent>
            </Card>
          </div>
          {!isLoading && paginatedChats.length > 0 && (
            <AppPagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default function AdminAppChatsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
      <AdminAppChatsContent />
    </Suspense>
  );
}
