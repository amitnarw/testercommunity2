"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, Clock, CheckCircle2, Upload, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useMyPenalties, useSubmitPenaltyProof } from "@/hooks/usePenalty";
import { uploadFileDirectlyToR2 } from "@/lib/apiCalls";
import { SafeImage } from "@/components/safe-image";
import { useToast } from "@/hooks/use-toast";

function formatDeadline(deadline: string): string {
  const ms = new Date(deadline).getTime() - Date.now();
  if (ms <= 0) return "overdue";
  const days = Math.floor(ms / (24 * 60 * 60 * 1000));
  if (days > 0) return `${days}d left`;
  const hours = Math.floor(ms / (60 * 60 * 1000));
  return `${hours}h left`;
}

/**
 * P5: countdown text uses Date.now(), which differs between the SSR
 * prerender and the client ,  gate it behind a mounted flag to avoid a
 * hydration mismatch warning.
 */
function DeadlineBadge({ deadline }: { deadline: string }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return (
    <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
      <Clock className="w-3 h-3" />
      {mounted ? formatDeadline(deadline) : "\u00A0"}
    </span>
  );
}

export default function PenaltyPage() {
  const { data, isLoading } = useMyPenalties();
  const submit = useSubmitPenaltyProof();
  const { toast } = useToast();
  const [submittingId, setSubmittingId] = useState<number | null>(null);
  const [proofUrlByTask, setProofUrlByTask] = useState<Record<number, string>>({});

  const handleProofFile = async (taskId: number, file: File) => {
    // P3.1: dedicated multipart upload call ,  the old inline fetch used a
    // relative URL that never reached the backend and could not decrypt the
    // JWE response envelope, so proof upload failed every time.
    try {
      const { url } = await uploadFileDirectlyToR2(file, "penalty");
      setProofUrlByTask((p) => ({ ...p, [taskId]: url }));
    } catch (err) {
      toast({
        title: "Upload failed",
        description: err instanceof Error ? err.message : "Unknown error",
        variant: "destructive",
      });
    }
  };

  const handleSubmitProof = async (taskId: number) => {
    const url = proofUrlByTask[taskId];
    if (!url) {
      toast({
        title: "Upload required",
        description: "Please upload a screenshot of your penalty task first.",
        variant: "destructive",
      });
      return;
    }
    setSubmittingId(taskId);
    try {
      await submit.mutateAsync({ taskId, proofImageUrl: url });
      toast({
        title: "Proof submitted",
        description: "Your proof has been submitted for admin verification.",
      });
      setProofUrlByTask((p) => {
        const next = { ...p };
        delete next[taskId];
        return next;
      });
    } catch (err) {
      toast({
        title: "Submission failed",
        description: err instanceof Error ? err.message : "Unknown error",
        variant: "destructive",
      });
    } finally {
      setSubmittingId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8 space-y-4">
        <Skeleton className="h-20 rounded-2xl" />
        <Skeleton className="h-32 rounded-2xl" />
      </div>
    );
  }

  const activeTasks = data?.active ?? [];
  const isPenalized = data?.isPenalized ?? false;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      <header>
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2.5 rounded-full bg-red-500/15 text-red-600">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold">Penalty page</h1>
        </div>
        <p className="text-sm text-muted-foreground">
          When you miss required testing days, additional penalty tasks are
          assigned. Complete them to restore normal platform access.
        </p>
      </header>

      {isPenalized && (
        <Card className="border-red-500/30 bg-red-500/5">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-semibold text-red-700">
                  Normal access is restricted while you have {activeTasks.length}{" "}
                  active penalty {activeTasks.length === 1 ? "task" : "tasks"}.
                </p>
                <p className="text-muted-foreground mt-1">
                  You cannot publish or join new handshake tests until all
                  penalty tasks are completed and verified by an admin.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {!isPenalized && (
        <Card className="border-emerald-500/30 bg-emerald-500/5">
          <CardContent className="p-6 text-center">
            <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
            <p className="text-lg font-semibold mt-2">No active penalties</p>
            <p className="text-sm text-muted-foreground mt-1">
              You have full access. Keep up the great work!
            </p>
          </CardContent>
        </Card>
      )}

      {activeTasks.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
            Active penalty tasks ({activeTasks.length})
          </h2>
          {activeTasks.map((task) => (
            <Card key={task.id}>
              <CardContent className="p-4 space-y-3">
                <div className="flex items-start gap-3">
                  {task.sourceCampaign?.androidApp ? (
                    <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                      <SafeImage
                        src={task.sourceCampaign.androidApp.appLogoUrl}
                        alt={task.sourceCampaign.androidApp.appName}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : null}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold truncate">
                        {task.sourceCampaign?.androidApp?.appName || "Penalty task"}
                      </p>
                      <Badge variant="outline" className="bg-red-500/15 text-red-600 border-red-500/30">
                        {task.status === "IN_PROGRESS" ? "In review" : "Pending"}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">{task.reason}</p>
                    <DeadlineBadge deadline={task.deadline} />
                  </div>
                </div>

                <div className="border-t border-border/40 pt-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
                    Submit proof (screenshot)
                  </p>
                  <div className="flex items-center gap-2 flex-wrap">
                    <input
                      id={`file-${task.id}`}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) handleProofFile(task.id, f);
                      }}
                    />
                    <label
                      htmlFor={`file-${task.id}`}
                      className="cursor-pointer inline-flex items-center gap-1.5 px-3 h-9 rounded-lg border border-border/60 bg-secondary/40 hover:bg-secondary/60 text-sm"
                    >
                      <Upload className="w-4 h-4" />
                      {proofUrlByTask[task.id] ? "Replace image" : "Choose image"}
                    </label>
                    {proofUrlByTask[task.id] && (
                      <Button
                        size="sm"
                        onClick={() => handleSubmitProof(task.id)}
                        disabled={submittingId === task.id}
                      >
                        {submittingId === task.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          "Submit proof"
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {(data?.completed ?? 0) > 0 || (data?.failed ?? 0) > 0 ? (
        <div className="space-y-3 pt-3 border-t border-border/40">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
            History
          </h2>
          <div className="grid grid-cols-2 gap-3">
            <div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5">
              <p className="text-xs text-muted-foreground">Completed</p>
              <p className="text-2xl font-bold text-emerald-600 mt-1">
                {data?.completed ?? 0}
              </p>
            </div>
            <div className="p-4 rounded-xl border border-zinc-500/20 bg-zinc-500/5">
              <p className="text-xs text-muted-foreground">Failed</p>
              <p className="text-2xl font-bold text-zinc-600 mt-1">
                {data?.failed ?? 0}
              </p>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
