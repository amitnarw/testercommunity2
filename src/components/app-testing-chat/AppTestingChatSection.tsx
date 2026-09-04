"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import { Button } from "@/components/ui/button";
import { MessageSquare, Shield } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SupportChat } from "@/components/support/SupportChat";
import { useAppChatUnreadCount } from "@/hooks/useAppChatUnreadCount";

interface AppTestingChatSectionProps {
  dashboardAndHubId: number;
  appName: string;
  appStatus?: string;
}

export function AppTestingChatSection({ dashboardAndHubId, appName, appStatus }: AppTestingChatSectionProps) {
  const [open, setOpen] = useState(false);
  const isCompleted = appStatus === "COMPLETED";
  const { count: unreadCount, reset, markRead } = useAppChatUnreadCount(dashboardAndHubId, "user", open);

  const handleOpenChange = (val: boolean) => {
    setOpen(val);
    if (val) {
      reset();
    } else {
      markRead();
    }
  };

  return (
    <>
      <Card className="h-full border shadow-sm overflow-hidden">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
              <Shield className="h-4 w-4 text-primary" />
            </div>
            <CardTitle className="text-base">Testing Manager</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <CardDescription>
            Chat with the Testing Manager about {appName}
          </CardDescription>
          <span className="relative inline-flex w-full">
            <Button
              onClick={() => handleOpenChange(true)}
              disabled={isCompleted}
              className="w-full rounded-xl shadow-md hover:shadow-lg active:scale-95 transition-all"
            >
              <MessageSquare className="w-4 h-4 mr-1.5" />
              {isCompleted ? "Chat Completed" : "Open Chat"}
            </Button>
            {unreadCount > 0 && (
              <span className="pointer-events-none absolute -top-1.5 -right-1.5 min-w-5 h-5 px-1 rounded-full bg-destructive text-destructive-foreground text-[10px] font-bold flex items-center justify-center z-10 ring-2 ring-card">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </span>
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="w-full h-dvh sm:max-w-2xl sm:h-[80vh] flex flex-col p-0 gap-0 overflow-hidden rounded-none sm:rounded-2xl" hideClose>
          <VisuallyHidden.Root asChild>
            <DialogTitle>Testing Manager Chat</DialogTitle>
          </VisuallyHidden.Root>
          <SupportChat
            mode="direct"
            directChatId={dashboardAndHubId}
            title="Testing Manager"
            open={open}
            onOpenChange={handleOpenChange}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
