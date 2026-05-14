"use client";

import { QueuePanel } from "./QueuePanel";
import { ChatPanel } from "./ChatPanel";
import { AgentStatsPanel } from "./AgentStatsPanel";
import { useSupportQueue } from "@/hooks/useSupportQueue";

export function AgentDashboard() {
  const {
    queue,
    activeChats,
    loading,
    agentOnline,
    goOnline,
    goOffline,
    takeChat,
    closeChat,
  } = useSupportQueue();

  return (
    <div className="flex-1 w-full px-4 sm:px-6 py-6 max-w-full overflow-x-hidden">
      <div className="mb-6">
        <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-400 bg-clip-text text-transparent leading-[unset] pb-1">
          Live Support
        </h2>
        <p className="text-muted-foreground">Manage incoming support chat requests in real-time.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-220px)] min-h-[500px]">
        <div className="lg:col-span-1 overflow-hidden flex flex-col">
          <QueuePanel queue={queue} loading={loading} onTakeChat={takeChat} />
        </div>
        <div className="lg:col-span-2 overflow-hidden flex flex-col">
          <ChatPanel
            chats={activeChats}
            onCloseChat={closeChat}
          />
        </div>
        <div className="lg:col-span-1 overflow-hidden flex flex-col">
          <AgentStatsPanel
            online={agentOnline}
            onGoOnline={goOnline}
            onGoOffline={goOffline}
            queueLength={queue.length}
            activeCount={activeChats.length}
          />
        </div>
      </div>
    </div>
  );
}
