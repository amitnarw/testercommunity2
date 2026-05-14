"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { MessageSquare, Clock, Users, Power } from "lucide-react";

interface AgentStatsPanelProps {
  online: boolean;
  onGoOnline: () => void;
  onGoOffline: () => void;
  queueLength: number;
  activeCount: number;
}

export function AgentStatsPanel({
  online,
  onGoOnline,
  onGoOffline,
  queueLength,
  activeCount,
}: AgentStatsPanelProps) {
  return (
    <Card className="flex flex-col h-full border-border/50">
      <CardHeader className="pb-3 flex-shrink-0">
        <CardTitle className="text-sm flex items-center gap-2">
          <Users className="h-4 w-4 text-violet-500" />
          Agent Status
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between p-3 rounded-xl bg-secondary/30">
          <div className="flex items-center gap-2">
            <div className={cn(
              "h-2.5 w-2.5 rounded-full animate-pulse",
              online ? "bg-green-500" : "bg-gray-400"
            )} />
            <span className="text-sm font-medium">{online ? "Online" : "Offline"}</span>
          </div>
          <Button
            size="sm"
            variant={online ? "outline" : "default"}
            className="h-7 text-xs"
            onClick={online ? onGoOffline : onGoOnline}
          >
            <Power className="h-3 w-3 mr-1" />
            {online ? "Go Offline" : "Go Online"}
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 rounded-xl bg-secondary/20 text-center">
            <MessageSquare className="h-4 w-4 text-amber-500 mx-auto mb-1" />
            <p className="text-lg font-bold">{queueLength}</p>
            <p className="text-[10px] text-muted-foreground">In Queue</p>
          </div>
          <div className="p-3 rounded-xl bg-secondary/20 text-center">
            <Clock className="h-4 w-4 text-blue-500 mx-auto mb-1" />
            <p className="text-lg font-bold">{activeCount}</p>
            <p className="text-[10px] text-muted-foreground">Active</p>
          </div>
        </div>

        <div className="pt-2 border-t border-border/50">
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium mb-2">
            Quick Tips
          </p>
          <ul className="space-y-1 text-xs text-muted-foreground/70">
            <li>• Click Take to accept a chat from the queue</li>
            <li>• Type & press Enter to reply</li>
            <li>• Click Close to resolve a chat</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}


